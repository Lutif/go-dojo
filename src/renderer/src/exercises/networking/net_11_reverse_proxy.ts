import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_11_reverse_proxy',
  title: 'Reverse Proxy',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'advanced',
  order: 11,
  description: `Build a reverse proxy that forwards HTTP requests to a backend server and rewrites headers. A reverse proxy sits between clients and backend servers, forwarding requests and optionally modifying them.

Key concepts:
- Read the incoming request and forward it to the backend using \`http.Client\`
- Copy the response status code, headers, and body back to the client
- Add an \`X-Forwarded-For\` header with the client's IP address
- Add an \`X-Proxy\` header to indicate the response passed through the proxy
- Use \`httptest.NewServer\` for both the backend and proxy in tests

Example flow:

    Client -> Proxy -> Backend
    Client <- Proxy <- Backend

Your task:
1. Implement \`NewReverseProxy(backendURL string) http.Handler\` -- returns an HTTP handler that forwards all requests to the backend URL
2. The proxy must copy the request method, path, query string, headers, and body to the backend
3. The proxy must add \`X-Forwarded-For\` header with the client remote address
4. The proxy must add \`X-Proxy: go-dojo-proxy\` to the response headers
5. The proxy must copy the backend's status code, headers, and body back to the client`,
  code: `package main

import (
	"net/http"
)

// NewReverseProxy returns an http.Handler that forwards requests
// to the given backend URL.
//
// Requirements:
// - Forward the original method, path, query, headers, and body
// - Add X-Forwarded-For header with the client's address
// - Add X-Proxy: go-dojo-proxy to the response
// - Copy the backend's status code, headers, and body to the response
//
// TODO: Implement this function
func NewReverseProxy(backendURL string) http.Handler {
	_ = http.DefaultClient
	return nil
}

func main() {}`,
  testCode: `package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestProxyForwardsGET(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			t.Errorf("backend method = %s, want GET", r.Method)
		}
		w.Header().Set("X-Backend", "true")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("backend response"))
	}))
	defer backend.Close()

	proxy := httptest.NewServer(NewReverseProxy(backend.URL))
	defer proxy.Close()

	resp, err := http.Get(proxy.URL + "/test?q=1")
	if err != nil {
		t.Fatalf("GET proxy: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if string(body) != "backend response" {
		t.Errorf("body = %q, want %q", string(body), "backend response")
	}
	if resp.Header.Get("X-Backend") != "true" {
		t.Error("missing X-Backend header from backend")
	}
}

func TestProxyForwardsPOST(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			t.Errorf("backend method = %s, want POST", r.Method)
		}
		body, _ := io.ReadAll(r.Body)
		w.WriteHeader(http.StatusCreated)
		w.Write(body)
	}))
	defer backend.Close()

	proxy := httptest.NewServer(NewReverseProxy(backend.URL))
	defer proxy.Close()

	resp, err := http.Post(proxy.URL+"/items", "text/plain", strings.NewReader("new item"))
	if err != nil {
		t.Fatalf("POST proxy: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusCreated)
	}
	body, _ := io.ReadAll(resp.Body)
	if string(body) != "new item" {
		t.Errorf("body = %q, want %q", string(body), "new item")
	}
}

func TestProxyAddsXForwardedFor(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		xff := r.Header.Get("X-Forwarded-For")
		if xff == "" {
			t.Error("missing X-Forwarded-For header")
		}
		w.Write([]byte("ok"))
	}))
	defer backend.Close()

	proxy := httptest.NewServer(NewReverseProxy(backend.URL))
	defer proxy.Close()

	resp, err := http.Get(proxy.URL)
	if err != nil {
		t.Fatalf("GET: %v", err)
	}
	resp.Body.Close()
}

func TestProxyAddsXProxyHeader(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	}))
	defer backend.Close()

	proxy := httptest.NewServer(NewReverseProxy(backend.URL))
	defer proxy.Close()

	resp, err := http.Get(proxy.URL)
	if err != nil {
		t.Fatalf("GET: %v", err)
	}
	defer resp.Body.Close()

	xp := resp.Header.Get("X-Proxy")
	if xp != "go-dojo-proxy" {
		t.Errorf("X-Proxy = %q, want %q", xp, "go-dojo-proxy")
	}
}

func TestProxyForwardsPath(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(r.URL.Path + "?" + r.URL.RawQuery))
	}))
	defer backend.Close()

	proxy := httptest.NewServer(NewReverseProxy(backend.URL))
	defer proxy.Close()

	resp, err := http.Get(proxy.URL + "/api/users?page=2")
	if err != nil {
		t.Fatalf("GET: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if string(body) != "/api/users?page=2" {
		t.Errorf("forwarded path = %q, want %q", string(body), "/api/users?page=2")
	}
}

func TestProxyCopiesStatusCode(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("not found"))
	}))
	defer backend.Close()

	proxy := httptest.NewServer(NewReverseProxy(backend.URL))
	defer proxy.Close()

	resp, err := http.Get(proxy.URL + "/missing")
	if err != nil {
		t.Fatalf("GET: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusNotFound)
	}
}`,
  solution: `package main

import (
	"io"
	"net/http"
)

// NewReverseProxy returns an http.Handler that forwards requests
// to the given backend URL.
func NewReverseProxy(backendURL string) http.Handler {
	client := &http.Client{}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Build the backend request URL
		targetURL := backendURL + r.URL.Path
		if r.URL.RawQuery != "" {
			targetURL += "?" + r.URL.RawQuery
		}

		// Create the forwarded request
		proxyReq, err := http.NewRequest(r.Method, targetURL, r.Body)
		if err != nil {
			http.Error(w, "proxy error", http.StatusBadGateway)
			return
		}

		// Copy original headers
		for key, values := range r.Header {
			for _, v := range values {
				proxyReq.Header.Add(key, v)
			}
		}

		// Add X-Forwarded-For
		proxyReq.Header.Set("X-Forwarded-For", r.RemoteAddr)

		// Send request to backend
		resp, err := client.Do(proxyReq)
		if err != nil {
			http.Error(w, "backend error", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		// Copy backend response headers to client
		for key, values := range resp.Header {
			for _, v := range values {
				w.Header().Add(key, v)
			}
		}

		// Add proxy header
		w.Header().Set("X-Proxy", "go-dojo-proxy")

		// Copy status code and body
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
	})
}

func main() {}`,
  hints: [
    'Use http.NewRequest(r.Method, targetURL, r.Body) to create the forwarded request with the same method and body.',
    'Copy headers by ranging over r.Header and adding each key-value pair to the proxy request.',
    'Set X-Forwarded-For to r.RemoteAddr before sending the proxy request.',
    'Copy response headers before calling w.WriteHeader() -- headers set after WriteHeader are ignored.',
  ],
}

export default exercise

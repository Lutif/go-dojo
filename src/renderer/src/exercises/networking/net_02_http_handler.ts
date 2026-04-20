import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_02_http_handler',
  title: 'HTTP Handler',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'beginner',
  order: 2,
  description: `Create HTTP handlers using Go's \`net/http\` package. An HTTP handler processes incoming requests and writes responses.

Key concepts:
- \`http.Handler\` is an interface with \`ServeHTTP(w http.ResponseWriter, r *http.Request)\`
- \`http.HandleFunc\` registers a handler function for a path
- \`http.ServeMux\` is a request multiplexer (router)
- \`httptest.NewServer\` creates a test server

Your task:
1. Implement \`NewMux() *http.ServeMux\` that returns a mux with these routes:
   - \`GET /hello\` responds with \`Hello, World!\` and status 200
   - \`GET /greet?name=X\` responds with \`Hello, X!\` (defaults to \`Hello, stranger!\` if no name)
   - \`POST /echo\` reads the request body and echoes it back
   - Any other path returns 404 with body \`not found\``,
  code: `package main

import (
	"net/http"
)

// NewMux creates and returns a ServeMux with the following routes:
// - GET /hello       -> responds "Hello, World!" (200)
// - GET /greet?name= -> responds "Hello, <name>!" or "Hello, stranger!" (200)
// - POST /echo       -> echoes the request body back (200)
// - everything else  -> "not found" (404)
// TODO: Implement this function
func NewMux() *http.ServeMux {
	mux := http.NewServeMux()
	return mux
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

func TestHelloEndpoint(t *testing.T) {
	srv := httptest.NewServer(NewMux())
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/hello")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	if string(body) != "Hello, World!" {
		t.Errorf("body = %q, want %q", string(body), "Hello, World!")
	}
}

func TestGreetEndpoint(t *testing.T) {
	srv := httptest.NewServer(NewMux())
	defer srv.Close()

	tests := []struct {
		query string
		want  string
	}{
		{"?name=Alice", "Hello, Alice!"},
		{"?name=Bob", "Hello, Bob!"},
		{"", "Hello, stranger!"},
	}

	for _, tt := range tests {
		resp, err := http.Get(srv.URL + "/greet" + tt.query)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		if string(body) != tt.want {
			t.Errorf("greet%s: got %q, want %q", tt.query, string(body), tt.want)
		}
	}
}

func TestEchoEndpoint(t *testing.T) {
	srv := httptest.NewServer(NewMux())
	defer srv.Close()

	payload := "this is the echo body"
	resp, err := http.Post(srv.URL+"/echo", "text/plain", strings.NewReader(payload))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if string(body) != payload {
		t.Errorf("body = %q, want %q", string(body), payload)
	}
}

func TestNotFound(t *testing.T) {
	srv := httptest.NewServer(NewMux())
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/nonexistent")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 404 {
		t.Errorf("status = %d, want 404", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	if string(body) != "not found" {
		t.Errorf("body = %q, want %q", string(body), "not found")
	}
}`,
  solution: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!")
	})

	mux.HandleFunc("/greet", func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")
		if name == "" {
			name = "stranger"
		}
		fmt.Fprintf(w, "Hello, %s!", name)
	})

	mux.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		w.Write(body)
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/hello" && r.URL.Path != "/greet" && r.URL.Path != "/echo" {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprint(w, "not found")
		}
	})

	return mux
}

func main() {}`,
  hints: [
    'Use mux.HandleFunc("/path", handlerFunc) to register routes.',
    'Access query parameters with r.URL.Query().Get("name").',
    'For the echo endpoint, read the body with io.ReadAll(r.Body) and write it back.',
    'Register a catch-all "/" handler last -- it matches anything not matched by more specific routes.',
  ],
}

export default exercise

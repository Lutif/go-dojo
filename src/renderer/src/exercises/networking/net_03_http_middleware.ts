import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_03_http_middleware',
  title: 'HTTP Middleware',
  category: 'Networking',
  subcategory: 'HTTP',
  difficulty: 'intermediate',
  order: 3,
  description: `Build HTTP middleware to wrap handlers with cross-cutting concerns. Middleware is a function that takes an \`http.Handler\` and returns a new \`http.Handler\`, executing logic before and/or after the wrapped handler.

Common middleware pattern:
\`\`\`
func MyMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // before
        next.ServeHTTP(w, r)
        // after
    })
}
\`\`\`

Your task:
1. \`LoggingMiddleware(next http.Handler, log *[]string)\` -- appends \`"<METHOD> <PATH>"\` to the log slice before calling next
2. \`AuthMiddleware(next http.Handler, token string)\` -- checks for \`Authorization\` header matching \`"Bearer <token>"\`; returns 401 with body \`unauthorized\` if missing/wrong
3. \`Chain(handler http.Handler, middlewares ...func(http.Handler) http.Handler)\` -- applies middlewares so the first in the list is the outermost wrapper`,
  code: `package main

import (
	"net/http"
)

// LoggingMiddleware logs each request as "<METHOD> <PATH>" into the provided slice.
// TODO: Implement this function
func LoggingMiddleware(next http.Handler, log *[]string) http.Handler {
	return next
}

// AuthMiddleware checks that the Authorization header equals "Bearer <token>".
// If not, respond with 401 and body "unauthorized".
// TODO: Implement this function
func AuthMiddleware(next http.Handler, token string) http.Handler {
	return next
}

// Chain applies middlewares to the handler. The first middleware in the
// list should be the outermost (executed first).
// TODO: Implement this function
func Chain(handler http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	return handler
}

func main() {}`,
  testCode: `package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestLoggingMiddleware(t *testing.T) {
	var logs []string
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	srv := httptest.NewServer(LoggingMiddleware(handler, &logs))
	defer srv.Close()

	http.Get(srv.URL + "/foo")
	http.Get(srv.URL + "/bar")

	if len(logs) != 2 {
		t.Fatalf("expected 2 log entries, got %d", len(logs))
	}
	if logs[0] != "GET /foo" {
		t.Errorf("log[0] = %q, want %q", logs[0], "GET /foo")
	}
	if logs[1] != "GET /bar" {
		t.Errorf("log[1] = %q, want %q", logs[1], "GET /bar")
	}
}

func TestAuthMiddleware_ValidToken(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("secret data"))
	})

	srv := httptest.NewServer(AuthMiddleware(handler, "mytoken"))
	defer srv.Close()

	req, _ := http.NewRequest("GET", srv.URL+"/secret", nil)
	req.Header.Set("Authorization", "Bearer mytoken")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	if string(body) != "secret data" {
		t.Errorf("body = %q, want %q", string(body), "secret data")
	}
}

func TestAuthMiddleware_InvalidToken(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("secret data"))
	})

	srv := httptest.NewServer(AuthMiddleware(handler, "mytoken"))
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/secret")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 401 {
		t.Errorf("status = %d, want 401", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	if string(body) != "unauthorized" {
		t.Errorf("body = %q, want %q", string(body), "unauthorized")
	}
}

func TestChain(t *testing.T) {
	var logs []string
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	logging := func(next http.Handler) http.Handler {
		return LoggingMiddleware(next, &logs)
	}
	auth := func(next http.Handler) http.Handler {
		return AuthMiddleware(next, "secret")
	}

	srv := httptest.NewServer(Chain(handler, logging, auth))
	defer srv.Close()

	// Without token: logging runs, auth blocks
	resp, _ := http.Get(srv.URL + "/test")
	resp.Body.Close()
	if resp.StatusCode != 401 {
		t.Errorf("status = %d, want 401", resp.StatusCode)
	}
	if len(logs) != 1 {
		t.Errorf("expected 1 log entry (logging runs before auth), got %d", len(logs))
	}

	// With token: both run
	req, _ := http.NewRequest("GET", srv.URL+"/test2", nil)
	req.Header.Set("Authorization", "Bearer secret")
	resp2, _ := http.DefaultClient.Do(req)
	body, _ := io.ReadAll(resp2.Body)
	resp2.Body.Close()
	if string(body) != "ok" {
		t.Errorf("body = %q, want %q", string(body), "ok")
	}
}`,
  solution: `package main

import (
	"fmt"
	"net/http"
)

func LoggingMiddleware(next http.Handler, log *[]string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		entry := fmt.Sprintf("%s %s", r.Method, r.URL.Path)
		*log = append(*log, entry)
		next.ServeHTTP(w, r)
	})
}

func AuthMiddleware(next http.Handler, token string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		expected := "Bearer " + token
		if r.Header.Get("Authorization") != expected {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("unauthorized"))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func Chain(handler http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		handler = middlewares[i](handler)
	}
	return handler
}

func main() {}`,
  hints: [
    'Middleware takes an http.Handler and returns an http.Handler -- use http.HandlerFunc to wrap a closure.',
    'For logging, use fmt.Sprintf("%s %s", r.Method, r.URL.Path) and append to the slice.',
    'For auth, check r.Header.Get("Authorization") against "Bearer " + token.',
    'For Chain, apply middlewares in reverse order so the first one in the list is outermost.',
  ],
}

export default exercise

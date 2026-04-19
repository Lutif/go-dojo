import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_16_http_middleware',
  title: 'HTTP Middleware',
  category: 'Standard Library',
  subcategory: 'HTTP',
  difficulty: 'advanced',
  order: 16,
  description: `Middleware wraps an HTTP handler with additional behavior:

\`\`\`
func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL.Path)
        next.ServeHTTP(w, r)  // call the next handler
    })
}
\`\`\`

Middleware can:
- Run code **before** the handler (logging, auth checks)
- Run code **after** the handler (response timing)
- Modify the request or response
- Short-circuit (return early without calling next)

Chain middleware: \`Logger(Auth(handler))\`

Your task: build reusable HTTP middleware.`,
  code: `package main

import "net/http"

// AddHeader adds a custom header to every response.
func AddHeader(key, value string, next http.Handler) http.Handler {
	// TODO: Return handler that sets header then calls next
	return nil
}

// RequireMethod returns 405 if the request method doesn't match.
// Otherwise calls next.
func RequireMethod(method string, next http.Handler) http.Handler {
	// TODO
	return nil
}

// Chain applies middleware in order: first middleware wraps the outermost layer.
// Chain(handler, m1, m2) → m1(m2(handler))
func Chain(handler http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	// TODO: Apply in reverse order
	return nil
}`,
  testCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAddHeader(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})
	handler := AddHeader("X-Custom", "test-value", inner)
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Header().Get("X-Custom") != "test-value" {
		t.Errorf("header = %q", rec.Header().Get("X-Custom"))
	}
	if rec.Body.String() != "ok" {
		t.Errorf("body = %q", rec.Body.String())
	}
}

func TestRequireMethodAllowed(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})
	handler := RequireMethod("GET", inner)
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != 200 || rec.Body.String() != "ok" {
		t.Errorf("code=%d body=%q", rec.Code, rec.Body.String())
	}
}

func TestRequireMethodDenied(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})
	handler := RequireMethod("POST", inner)
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != 405 {
		t.Errorf("code = %d, want 405", rec.Code)
	}
}

func TestChain(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})

	addA := func(next http.Handler) http.Handler {
		return AddHeader("X-A", "1", next)
	}
	addB := func(next http.Handler) http.Handler {
		return AddHeader("X-B", "2", next)
	}

	handler := Chain(inner, addA, addB)
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Header().Get("X-A") != "1" {
		t.Error("missing X-A header")
	}
	if rec.Header().Get("X-B") != "2" {
		t.Error("missing X-B header")
	}
	if rec.Body.String() != "ok" {
		t.Errorf("body = %q", rec.Body.String())
	}
}`,
  solution: `package main

import (
	"fmt"
	"net/http"
)

func AddHeader(key, value string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(key, value)
		next.ServeHTTP(w, r)
	})
}

func RequireMethod(method string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != method {
			w.WriteHeader(http.StatusMethodNotAllowed)
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

var _ = fmt.Fprint`,
  hints: [
    'AddHeader: return http.HandlerFunc that sets the header with w.Header().Set(), then calls next.ServeHTTP(w, r).',
    'RequireMethod: check r.Method. If wrong, w.WriteHeader(405) and return without calling next.',
    'Chain: apply middlewares in reverse order so the first middleware listed is the outermost wrapper.'
  ],
}

export default exercise

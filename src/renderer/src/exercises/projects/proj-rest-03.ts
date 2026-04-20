import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-03',
  title: 'REST Framework — Middleware Chain',
  category: 'Projects',
  subcategory: 'REST Framework',
  difficulty: 'advanced',
  order: 30,
  description: `Add middleware support to the router. Middleware wraps all handlers and runs in the order added.

Add:
- Use(middleware func(http.Handler) http.Handler): register middleware that wraps all route handlers
- Middleware runs in registration order (first Use'd = outermost wrapper)

Middleware can modify the request/response, short-circuit the chain, or add headers.`,
  code: `package main

import (
	"context"
	"net/http"
	"strings"
)

// --- Router with path params from Steps 1-2 ---

type contextKey string

const paramsKey contextKey = "params"

type route struct {
	method   string
	segments []string
	handler  http.HandlerFunc
}

type Router struct {
	routes      []route
	// TODO: Add a middleware slice field.
}

func NewRouter() *Router {
	return &Router{}
}

func (r *Router) Handle(method string, pattern string, handler http.HandlerFunc) {
	segments := strings.Split(strings.Trim(pattern, "/"), "/")
	r.routes = append(r.routes, route{method: method, segments: segments, handler: handler})
}

// TODO: Implement Use(mw func(http.Handler) http.Handler) to register middleware.

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// TODO: Build the handler chain by wrapping the core dispatch logic
	//       with all registered middleware, then call the chain.

	// Core dispatch logic (move this into a handler that middleware wraps):
	path := strings.Trim(req.URL.Path, "/")
	reqSegments := strings.Split(path, "/")

	pathMatched := false
	for _, rt := range r.routes {
		params, ok := matchSegments(rt.segments, reqSegments)
		if !ok {
			continue
		}
		pathMatched = true
		if rt.method != req.Method {
			continue
		}
		ctx := context.WithValue(req.Context(), paramsKey, params)
		rt.handler(w, req.WithContext(ctx))
		return
	}

	if pathMatched {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	http.Error(w, "Not Found", http.StatusNotFound)
}

func matchSegments(pattern, path []string) (map[string]string, bool) {
	if len(pattern) != len(path) {
		return nil, false
	}
	params := make(map[string]string)
	for i, seg := range pattern {
		if strings.HasPrefix(seg, ":") {
			params[seg[1:]] = path[i]
		} else if seg != path[i] {
			return nil, false
		}
	}
	return params, true
}

func PathParam(r *http.Request, name string) string {
	params, ok := r.Context().Value(paramsKey).(map[string]string)
	if !ok {
		return ""
	}
	return params[name]
}

func main() {}
`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMiddlewareAddsHeader(t *testing.T) {
	r := NewRouter()
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("X-Custom", "middleware-was-here")
			next.ServeHTTP(w, req)
		})
	})
	r.Handle("GET", "/ping", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("pong"))
	})

	req := httptest.NewRequest("GET", "/ping", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Header().Get("X-Custom") != "middleware-was-here" {
		t.Fatalf("expected X-Custom header, got '%s'", rec.Header().Get("X-Custom"))
	}
	if rec.Body.String() != "pong" {
		t.Fatalf("expected 'pong', got '%s'", rec.Body.String())
	}
}

func TestMiddlewareOrder(t *testing.T) {
	r := NewRouter()
	order := ""

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			order += "A"
			next.ServeHTTP(w, req)
			order += "a"
		})
	})
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			order += "B"
			next.ServeHTTP(w, req)
			order += "b"
		})
	})
	r.Handle("GET", "/test", func(w http.ResponseWriter, req *http.Request) {
		order += "H"
		w.Write([]byte("ok"))
	})

	req := httptest.NewRequest("GET", "/test", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if order != "ABHba" {
		t.Fatalf("expected middleware order 'ABHba', got '%s'", order)
	}
}

func TestMiddlewareShortCircuit(t *testing.T) {
	r := NewRouter()
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			if req.Header.Get("X-Block") == "true" {
				http.Error(w, "Blocked", http.StatusForbidden)
				return
			}
			next.ServeHTTP(w, req)
		})
	})
	r.Handle("GET", "/secret", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("allowed"))
	})

	// Blocked request
	req1 := httptest.NewRequest("GET", "/secret", nil)
	req1.Header.Set("X-Block", "true")
	rec1 := httptest.NewRecorder()
	r.ServeHTTP(rec1, req1)
	if rec1.Code != 403 {
		t.Fatalf("expected 403, got %d", rec1.Code)
	}

	// Allowed request
	req2 := httptest.NewRequest("GET", "/secret", nil)
	rec2 := httptest.NewRecorder()
	r.ServeHTTP(rec2, req2)
	if rec2.Body.String() != "allowed" {
		t.Fatalf("expected 'allowed', got '%s'", rec2.Body.String())
	}
}

func TestMiddlewareWith404(t *testing.T) {
	r := NewRouter()
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("X-MW", "ran")
			next.ServeHTTP(w, req)
		})
	})

	req := httptest.NewRequest("GET", "/nonexistent", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 404 {
		t.Fatalf("expected 404, got %d", rec.Code)
	}
	if rec.Header().Get("X-MW") != "ran" {
		t.Fatal("middleware should still run even for 404 routes")
	}
}
`,
  solution: `package main

import (
	"context"
	"net/http"
	"strings"
)

type contextKey string

const paramsKey contextKey = "params"

type route struct {
	method   string
	segments []string
	handler  http.HandlerFunc
}

type Router struct {
	routes     []route
	middleware []func(http.Handler) http.Handler
}

func NewRouter() *Router {
	return &Router{}
}

func (r *Router) Handle(method string, pattern string, handler http.HandlerFunc) {
	segments := strings.Split(strings.Trim(pattern, "/"), "/")
	r.routes = append(r.routes, route{method: method, segments: segments, handler: handler})
}

func (r *Router) Use(mw func(http.Handler) http.Handler) {
	r.middleware = append(r.middleware, mw)
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// Core dispatch as an http.Handler
	core := http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		path := strings.Trim(req.URL.Path, "/")
		reqSegments := strings.Split(path, "/")

		pathMatched := false
		for _, rt := range r.routes {
			params, ok := matchSegments(rt.segments, reqSegments)
			if !ok {
				continue
			}
			pathMatched = true
			if rt.method != req.Method {
				continue
			}
			ctx := context.WithValue(req.Context(), paramsKey, params)
			rt.handler(w, req.WithContext(ctx))
			return
		}

		if pathMatched {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		http.Error(w, "Not Found", http.StatusNotFound)
	})

	// Wrap with middleware in reverse order so first Use'd is outermost
	var handler http.Handler = core
	for i := len(r.middleware) - 1; i >= 0; i-- {
		handler = r.middleware[i](handler)
	}
	handler.ServeHTTP(w, req)
}

func matchSegments(pattern, path []string) (map[string]string, bool) {
	if len(pattern) != len(path) {
		return nil, false
	}
	params := make(map[string]string)
	for i, seg := range pattern {
		if strings.HasPrefix(seg, ":") {
			params[seg[1:]] = path[i]
		} else if seg != path[i] {
			return nil, false
		}
	}
	return params, true
}

func PathParam(r *http.Request, name string) string {
	params, ok := r.Context().Value(paramsKey).(map[string]string)
	if !ok {
		return ""
	}
	return params[name]
}

func main() {}
`,
  hints: [
    'Store middleware as []func(http.Handler) http.Handler in the Router.',
    'In ServeHTTP, wrap the core dispatch logic in an http.HandlerFunc.',
    'Apply middleware in reverse order: the first Use-d middleware should be the outermost wrapper.',
    'Each middleware calls next.ServeHTTP to continue the chain or returns early to short-circuit.',
  ],
  projectId: 'proj-rest',
  step: 3,
  totalSteps: 6,
}

export default exercise

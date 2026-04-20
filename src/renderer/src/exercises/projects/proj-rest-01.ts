import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-01',
  title: 'REST Framework — Router & Method Dispatch',
  category: 'Projects',
  subcategory: 'REST Framework',
  difficulty: 'intermediate',
  order: 28,
  description: `Build a simple HTTP router with exact path matching and method dispatch.

Implement a Router struct with:
- NewRouter() *Router: create a new router
- Handle(method string, path string, handler http.HandlerFunc): register a handler for a method+path pair
- ServeHTTP(w http.ResponseWriter, r *http.Request): dispatch to the matching handler; return 404 for unknown paths, 405 for wrong methods

The router implements http.Handler so it can be used with httptest.`,
  code: `package main

import "net/http"

// TODO: Define a Router struct that stores handlers keyed by method+path.

// TODO: Implement NewRouter() *Router.

// TODO: Implement Handle(method string, path string, handler http.HandlerFunc).

// TODO: Implement ServeHTTP(w http.ResponseWriter, r *http.Request):
//   - Look up handler by method + path
//   - If path exists but method does not match, return 405
//   - If path not found, return 404

func main() {}
`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRouterExactMatch(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/hello", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("world"))
	})

	req := httptest.NewRequest("GET", "/hello", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if rec.Body.String() != "world" {
		t.Fatalf("expected body 'world', got '%s'", rec.Body.String())
	}
}

func TestRouterNotFound(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/exists", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("ok"))
	})

	req := httptest.NewRequest("GET", "/missing", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 404 {
		t.Fatalf("expected 404, got %d", rec.Code)
	}
}

func TestRouterMethodNotAllowed(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/resource", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("get"))
	})

	req := httptest.NewRequest("POST", "/resource", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 405 {
		t.Fatalf("expected 405, got %d", rec.Code)
	}
}

func TestRouterMultipleMethods(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/items", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("list"))
	})
	r.Handle("POST", "/items", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("created"))
	})

	req1 := httptest.NewRequest("GET", "/items", nil)
	rec1 := httptest.NewRecorder()
	r.ServeHTTP(rec1, req1)
	if rec1.Body.String() != "list" {
		t.Fatalf("GET expected 'list', got '%s'", rec1.Body.String())
	}

	req2 := httptest.NewRequest("POST", "/items", nil)
	rec2 := httptest.NewRecorder()
	r.ServeHTTP(rec2, req2)
	if rec2.Body.String() != "created" {
		t.Fatalf("POST expected 'created', got '%s'", rec2.Body.String())
	}
}

func TestRouterMultiplePaths(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/a", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("alpha"))
	})
	r.Handle("GET", "/b", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("beta"))
	})

	req := httptest.NewRequest("GET", "/a", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Body.String() != "alpha" {
		t.Fatalf("expected 'alpha', got '%s'", rec.Body.String())
	}
}
`,
  solution: `package main

import "net/http"

type Router struct {
	routes map[string]map[string]http.HandlerFunc // path -> method -> handler
}

func NewRouter() *Router {
	return &Router{routes: make(map[string]map[string]http.HandlerFunc)}
}

func (r *Router) Handle(method string, path string, handler http.HandlerFunc) {
	if r.routes[path] == nil {
		r.routes[path] = make(map[string]http.HandlerFunc)
	}
	r.routes[path][method] = handler
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	methods, ok := r.routes[req.URL.Path]
	if !ok {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	handler, ok := methods[req.Method]
	if !ok {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	handler(w, req)
}

func main() {}
`,
  hints: [
    'Use a nested map: map[string]map[string]http.HandlerFunc where outer key is path, inner key is method.',
    'In ServeHTTP, first check if the path exists. If not, return 404.',
    'If the path exists but the method is not registered, return 405.',
    'The Router must have a ServeHTTP method to satisfy http.Handler.',
  ],
  projectId: 'proj-rest',
  step: 1,
  totalSteps: 6,
}

export default exercise

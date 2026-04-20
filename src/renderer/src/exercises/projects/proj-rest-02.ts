import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-02',
  title: 'REST Framework — Path Parameters',
  category: 'Projects',
  subcategory: 'REST Framework',
  difficulty: 'intermediate',
  order: 29,
  description: `Add path parameter support to the router. Patterns like "/users/:id" should match "/users/42" and extract "id" = "42".

Add:
- Handle now accepts patterns with :param segments (e.g., "/users/:id")
- PathParam(r *http.Request, name string) string: extract a named parameter from the matched route

Use request context to pass parsed parameters to handlers.`,
  code: `package main

import (
	"context"
	"net/http"
	"strings"
)

// --- Router from Step 1 (extended) ---

// TODO: Define a route struct that holds the method, pattern segments, and handler.

// TODO: Update Router to store a list of routes instead of a map.

// TODO: Implement NewRouter() *Router.

// TODO: Implement Handle(method, pattern, handler) — parse the pattern into segments.

// TODO: Implement ServeHTTP — match routes by comparing segments,
//   extracting :param values, and storing them in request context.
//   Return 404 if no match, 405 if path matches but method does not.

// TODO: Implement PathParam(r *http.Request, name string) string
//   to retrieve a parameter from the request context.

// Hint: use a custom context key type to avoid collisions.

func main() {
	_ = strings.Split
	_ = context.WithValue
}
`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPathParamSingle(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/users/:id", func(w http.ResponseWriter, req *http.Request) {
		id := PathParam(req, "id")
		w.Write([]byte("user:" + id))
	})

	req := httptest.NewRequest("GET", "/users/42", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if rec.Body.String() != "user:42" {
		t.Fatalf("expected 'user:42', got '%s'", rec.Body.String())
	}
}

func TestPathParamMultiple(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/teams/:teamID/members/:memberID", func(w http.ResponseWriter, req *http.Request) {
		tid := PathParam(req, "teamID")
		mid := PathParam(req, "memberID")
		w.Write([]byte(tid + ":" + mid))
	})

	req := httptest.NewRequest("GET", "/teams/alpha/members/99", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Body.String() != "alpha:99" {
		t.Fatalf("expected 'alpha:99', got '%s'", rec.Body.String())
	}
}

func TestExactAndParamRoutes(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/items", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("list"))
	})
	r.Handle("GET", "/items/:id", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("item:" + PathParam(req, "id")))
	})

	req1 := httptest.NewRequest("GET", "/items", nil)
	rec1 := httptest.NewRecorder()
	r.ServeHTTP(rec1, req1)
	if rec1.Body.String() != "list" {
		t.Fatalf("expected 'list', got '%s'", rec1.Body.String())
	}

	req2 := httptest.NewRequest("GET", "/items/abc", nil)
	rec2 := httptest.NewRecorder()
	r.ServeHTTP(rec2, req2)
	if rec2.Body.String() != "item:abc" {
		t.Fatalf("expected 'item:abc', got '%s'", rec2.Body.String())
	}
}

func TestPathParamNotFound(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/users/:id", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("ok"))
	})

	req := httptest.NewRequest("GET", "/posts/1", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 404 {
		t.Fatalf("expected 404, got %d", rec.Code)
	}
}

func TestPathParamMethodNotAllowed(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/users/:id", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("ok"))
	})

	req := httptest.NewRequest("DELETE", "/users/1", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 405 {
		t.Fatalf("expected 405, got %d", rec.Code)
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
	routes []route
}

func NewRouter() *Router {
	return &Router{}
}

func (r *Router) Handle(method string, pattern string, handler http.HandlerFunc) {
	segments := strings.Split(strings.Trim(pattern, "/"), "/")
	r.routes = append(r.routes, route{method: method, segments: segments, handler: handler})
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
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
  hints: [
    'Split both the pattern and request path by "/" and compare segment by segment.',
    'Segments starting with ":" are parameters -- capture the corresponding path segment.',
    'Store extracted params in the request context using context.WithValue.',
    'Define a custom type for the context key to avoid collisions.',
  ],
  projectId: 'proj-rest',
  step: 2,
  totalSteps: 6,
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-04',
  title: 'REST Framework — JSON Helpers',
  category: 'Projects',
  subcategory: 'REST Framework',
  difficulty: 'advanced',
  order: 31,
  description: `Add JSON helper functions for reading and writing request/response bodies.

Implement:
- ReadJSON(r *http.Request, dst interface{}) error: decode JSON request body into dst
- WriteJSON(w http.ResponseWriter, status int, data interface{}) error: encode data as JSON response with Content-Type header and status code

These helpers reduce boilerplate in handlers. Include the full router with path params and middleware from previous steps.`,
  code: `package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
)

// --- Router with path params and middleware from Steps 1-3 ---

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

// --- JSON Helpers ---

// TODO: Implement ReadJSON(r *http.Request, dst interface{}) error
//   Decode the request body as JSON into dst.

// TODO: Implement WriteJSON(w http.ResponseWriter, status int, data interface{}) error
//   Set Content-Type to application/json, write the status code, and encode data as JSON.

func main() {
	_ = json.NewDecoder
	_ = json.NewEncoder
}
`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type Item struct {
	Name  string "json:\"name\""
	Price int    "json:\"price\""
}

func TestWriteJSON(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/item", func(w http.ResponseWriter, req *http.Request) {
		WriteJSON(w, http.StatusOK, Item{Name: "Widget", Price: 100})
	})

	req := httptest.NewRequest("GET", "/item", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	ct := rec.Header().Get("Content-Type")
	if ct != "application/json" {
		t.Fatalf("expected Content-Type application/json, got '%s'", ct)
	}
	body := strings.TrimSpace(rec.Body.String())
	if !strings.Contains(body, "\"name\":\"Widget\"") {
		t.Fatalf("expected JSON with name Widget, got '%s'", body)
	}
	if !strings.Contains(body, "\"price\":100") {
		t.Fatalf("expected JSON with price 100, got '%s'", body)
	}
}

func TestWriteJSONCustomStatus(t *testing.T) {
	r := NewRouter()
	r.Handle("POST", "/items", func(w http.ResponseWriter, req *http.Request) {
		WriteJSON(w, http.StatusCreated, map[string]string{"status": "created"})
	})

	req := httptest.NewRequest("POST", "/items", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 201 {
		t.Fatalf("expected 201, got %d", rec.Code)
	}
}

func TestReadJSON(t *testing.T) {
	r := NewRouter()
	r.Handle("POST", "/item", func(w http.ResponseWriter, req *http.Request) {
		var item Item
		if err := ReadJSON(req, &item); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		WriteJSON(w, 200, item)
	})

	body := strings.NewReader("{\"name\":\"Gadget\",\"price\":50}")
	req := httptest.NewRequest("POST", "/item", body)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	respBody := strings.TrimSpace(rec.Body.String())
	if !strings.Contains(respBody, "\"name\":\"Gadget\"") {
		t.Fatalf("expected Gadget in response, got '%s'", respBody)
	}
}

func TestReadJSONInvalid(t *testing.T) {
	r := NewRouter()
	r.Handle("POST", "/item", func(w http.ResponseWriter, req *http.Request) {
		var item Item
		if err := ReadJSON(req, &item); err != nil {
			http.Error(w, "bad json", 400)
			return
		}
		WriteJSON(w, 200, item)
	})

	body := strings.NewReader("not json")
	req := httptest.NewRequest("POST", "/item", body)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 400 {
		t.Fatalf("expected 400 for invalid JSON, got %d", rec.Code)
	}
}

func TestReadJSONEmptyBody(t *testing.T) {
	r := NewRouter()
	r.Handle("POST", "/item", func(w http.ResponseWriter, req *http.Request) {
		var item Item
		if err := ReadJSON(req, &item); err != nil {
			http.Error(w, "bad json", 400)
			return
		}
		WriteJSON(w, 200, item)
	})

	req := httptest.NewRequest("POST", "/item", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 400 {
		t.Fatalf("expected 400 for empty body, got %d", rec.Code)
	}
}
`,
  solution: `package main

import (
	"context"
	"encoding/json"
	"errors"
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

// --- JSON Helpers ---

func ReadJSON(r *http.Request, dst interface{}) error {
	if r.Body == nil {
		return errors.New("empty body")
	}
	return json.NewDecoder(r.Body).Decode(dst)
}

func WriteJSON(w http.ResponseWriter, status int, data interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}

func main() {}
`,
  hints: [
    'ReadJSON uses json.NewDecoder(r.Body).Decode(dst) to parse the body.',
    'Check for nil body and return an error for empty requests.',
    'WriteJSON must set Content-Type BEFORE calling WriteHeader.',
    'json.NewEncoder(w).Encode(data) writes JSON to the ResponseWriter.',
  ],
  projectId: 'proj-rest',
  step: 4,
  totalSteps: 6,
}

export default exercise

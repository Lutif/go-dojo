import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-06',
  title: 'REST Framework — Route Groups',
  category: 'Projects',
  subcategory: 'REST Framework',
  difficulty: 'expert',
  order: 33,
  description: `Add route groups to the framework. A group shares a common path prefix and can have its own middleware.

Implement:
- Group(prefix string) *RouteGroup: create a group with a path prefix
- RouteGroup.Handle(method, path, handler): register a handler under the group prefix
- RouteGroup.Use(mw): add middleware that applies only to this group's routes
- RouteGroup.Group(prefix) *RouteGroup: nested groups

Group middleware runs after the router-level middleware and before the handler.

Include all code from previous steps (router, path params, middleware, JSON helpers, error handling).`,
  code: `package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

// --- Router with path params, middleware, JSON, errors from Steps 1-5 ---

type contextKey string

const paramsKey contextKey = "params"

type route struct {
	method     string
	segments   []string
	handler    http.HandlerFunc
	middleware []func(http.Handler) http.Handler
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

// TODO: Implement Group(prefix string) *RouteGroup.

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

			// TODO: Apply route-level middleware (from groups) before the handler.
			var h http.Handler = rt.handler
			rt.handler(w, req.WithContext(ctx))
			_ = h
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

type APIError struct {
	StatusCode int
	Message    string
}

func (e *APIError) Error() string {
	return e.Message
}

func NewAPIError(status int, message string) *APIError {
	return &APIError{StatusCode: status, Message: message}
}

func ErrNotFound(msg string) *APIError {
	return NewAPIError(http.StatusNotFound, msg)
}

func ErrBadRequest(msg string) *APIError {
	return NewAPIError(http.StatusBadRequest, msg)
}

func ErrInternal(msg string) *APIError {
	return NewAPIError(http.StatusInternalServerError, msg)
}

func HandleError(w http.ResponseWriter, err error) {
	var apiErr *APIError
	if errors.As(err, &apiErr) {
		WriteJSON(w, apiErr.StatusCode, map[string]string{"error": apiErr.Message})
		return
	}
	WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
}

// --- Route Groups ---

// TODO: Define a RouteGroup struct with prefix, middleware, and a reference to the router.

// TODO: Implement RouteGroup.Handle(method, path, handler) — prepend prefix and attach group middleware.

// TODO: Implement RouteGroup.Use(mw) — add middleware to the group.

// TODO: Implement RouteGroup.Group(prefix) *RouteGroup — create a nested group.

func main() {}
`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGroupBasicPrefix(t *testing.T) {
	r := NewRouter()
	api := r.Group("/api")
	api.Handle("GET", "/users", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("users-list"))
	})

	req := httptest.NewRequest("GET", "/api/users", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if rec.Body.String() != "users-list" {
		t.Fatalf("expected 'users-list', got '%s'", rec.Body.String())
	}
}

func TestGroupWithPathParams(t *testing.T) {
	r := NewRouter()
	api := r.Group("/api")
	api.Handle("GET", "/users/:id", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("user:" + PathParam(req, "id")))
	})

	req := httptest.NewRequest("GET", "/api/users/55", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Body.String() != "user:55" {
		t.Fatalf("expected 'user:55', got '%s'", rec.Body.String())
	}
}

func TestGroupMiddleware(t *testing.T) {
	r := NewRouter()
	api := r.Group("/api")
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("X-Group", "api")
			next.ServeHTTP(w, req)
		})
	})
	api.Handle("GET", "/ping", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("pong"))
	})

	// Route in group should have group middleware
	req := httptest.NewRequest("GET", "/api/ping", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Header().Get("X-Group") != "api" {
		t.Fatal("group middleware should set X-Group header")
	}
	if rec.Body.String() != "pong" {
		t.Fatalf("expected 'pong', got '%s'", rec.Body.String())
	}
}

func TestGroupMiddlewareNotAffectOtherRoutes(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/health", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("ok"))
	})
	api := r.Group("/api")
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("X-API", "true")
			next.ServeHTTP(w, req)
		})
	})
	api.Handle("GET", "/data", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("data"))
	})

	// /health should NOT have X-API header
	req := httptest.NewRequest("GET", "/health", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Header().Get("X-API") != "" {
		t.Fatal("group middleware should not affect routes outside the group")
	}
}

func TestNestedGroups(t *testing.T) {
	r := NewRouter()
	api := r.Group("/api")
	v1 := api.Group("/v1")
	v1.Handle("GET", "/items", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("v1-items"))
	})

	req := httptest.NewRequest("GET", "/api/v1/items", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if rec.Body.String() != "v1-items" {
		t.Fatalf("expected 'v1-items', got '%s'", rec.Body.String())
	}
}

func TestNestedGroupMiddleware(t *testing.T) {
	r := NewRouter()
	api := r.Group("/api")
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("X-Level", "api")
			next.ServeHTTP(w, req)
		})
	})
	v2 := api.Group("/v2")
	v2.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("X-Version", "2")
			next.ServeHTTP(w, req)
		})
	})
	v2.Handle("GET", "/things", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("things"))
	})

	req := httptest.NewRequest("GET", "/api/v2/things", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Header().Get("X-Level") != "api" {
		t.Fatal("parent group middleware should run")
	}
	if rec.Header().Get("X-Version") != "2" {
		t.Fatal("nested group middleware should run")
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
	method     string
	segments   []string
	handler    http.HandlerFunc
	middleware []func(http.Handler) http.Handler
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

func (r *Router) Group(prefix string) *RouteGroup {
	return &RouteGroup{
		prefix: strings.Trim(prefix, "/"),
		router: r,
	}
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

			// Apply route-level middleware (from groups)
			var h http.Handler = rt.handler
			for i := len(rt.middleware) - 1; i >= 0; i-- {
				h = rt.middleware[i](h)
			}
			h.ServeHTTP(w, req.WithContext(ctx))
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

type APIError struct {
	StatusCode int
	Message    string
}

func (e *APIError) Error() string {
	return e.Message
}

func NewAPIError(status int, message string) *APIError {
	return &APIError{StatusCode: status, Message: message}
}

func ErrNotFound(msg string) *APIError {
	return NewAPIError(http.StatusNotFound, msg)
}

func ErrBadRequest(msg string) *APIError {
	return NewAPIError(http.StatusBadRequest, msg)
}

func ErrInternal(msg string) *APIError {
	return NewAPIError(http.StatusInternalServerError, msg)
}

func HandleError(w http.ResponseWriter, err error) {
	var apiErr *APIError
	if errors.As(err, &apiErr) {
		WriteJSON(w, apiErr.StatusCode, map[string]string{"error": apiErr.Message})
		return
	}
	WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
}

// --- Route Groups ---

type RouteGroup struct {
	prefix     string
	middleware []func(http.Handler) http.Handler
	router     *Router
}

func (g *RouteGroup) Handle(method string, path string, handler http.HandlerFunc) {
	fullPath := g.prefix + "/" + strings.Trim(path, "/")
	segments := strings.Split(strings.Trim(fullPath, "/"), "/")
	mw := make([]func(http.Handler) http.Handler, len(g.middleware))
	copy(mw, g.middleware)
	g.router.routes = append(g.router.routes, route{
		method:     method,
		segments:   segments,
		handler:    handler,
		middleware: mw,
	})
}

func (g *RouteGroup) Use(mw func(http.Handler) http.Handler) {
	g.middleware = append(g.middleware, mw)
}

func (g *RouteGroup) Group(prefix string) *RouteGroup {
	newPrefix := g.prefix + "/" + strings.Trim(prefix, "/")
	mw := make([]func(http.Handler) http.Handler, len(g.middleware))
	copy(mw, g.middleware)
	return &RouteGroup{
		prefix:     newPrefix,
		middleware: mw,
		router:     g.router,
	}
}

func main() {}
`,
  hints: [
    'RouteGroup stores a prefix, its own middleware slice, and a pointer back to the Router.',
    'Handle prepends the group prefix to the path, then registers on the router with the group middleware attached.',
    'In ServeHTTP, apply route-level middleware (from the route struct) around the handler, inside the router-level middleware.',
    'Nested groups concatenate prefixes and inherit the parent group middleware.',
  ],
  projectId: 'proj-rest',
  step: 6,
  totalSteps: 6,
}

export default exercise

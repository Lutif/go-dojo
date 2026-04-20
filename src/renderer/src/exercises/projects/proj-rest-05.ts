import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-05',
  title: 'REST Framework — Error Handling',
  category: 'Projects',
  subcategory: 'REST Framework',
  difficulty: 'advanced',
  order: 32,
  description: `Add structured error handling with custom error types that map to HTTP status codes.

Implement:
- APIError struct with StatusCode int, Message string, and an Error() string method
- NewAPIError(status int, message string) *APIError: create an error
- Common constructors: ErrNotFound(msg), ErrBadRequest(msg), ErrInternal(msg)
- HandleError(w http.ResponseWriter, err error): write the error as a JSON response, using the status code from APIError or 500 for other errors

Include all router, path param, middleware, and JSON helper code from previous steps.`,
  code: `package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

// --- Router with path params, middleware from Steps 1-3 ---

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

// --- JSON Helpers from Step 4 ---

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

// --- Error Handling ---

// TODO: Define APIError struct with StatusCode and Message fields.

// TODO: Implement Error() string on APIError to satisfy the error interface.

// TODO: Implement NewAPIError(status int, message string) *APIError.

// TODO: Implement ErrNotFound(msg string) *APIError (404).

// TODO: Implement ErrBadRequest(msg string) *APIError (400).

// TODO: Implement ErrInternal(msg string) *APIError (500).

// TODO: Implement HandleError(w http.ResponseWriter, err error):
//   - If err is an *APIError, use its status and message.
//   - Otherwise, return 500 with the error message.
//   - Write the error as JSON: {"error": "message"}.

func main() {}
`,
  testCode: `package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"fmt"
)

func TestAPIErrorInterface(t *testing.T) {
	err := NewAPIError(400, "bad input")
	var e error = err
	if e.Error() != "bad input" {
		t.Fatalf("expected 'bad input', got '%s'", e.Error())
	}
}

func TestErrNotFound(t *testing.T) {
	err := ErrNotFound("user not found")
	if err.StatusCode != 404 {
		t.Fatalf("expected 404, got %d", err.StatusCode)
	}
	if err.Message != "user not found" {
		t.Fatalf("expected 'user not found', got '%s'", err.Message)
	}
}

func TestErrBadRequest(t *testing.T) {
	err := ErrBadRequest("missing field")
	if err.StatusCode != 400 {
		t.Fatalf("expected 400, got %d", err.StatusCode)
	}
}

func TestErrInternal(t *testing.T) {
	err := ErrInternal("db crashed")
	if err.StatusCode != 500 {
		t.Fatalf("expected 500, got %d", err.StatusCode)
	}
}

func TestHandleErrorAPIError(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/fail", func(w http.ResponseWriter, req *http.Request) {
		HandleError(w, ErrNotFound("item missing"))
	})

	req := httptest.NewRequest("GET", "/fail", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 404 {
		t.Fatalf("expected 404, got %d", rec.Code)
	}
	ct := rec.Header().Get("Content-Type")
	if ct != "application/json" {
		t.Fatalf("expected Content-Type application/json, got '%s'", ct)
	}
	var body map[string]string
	json.NewDecoder(rec.Body).Decode(&body)
	if body["error"] != "item missing" {
		t.Fatalf("expected error 'item missing', got '%s'", body["error"])
	}
}

func TestHandleErrorGenericError(t *testing.T) {
	r := NewRouter()
	r.Handle("GET", "/oops", func(w http.ResponseWriter, req *http.Request) {
		HandleError(w, fmt.Errorf("something broke"))
	})

	req := httptest.NewRequest("GET", "/oops", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 500 {
		t.Fatalf("expected 500 for generic error, got %d", rec.Code)
	}
	var body map[string]string
	json.NewDecoder(rec.Body).Decode(&body)
	if !strings.Contains(body["error"], "something broke") {
		t.Fatalf("expected 'something broke' in error, got '%s'", body["error"])
	}
}

func TestHandleErrorInHandler(t *testing.T) {
	r := NewRouter()
	r.Handle("POST", "/validate", func(w http.ResponseWriter, req *http.Request) {
		var data map[string]string
		if err := ReadJSON(req, &data); err != nil {
			HandleError(w, ErrBadRequest("invalid json"))
			return
		}
		WriteJSON(w, 200, data)
	})

	req := httptest.NewRequest("POST", "/validate", strings.NewReader("bad"))
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != 400 {
		t.Fatalf("expected 400, got %d", rec.Code)
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

// --- JSON Helpers from Step 4 ---

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

// --- Error Handling ---

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

func main() {}
`,
  hints: [
    'APIError needs an Error() string method to satisfy the error interface.',
    'Use errors.As to check if an error is an *APIError in HandleError.',
    'HandleError writes JSON with {"error": "message"} format using WriteJSON.',
    'For non-APIError errors, default to status 500.',
  ],
  projectId: 'proj-rest',
  step: 5,
  totalSteps: 6,
}

export default exercise

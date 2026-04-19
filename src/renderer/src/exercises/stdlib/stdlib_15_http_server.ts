import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_15_http_server',
  title: 'HTTP Server Handler',
  category: 'Standard Library',
  subcategory: 'HTTP',
  difficulty: 'intermediate',
  order: 15,
  description: `HTTP handlers in Go implement the \`http.Handler\` interface:

\`\`\`
type Handler interface {
    ServeHTTP(w http.ResponseWriter, r *http.Request)
}
\`\`\`

Or use \`http.HandlerFunc\` for simple functions:
\`\`\`
http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello!")
})
\`\`\`

Test handlers with \`httptest.NewRecorder\`:
\`\`\`
req := httptest.NewRequest("GET", "/hello", nil)
rec := httptest.NewRecorder()
handler.ServeHTTP(rec, req)
// rec.Code, rec.Body.String()
\`\`\`

Your task: build HTTP handlers and test them.`,
  code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// HelloHandler writes "Hello, <name>!" using the "name" query parameter.
// If no name, use "World".
func HelloHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: r.URL.Query().Get("name")
}

// JSONHandler writes a JSON response with {"message": "ok", "status": 200}.
func JSONHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Set Content-Type, encode JSON
}

// MethodHandler responds differently based on HTTP method:
// GET → "read", POST → "create", other → 405 Method Not Allowed
func MethodHandler(w http.ResponseWriter, r *http.Request) {
	// TODO
}

// EchoHandler reads the request body and echoes it back.
func EchoHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Read body, write it back
}

var _ = json.NewEncoder
var _ = fmt.Fprintf
var _ = http.StatusOK`,
  testCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHelloHandler(t *testing.T) {
	req := httptest.NewRequest("GET", "/hello?name=Alice", nil)
	rec := httptest.NewRecorder()
	HelloHandler(rec, req)
	if rec.Body.String() != "Hello, Alice!" {
		t.Errorf("got %q", rec.Body.String())
	}
}

func TestHelloHandlerDefault(t *testing.T) {
	req := httptest.NewRequest("GET", "/hello", nil)
	rec := httptest.NewRecorder()
	HelloHandler(rec, req)
	if rec.Body.String() != "Hello, World!" {
		t.Errorf("got %q", rec.Body.String())
	}
}

func TestJSONHandler(t *testing.T) {
	req := httptest.NewRequest("GET", "/json", nil)
	rec := httptest.NewRecorder()
	JSONHandler(rec, req)
	if rec.Code != 200 {
		t.Errorf("status = %d", rec.Code)
	}
	ct := rec.Header().Get("Content-Type")
	if ct != "application/json" {
		t.Errorf("Content-Type = %q", ct)
	}
	body := rec.Body.String()
	if !strings.Contains(body, "\"message\"") || !strings.Contains(body, "ok") {
		t.Errorf("body = %q", body)
	}
}

func TestMethodHandlerGET(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	MethodHandler(rec, req)
	if rec.Body.String() != "read" {
		t.Errorf("GET: got %q", rec.Body.String())
	}
}

func TestMethodHandlerPOST(t *testing.T) {
	req := httptest.NewRequest("POST", "/", nil)
	rec := httptest.NewRecorder()
	MethodHandler(rec, req)
	if rec.Body.String() != "create" {
		t.Errorf("POST: got %q", rec.Body.String())
	}
}

func TestMethodHandlerNotAllowed(t *testing.T) {
	req := httptest.NewRequest("DELETE", "/", nil)
	rec := httptest.NewRecorder()
	MethodHandler(rec, req)
	if rec.Code != 405 {
		t.Errorf("DELETE: status = %d, want 405", rec.Code)
	}
}

func TestEchoHandler(t *testing.T) {
	body := strings.NewReader("echo this")
	req := httptest.NewRequest("POST", "/echo", body)
	rec := httptest.NewRecorder()
	EchoHandler(rec, req)
	if rec.Body.String() != "echo this" {
		t.Errorf("got %q", rec.Body.String())
	}
}`,
  solution: `package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "World"
	}
	fmt.Fprintf(w, "Hello, %s!", name)
}

func JSONHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "ok",
		"status":  200,
	})
}

func MethodHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		fmt.Fprint(w, "read")
	case http.MethodPost:
		fmt.Fprint(w, "create")
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func EchoHandler(w http.ResponseWriter, r *http.Request) {
	io.Copy(w, r.Body)
}

var _ = json.NewEncoder
var _ = fmt.Fprintf
var _ = http.StatusOK`,
  hints: [
    'HelloHandler: r.URL.Query().Get("name") gets the query parameter. fmt.Fprintf(w, "Hello, %s!", name) writes the response.',
    'JSONHandler: set w.Header().Set("Content-Type", "application/json") BEFORE writing. Use json.NewEncoder(w).Encode(data).',
    'EchoHandler: io.Copy(w, r.Body) copies the request body directly to the response writer.'
  ],
}

export default exercise

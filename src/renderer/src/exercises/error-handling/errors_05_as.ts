import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_05_as',
  title: 'errors.As',
  category: 'Error Handling',
  subcategory: 'Errors',
  difficulty: 'intermediate',
  order: 5,
  description: `\`errors.As(err, &target)\` finds the first error in the chain matching the target type and sets target to that value:

\`\`\`
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("failed path:", pathErr.Path)
}
\`\`\`

While \`errors.Is\` checks for a specific error *value*, \`errors.As\` checks for an error *type* and extracts it.

Your task: use \`errors.As\` to extract structured error information from wrapped errors.`,
  code: `package main

import (
	"errors"
	"fmt"
)

// HTTPError carries an HTTP status code and message
type HTTPError struct {
	Code    int
	Message string
}

func (e *HTTPError) Error() string {
	return fmt.Sprintf("HTTP %d: %s", e.Code, e.Message)
}

// callAPI simulates an API call.
// path="/missing" → 404, path="/secret" → 403, path="/fail" → plain error
// Wrap the error with context: "api call <path>: <error>"
func callAPI(path string) error {
	// TODO
	return nil
}

// GetStatusCode extracts the HTTP status code from an error chain.
// Returns (code, true) if an HTTPError is found, (0, false) otherwise.
func GetStatusCode(err error) (int, bool) {
	// TODO: Use errors.As
	return 0, false
}

// ClassifyError returns "not_found", "forbidden", "server_error",
// or "unknown" based on the HTTPError code in the chain.
// If the error is not an HTTPError, return "unknown".
func ClassifyError(err error) string {
	// TODO
	return ""
}

var _ = fmt.Errorf
var _ = errors.As`,
  testCode: `package main

import "testing"

func TestCallAPIMissing(t *testing.T) {
	err := callAPI("/missing")
	if err == nil {
		t.Fatal("expected error")
	}
	code, ok := GetStatusCode(err)
	if !ok || code != 404 {
		t.Errorf("GetStatusCode = (%d, %v), want (404, true)", code, ok)
	}
}

func TestCallAPISecret(t *testing.T) {
	err := callAPI("/secret")
	code, ok := GetStatusCode(err)
	if !ok || code != 403 {
		t.Errorf("GetStatusCode = (%d, %v), want (403, true)", code, ok)
	}
}

func TestCallAPIFail(t *testing.T) {
	err := callAPI("/fail")
	if err == nil {
		t.Fatal("expected error")
	}
	_, ok := GetStatusCode(err)
	if ok {
		t.Error("plain error should not have status code")
	}
}

func TestCallAPIOk(t *testing.T) {
	err := callAPI("/ok")
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestClassifyError(t *testing.T) {
	tests := []struct {
		path string
		want string
	}{
		{"/missing", "not_found"},
		{"/secret", "forbidden"},
		{"/fail", "unknown"},
	}
	for _, tt := range tests {
		err := callAPI(tt.path)
		got := ClassifyError(err)
		if got != tt.want {
			t.Errorf("ClassifyError(callAPI(%q)) = %q, want %q", tt.path, got, tt.want)
		}
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
)

type HTTPError struct {
	Code    int
	Message string
}

func (e *HTTPError) Error() string {
	return fmt.Sprintf("HTTP %d: %s", e.Code, e.Message)
}

func callAPI(path string) error {
	switch path {
	case "/missing":
		return fmt.Errorf("api call %s: %w", path, &HTTPError{Code: 404, Message: "not found"})
	case "/secret":
		return fmt.Errorf("api call %s: %w", path, &HTTPError{Code: 403, Message: "forbidden"})
	case "/fail":
		return fmt.Errorf("api call %s: %w", path, errors.New("connection refused"))
	default:
		return nil
	}
}

func GetStatusCode(err error) (int, bool) {
	var httpErr *HTTPError
	if errors.As(err, &httpErr) {
		return httpErr.Code, true
	}
	return 0, false
}

func ClassifyError(err error) string {
	var httpErr *HTTPError
	if errors.As(err, &httpErr) {
		switch {
		case httpErr.Code == 404:
			return "not_found"
		case httpErr.Code == 403:
			return "forbidden"
		default:
			return "server_error"
		}
	}
	return "unknown"
}`,
  hints: [
    'Declare a typed variable, then pass its address: var httpErr *HTTPError; errors.As(err, &httpErr)',
    'errors.As walks the chain like errors.Is, but matches by TYPE instead of value.',
    'After errors.As returns true, httpErr is set to the matched error — access its fields directly.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_15_hierarchy',
  title: 'Error Type Hierarchy',
  category: 'Error Handling',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 15,
  description: `Real applications organize errors into hierarchies. A base error type carries shared context (operation, component), and specific types add details:

\`\`\`
type AppError struct {
    Op   string // operation that failed
    Kind string // category: "auth", "validation", "internal"
    Err  error  // underlying cause
}

func (e *AppError) Error() string {
    return fmt.Sprintf("%s: %s: %v", e.Kind, e.Op, e.Err)
}

func (e *AppError) Unwrap() error { return e.Err }
\`\`\`

Callers use \`errors.As\` to inspect the hierarchy:
\`\`\`
var appErr *AppError
if errors.As(err, &appErr) {
    if appErr.Kind == "auth" { ... }
}
\`\`\`

Your task: build a structured error hierarchy for an API.`,
  code: `package main

import (
	"errors"
	"fmt"
)

// APIError is the base error type for all API errors.
// Fields: StatusCode int, Op string (operation name), Err error (cause).
type APIError struct {
	// TODO: Define fields
}

// TODO: Implement Error() string — format: "api error [<StatusCode>] <Op>: <Err>"
// TODO: Implement Unwrap() error — return Err

// NotFoundError wraps APIError for 404 cases.
// Additional field: Resource string (what wasn't found).
type NotFoundError struct {
	// TODO: Embed or compose with APIError
}

// TODO: Implement Error() string — format: "<Resource> not found: <Err>"
// TODO: Implement Unwrap() error — return &e.APIError (not e.Err!)
//       This lets errors.As find the APIError in the chain.

// ValidationError wraps APIError for 400 cases.
// Additional field: Field string (which field failed).
type ValidationError struct {
	// TODO
}

// TODO: Implement Error() string — format: "validation error on <Field>: <Err>"
// TODO: Implement Unwrap() error — return &e.APIError

// NewNotFound creates a NotFoundError with status 404.
func NewNotFound(op, resource string, err error) *NotFoundError {
	// TODO
	return nil
}

// NewValidation creates a ValidationError with status 400.
func NewValidation(op, field string, err error) *ValidationError {
	// TODO
	return nil
}

// IsNotFound checks if an error is or wraps a NotFoundError.
func IsNotFound(err error) bool {
	// TODO: Use errors.As
	return false
}

// GetStatusCode extracts the status code from an APIError
// (or any error wrapping one). Returns 500 if not an APIError.
func GetStatusCode(err error) int {
	// TODO: Use errors.As to find the APIError
	return 500
}

var _ = errors.As
var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"errors"
	"fmt"
	"testing"
)

func TestAPIErrorFormat(t *testing.T) {
	err := &APIError{StatusCode: 500, Op: "getUser", Err: errors.New("db down")}
	want := "api error [500] getUser: db down"
	if got := err.Error(); got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestAPIErrorUnwrap(t *testing.T) {
	cause := errors.New("root cause")
	err := &APIError{StatusCode: 500, Op: "test", Err: cause}
	if !errors.Is(err, cause) {
		t.Error("Unwrap should expose the underlying error")
	}
}

func TestNotFoundError(t *testing.T) {
	err := NewNotFound("getUser", "user", errors.New("id 42"))
	if err == nil {
		t.Fatal("expected non-nil")
	}
	msg := err.Error()
	if msg != "user not found: id 42" {
		t.Errorf("got %q", msg)
	}
}

func TestNotFoundIsAPIError(t *testing.T) {
	err := NewNotFound("getUser", "user", errors.New("missing"))
	var apiErr *APIError
	if !errors.As(err, &apiErr) {
		t.Error("NotFoundError should be unwrappable to APIError")
	}
	if apiErr.StatusCode != 404 {
		t.Errorf("status = %d, want 404", apiErr.StatusCode)
	}
}

func TestValidationError(t *testing.T) {
	err := NewValidation("createUser", "email", errors.New("invalid format"))
	msg := err.Error()
	if msg != "validation error on email: invalid format" {
		t.Errorf("got %q", msg)
	}
}

func TestValidationIsAPIError(t *testing.T) {
	err := NewValidation("update", "age", errors.New("negative"))
	var apiErr *APIError
	if !errors.As(err, &apiErr) {
		t.Error("ValidationError should be unwrappable to APIError")
	}
	if apiErr.StatusCode != 400 {
		t.Errorf("status = %d, want 400", apiErr.StatusCode)
	}
}

func TestIsNotFound(t *testing.T) {
	err := NewNotFound("get", "item", errors.New("gone"))
	if !IsNotFound(err) {
		t.Error("IsNotFound should return true")
	}
	wrapped := fmt.Errorf("handler: %w", err)
	if !IsNotFound(wrapped) {
		t.Error("IsNotFound should work through wrapping")
	}
	if IsNotFound(errors.New("random")) {
		t.Error("IsNotFound should return false for non-NotFound errors")
	}
}

func TestGetStatusCode(t *testing.T) {
	nf := NewNotFound("get", "x", errors.New("test"))
	if code := GetStatusCode(nf); code != 404 {
		t.Errorf("got %d, want 404", code)
	}
	ve := NewValidation("post", "f", errors.New("bad"))
	if code := GetStatusCode(ve); code != 400 {
		t.Errorf("got %d, want 400", code)
	}
	if code := GetStatusCode(errors.New("random")); code != 500 {
		t.Errorf("got %d, want 500 for unknown error", code)
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
)

type APIError struct {
	StatusCode int
	Op         string
	Err        error
}

func (e *APIError) Error() string {
	return fmt.Sprintf("api error [%d] %s: %v", e.StatusCode, e.Op, e.Err)
}

func (e *APIError) Unwrap() error { return e.Err }

type NotFoundError struct {
	APIError
	Resource string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s not found: %v", e.Resource, e.Err)
}

func (e *NotFoundError) Unwrap() error { return &e.APIError }

type ValidationError struct {
	APIError
	Field string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on %s: %v", e.Field, e.Err)
}

func (e *ValidationError) Unwrap() error { return &e.APIError }

func NewNotFound(op, resource string, err error) *NotFoundError {
	return &NotFoundError{
		APIError: APIError{StatusCode: 404, Op: op, Err: err},
		Resource: resource,
	}
}

func NewValidation(op, field string, err error) *ValidationError {
	return &ValidationError{
		APIError: APIError{StatusCode: 400, Op: op, Err: err},
		Field:    field,
	}
}

func IsNotFound(err error) bool {
	var nf *NotFoundError
	return errors.As(err, &nf)
}

func GetStatusCode(err error) int {
	var apiErr *APIError
	if errors.As(err, &apiErr) {
		return apiErr.StatusCode
	}
	return 500
}

var _ = fmt.Sprintf`,
  hints: [
    'Embed APIError in NotFoundError/ValidationError. Crucially, Unwrap() must return &e.APIError (not e.Err) so errors.As can find the APIError in the chain.',
    'NewNotFound: return &NotFoundError{APIError: APIError{StatusCode: 404, Op: op, Err: err}, Resource: resource}',
    'IsNotFound: var nf *NotFoundError; return errors.As(err, &nf). errors.As traverses wrapping chains automatically.'
  ],
}

export default exercise

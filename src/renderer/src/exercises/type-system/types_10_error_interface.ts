import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_10_error_interface',
  title: 'Error Interface',
  category: 'Type System',
  subcategory: 'Types',
  difficulty: 'intermediate',
  order: 10,
  description: `Go's built-in \`error\` interface has a single method:
\`\`\`
type error interface {
    Error() string
}
\`\`\`

Any type with an \`Error() string\` method is an error. Custom error types can carry extra context (error codes, field names, etc.) beyond a simple message.

Your task: create custom error types that carry structured error information.`,
  code: `package main

import "fmt"

// TODO: Define a ValidationError struct with fields:
//   Field   string
//   Message string
// Implement Error() that returns "validation error: Field - Message"

// TODO: Define a NotFoundError struct with fields:
//   Entity string
//   ID     int
// Implement Error() that returns "Entity with id ID not found"
// Example: "user with id 42 not found"

// Validate checks if a name is valid (non-empty and < 50 chars).
// Returns nil if valid, or a *ValidationError if not.
func Validate(name string) error {
	// TODO: Return ValidationError for empty or too-long names
	return nil
}

// FindUser returns a *NotFoundError if id is negative,
// otherwise returns the "found" name.
func FindUser(id int) (string, error) {
	// TODO
	return "", nil
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestValidationErrorFormat(t *testing.T) {
	err := &ValidationError{Field: "email", Message: "is required"}
	want := "validation error: email - is required"
	if got := err.Error(); got != want {
		t.Errorf("Error() = %q, want %q", got, want)
	}
}

func TestNotFoundErrorFormat(t *testing.T) {
	err := &NotFoundError{Entity: "user", ID: 42}
	want := "user with id 42 not found"
	if got := err.Error(); got != want {
		t.Errorf("Error() = %q, want %q", got, want)
	}
}

func TestValidateEmpty(t *testing.T) {
	err := Validate("")
	if err == nil {
		t.Fatal("Validate('') should return an error")
	}
	ve, ok := err.(*ValidationError)
	if !ok {
		t.Fatal("error should be *ValidationError")
	}
	if ve.Field != "name" {
		t.Errorf("Field = %q, want %q", ve.Field, "name")
	}
}

func TestValidateTooLong(t *testing.T) {
	long := ""
	for i := 0; i < 51; i++ {
		long += "a"
	}
	err := Validate(long)
	if err == nil {
		t.Fatal("Validate(51 chars) should return an error")
	}
}

func TestValidateOk(t *testing.T) {
	if err := Validate("Alice"); err != nil {
		t.Errorf("Validate('Alice') should be nil, got %v", err)
	}
}

func TestFindUserNotFound(t *testing.T) {
	_, err := FindUser(-1)
	if err == nil {
		t.Fatal("FindUser(-1) should return an error")
	}
	nfe, ok := err.(*NotFoundError)
	if !ok {
		t.Fatal("error should be *NotFoundError")
	}
	if nfe.ID != -1 {
		t.Errorf("ID = %d, want -1", nfe.ID)
	}
}

func TestFindUserFound(t *testing.T) {
	name, err := FindUser(1)
	if err != nil {
		t.Fatalf("FindUser(1) error: %v", err)
	}
	if name == "" {
		t.Error("FindUser(1) returned empty name")
	}
}`,
  solution: `package main

import "fmt"

type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error: %s - %s", e.Field, e.Message)
}

type NotFoundError struct {
	Entity string
	ID     int
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s with id %d not found", e.Entity, e.ID)
}

func Validate(name string) error {
	if name == "" {
		return &ValidationError{Field: "name", Message: "cannot be empty"}
	}
	if len(name) > 50 {
		return &ValidationError{Field: "name", Message: "too long"}
	}
	return nil
}

func FindUser(id int) (string, error) {
	if id < 0 {
		return "", &NotFoundError{Entity: "user", ID: id}
	}
	return "Alice", nil
}`,
  hints: [
    'Implement Error() string on a pointer receiver: func (e *ValidationError) Error() string { ... }',
    'Return &ValidationError{...} (pointer) so it satisfies the error interface via pointer receiver.',
    'Return nil for no error. The caller checks: if err != nil { handle error }'
  ],
}

export default exercise

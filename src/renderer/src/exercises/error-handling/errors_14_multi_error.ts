import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_14_multi_error',
  title: 'Multi-Error',
  category: 'Error Handling',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 14,
  description: `Sometimes you need to collect multiple errors — e.g., validating a form with many fields, or closing multiple resources. Go 1.20+ supports this with \`errors.Join\`:

\`\`\`
err1 := validate(name)
err2 := validate(email)
if err := errors.Join(err1, err2); err != nil {
    return err // contains both errors
}
\`\`\`

\`errors.Join\` returns nil if all errors are nil. The combined error's \`Error()\` joins messages with newlines. You can still use \`errors.Is\` and \`errors.As\` to check individual errors in the joined result.

Your task: build error collection utilities and use \`errors.Join\`.`,
  code: `package main

import (
	"errors"
	"fmt"
	"strings"
)

// ValidateUser checks multiple fields and returns all errors combined.
// Checks: name non-empty, age 0-150, email contains "@".
// Use errors.Join to combine all validation errors.
func ValidateUser(name string, age int, email string) error {
	// TODO: Collect errors for each invalid field, then join them
	return nil
}

// CollectErrors runs all functions and returns joined errors.
// Nil errors are excluded. Returns nil if all succeed.
func CollectErrors(fns ...func() error) error {
	// TODO
	return nil
}

// CloseAll closes multiple resources (anything with a Close() error method).
// Returns all close errors joined together.
type Closer interface {
	Close() error
}

func CloseAll(closers ...Closer) error {
	// TODO: Close each, collect errors, return joined
	return nil
}

// CountErrors returns the number of individual errors in a
// joined error. A nil error returns 0.
// Hint: use errors.Unwrap() to check for the []error interface.
func CountErrors(err error) int {
	// TODO
	return 0
}

var _ = errors.New
var _ = fmt.Sprintf
var _ = strings.Contains`,
  testCode: `package main

import (
	"errors"
	"strings"
	"testing"
)

func TestValidateUserAllValid(t *testing.T) {
	err := ValidateUser("Alice", 30, "alice@example.com")
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestValidateUserAllInvalid(t *testing.T) {
	err := ValidateUser("", -1, "bad")
	if err == nil {
		t.Fatal("expected error for all invalid fields")
	}
	msg := err.Error()
	if !strings.Contains(msg, "name") {
		t.Error("error should mention name")
	}
	if !strings.Contains(msg, "age") {
		t.Error("error should mention age")
	}
	if !strings.Contains(msg, "email") {
		t.Error("error should mention email")
	}
}

func TestValidateUserPartialInvalid(t *testing.T) {
	err := ValidateUser("Bob", 200, "bob@test.com")
	if err == nil {
		t.Fatal("expected error for invalid age")
	}
	msg := err.Error()
	if !strings.Contains(msg, "age") {
		t.Error("error should mention age")
	}
	if strings.Contains(msg, "name") {
		t.Error("error should not mention name")
	}
}

func TestCollectErrorsAllOk(t *testing.T) {
	err := CollectErrors(
		func() error { return nil },
		func() error { return nil },
	)
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestCollectErrorsSomeFail(t *testing.T) {
	err := CollectErrors(
		func() error { return nil },
		func() error { return errors.New("fail1") },
		func() error { return errors.New("fail2") },
	)
	if err == nil {
		t.Fatal("expected error")
	}
	msg := err.Error()
	if !strings.Contains(msg, "fail1") || !strings.Contains(msg, "fail2") {
		t.Errorf("expected both errors in message, got %q", msg)
	}
}

type mockCloser struct {
	err error
}

func (m *mockCloser) Close() error { return m.err }

func TestCloseAllSuccess(t *testing.T) {
	err := CloseAll(&mockCloser{nil}, &mockCloser{nil})
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestCloseAllSomeFail(t *testing.T) {
	err := CloseAll(
		&mockCloser{nil},
		&mockCloser{errors.New("close err")},
	)
	if err == nil {
		t.Error("expected error")
	}
}

func TestCountErrorsNil(t *testing.T) {
	if n := CountErrors(nil); n != 0 {
		t.Errorf("CountErrors(nil) = %d, want 0", n)
	}
}

func TestCountErrorsSingle(t *testing.T) {
	if n := CountErrors(errors.New("one")); n != 1 {
		t.Errorf("CountErrors(single) = %d, want 1", n)
	}
}

func TestCountErrorsJoined(t *testing.T) {
	err := errors.Join(errors.New("a"), errors.New("b"), errors.New("c"))
	if n := CountErrors(err); n != 3 {
		t.Errorf("CountErrors(joined) = %d, want 3", n)
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
	"strings"
)

func ValidateUser(name string, age int, email string) error {
	var errs []error
	if name == "" {
		errs = append(errs, errors.New("name is required"))
	}
	if age < 0 || age > 150 {
		errs = append(errs, errors.New("age must be 0-150"))
	}
	if !strings.Contains(email, "@") {
		errs = append(errs, errors.New("email must contain @"))
	}
	return errors.Join(errs...)
}

func CollectErrors(fns ...func() error) error {
	var errs []error
	for _, fn := range fns {
		if err := fn(); err != nil {
			errs = append(errs, err)
		}
	}
	return errors.Join(errs...)
}

type Closer interface {
	Close() error
}

func CloseAll(closers ...Closer) error {
	var errs []error
	for _, c := range closers {
		if err := c.Close(); err != nil {
			errs = append(errs, err)
		}
	}
	return errors.Join(errs...)
}

func CountErrors(err error) int {
	if err == nil {
		return 0
	}
	// Check if it's a joined error (implements Unwrap() []error)
	type unwrapper interface {
		Unwrap() []error
	}
	if uw, ok := err.(unwrapper); ok {
		return len(uw.Unwrap())
	}
	return 1
}

var _ = fmt.Sprintf
var _ = strings.Contains`,
  hints: [
    'ValidateUser: collect errors in a []error slice, then return errors.Join(errs...). errors.Join returns nil if the slice is empty.',
    'CollectErrors: loop through fns, call each, append non-nil errors to a slice, then errors.Join.',
    'CountErrors: errors.Join creates an error that implements Unwrap() []error. Use a type assertion to check for this interface.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_04_is',
  title: 'errors.Is',
  category: 'Error Handling',
  subcategory: 'Errors',
  difficulty: 'intermediate',
  order: 4,
  description: `\`errors.Is(err, target)\` checks if \`target\` appears anywhere in the error chain. Unlike \`==\`, it works with wrapped errors:

\`\`\`
var ErrNotFound = errors.New("not found")
err := fmt.Errorf("user lookup: %w", ErrNotFound)

errors.Is(err, ErrNotFound)  // true — walks the chain
err == ErrNotFound           // false — only checks the outermost
\`\`\`

Your task: use \`errors.Is\` to check error chains for specific sentinel errors.`,
  code: `package main

import (
	"errors"
	"fmt"
)

var (
	ErrNotFound    = errors.New("not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
)

// FetchResource simulates fetching a resource.
// id=0 → wraps ErrNotFound, id<0 → wraps ErrUnauthorized, otherwise → nil
func FetchResource(id int) error {
	// TODO: Return wrapped errors with context
	return nil
}

// HandleFetch calls FetchResource and returns a user-friendly message:
//   nil         → "success"
//   ErrNotFound → "resource not found"
//   ErrUnauthorized → "please log in"
//   other       → "unknown error"
// Use errors.Is to check the error chain.
func HandleFetch(id int) string {
	// TODO
	return ""
}

// IsAnyOf checks if err matches any of the target errors.
func IsAnyOf(err error, targets ...error) bool {
	// TODO
	return false
}

var _ = fmt.Errorf`,
  testCode: `package main

import (
	"errors"
	"testing"
)

func TestFetchResourceNotFound(t *testing.T) {
	err := FetchResource(0)
	if err == nil {
		t.Fatal("FetchResource(0) should error")
	}
	if !errors.Is(err, ErrNotFound) {
		t.Error("should wrap ErrNotFound")
	}
}

func TestFetchResourceUnauthorized(t *testing.T) {
	err := FetchResource(-1)
	if !errors.Is(err, ErrUnauthorized) {
		t.Error("should wrap ErrUnauthorized")
	}
}

func TestFetchResourceOk(t *testing.T) {
	if err := FetchResource(1); err != nil {
		t.Errorf("FetchResource(1) = %v, want nil", err)
	}
}

func TestHandleFetch(t *testing.T) {
	tests := []struct {
		id   int
		want string
	}{
		{1, "success"},
		{0, "resource not found"},
		{-1, "please log in"},
	}
	for _, tt := range tests {
		got := HandleFetch(tt.id)
		if got != tt.want {
			t.Errorf("HandleFetch(%d) = %q, want %q", tt.id, got, tt.want)
		}
	}
}

func TestIsAnyOf(t *testing.T) {
	err := FetchResource(0)
	if !IsAnyOf(err, ErrUnauthorized, ErrNotFound) {
		t.Error("should match ErrNotFound")
	}
	if IsAnyOf(err, ErrForbidden) {
		t.Error("should not match ErrForbidden")
	}
	if IsAnyOf(nil, ErrNotFound) {
		t.Error("nil error should not match anything")
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
)

var (
	ErrNotFound     = errors.New("not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
)

func FetchResource(id int) error {
	if id == 0 {
		return fmt.Errorf("fetch resource %d: %w", id, ErrNotFound)
	}
	if id < 0 {
		return fmt.Errorf("fetch resource %d: %w", id, ErrUnauthorized)
	}
	return nil
}

func HandleFetch(id int) string {
	err := FetchResource(id)
	if err == nil {
		return "success"
	}
	if errors.Is(err, ErrNotFound) {
		return "resource not found"
	}
	if errors.Is(err, ErrUnauthorized) {
		return "please log in"
	}
	return "unknown error"
}

func IsAnyOf(err error, targets ...error) bool {
	for _, target := range targets {
		if errors.Is(err, target) {
			return true
		}
	}
	return false
}`,
  hints: [
    'errors.Is(err, ErrNotFound) walks the entire error chain — works even if err was wrapped with fmt.Errorf("%w").',
    'Always use errors.Is() instead of == for error comparison — it handles wrapped errors correctly.',
    'For IsAnyOf, loop over targets and return true if any errors.Is check passes.'
  ],
}

export default exercise

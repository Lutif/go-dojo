import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_03_wrapping',
  title: 'Error Wrapping',
  category: 'Error Handling',
  subcategory: 'Errors',
  difficulty: 'beginner',
  order: 3,
  description: `Error wrapping adds context while preserving the original error. Use \`fmt.Errorf\` with the \`%w\` verb:

\`\`\`
func ReadConfig(path string) error {
    data, err := os.ReadFile(path)
    if err != nil {
        return fmt.Errorf("reading config %s: %w", path, err)
    }
    // ...
}
\`\`\`

The wrapped error chain can be unwrapped with \`errors.Unwrap()\`, \`errors.Is()\`, or \`errors.As()\`.

Your task: wrap errors to build informative error chains.`,
  code: `package main

import (
	"errors"
	"fmt"
	"strconv"
)

var ErrInvalidInput = errors.New("invalid input")

// ParseInt wraps strconv.Atoi errors with context.
// On error, return: "parseint: <input>: <original error>"
// wrapped with %w so the original error is preserved.
func ParseInt(s string) (int, error) {
	// TODO
	return 0, nil
}

// ValidatePositive checks that n > 0.
// Returns ErrInvalidInput wrapped with context if n <= 0.
func ValidatePositive(n int) error {
	// TODO
	return nil
}

// ParseAndValidate parses a string to int, then validates it's positive.
// Wraps any error with "parse_and_validate: %w".
func ParseAndValidate(s string) (int, error) {
	// TODO: Call ParseInt, then ValidatePositive, wrap errors
	return 0, nil
}

var _ = fmt.Errorf
var _ = strconv.Atoi`,
  testCode: `package main

import (
	"errors"
	"strings"
	"testing"
)

func TestParseIntValid(t *testing.T) {
	n, err := ParseInt("42")
	if err != nil || n != 42 {
		t.Errorf("ParseInt('42') = (%d, %v), want (42, nil)", n, err)
	}
}

func TestParseIntInvalid(t *testing.T) {
	_, err := ParseInt("abc")
	if err == nil {
		t.Fatal("ParseInt('abc') should error")
	}
	if !strings.Contains(err.Error(), "parseint") {
		t.Errorf("error should contain context: %v", err)
	}
	if !strings.Contains(err.Error(), "abc") {
		t.Errorf("error should contain input: %v", err)
	}
}

func TestValidatePositive(t *testing.T) {
	if err := ValidatePositive(5); err != nil {
		t.Errorf("ValidatePositive(5) = %v, want nil", err)
	}
}

func TestValidatePositiveZero(t *testing.T) {
	err := ValidatePositive(0)
	if err == nil {
		t.Fatal("ValidatePositive(0) should error")
	}
	if !errors.Is(err, ErrInvalidInput) {
		t.Error("error should wrap ErrInvalidInput")
	}
}

func TestValidatePositiveNegative(t *testing.T) {
	err := ValidatePositive(-3)
	if !errors.Is(err, ErrInvalidInput) {
		t.Error("error should wrap ErrInvalidInput")
	}
}

func TestParseAndValidateValid(t *testing.T) {
	n, err := ParseAndValidate("10")
	if err != nil || n != 10 {
		t.Errorf("ParseAndValidate('10') = (%d, %v), want (10, nil)", n, err)
	}
}

func TestParseAndValidateBadInput(t *testing.T) {
	_, err := ParseAndValidate("abc")
	if err == nil {
		t.Fatal("should error on bad input")
	}
	if !strings.Contains(err.Error(), "parse_and_validate") {
		t.Errorf("error missing context: %v", err)
	}
}

func TestParseAndValidateNegative(t *testing.T) {
	_, err := ParseAndValidate("-5")
	if err == nil {
		t.Fatal("should error on negative")
	}
	if !errors.Is(err, ErrInvalidInput) {
		t.Error("error chain should include ErrInvalidInput")
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
	"strconv"
)

var ErrInvalidInput = errors.New("invalid input")

func ParseInt(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, fmt.Errorf("parseint: %s: %w", s, err)
	}
	return n, nil
}

func ValidatePositive(n int) error {
	if n <= 0 {
		return fmt.Errorf("must be positive, got %d: %w", n, ErrInvalidInput)
	}
	return nil
}

func ParseAndValidate(s string) (int, error) {
	n, err := ParseInt(s)
	if err != nil {
		return 0, fmt.Errorf("parse_and_validate: %w", err)
	}
	if err := ValidatePositive(n); err != nil {
		return 0, fmt.Errorf("parse_and_validate: %w", err)
	}
	return n, nil
}`,
  hints: [
    'Wrap with %w: fmt.Errorf("context: %w", err) — this preserves the error chain.',
    'Use %v instead of %w if you want to add context but NOT preserve the error for Is/As checks.',
    'Each layer adds its own context: "parse_and_validate: parseint: abc: strconv.Atoi: ..."'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_12_strategies',
  title: 'Error Strategies',
  category: 'Error Handling',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 12,
  description: `Go has several strategies for handling errors. Choosing the right one depends on context:

**1. Return** — propagate the error to the caller:
\`\`\`
val, err := doWork()
if err != nil {
    return fmt.Errorf("doWork failed: %w", err)
}
\`\`\`

**2. Retry** — try again for transient failures:
\`\`\`
for attempts := 0; attempts < 3; attempts++ {
    if err := send(); err == nil {
        return nil
    }
}
\`\`\`

**3. Fallback** — use a default when the primary fails:
\`\`\`
val, err := fetchFromCache()
if err != nil {
    val = computeDefault()
}
\`\`\`

**4. Log and continue** — for non-critical operations.

Your task: implement different error handling strategies.`,
  code: `package main

import (
	"errors"
	"fmt"
)

// Retry calls fn up to maxAttempts times.
// Returns nil on the first success.
// Returns the last error if all attempts fail.
func Retry(maxAttempts int, fn func() error) error {
	// TODO
	return nil
}

// WithFallback calls primary(). If it returns an error,
// calls fallback() and returns its result instead.
func WithFallback(primary func() (string, error), fallback func() string) string {
	// TODO
	return ""
}

// ValidateAge returns a wrapped error if age is invalid,
// nil if valid. Valid range: 0-150.
// Wrap with context: "validation failed: <reason>"
func ValidateAge(age int) error {
	// TODO: Return wrapped errors for invalid ages
	return nil
}

// ProcessWithStrategy processes a value using the given strategy:
//   "retry"    — call fn up to 3 times
//   "fallback" — on error, return ("default", nil)
//   "strict"   — return the error immediately
func ProcessWithStrategy(strategy string, fn func() (string, error)) (string, error) {
	// TODO
	return "", nil
}

var _ = errors.New
var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"errors"
	"testing"
)

func TestRetrySuccess(t *testing.T) {
	calls := 0
	err := Retry(3, func() error {
		calls++
		if calls < 3 {
			return errors.New("fail")
		}
		return nil
	})
	if err != nil {
		t.Errorf("expected success after retries, got %v", err)
	}
	if calls != 3 {
		t.Errorf("expected 3 calls, got %d", calls)
	}
}

func TestRetryAllFail(t *testing.T) {
	err := Retry(3, func() error {
		return errors.New("always fails")
	})
	if err == nil {
		t.Error("expected error when all retries fail")
	}
}

func TestRetryFirstSuccess(t *testing.T) {
	calls := 0
	Retry(5, func() error {
		calls++
		return nil
	})
	if calls != 1 {
		t.Errorf("should stop after first success, got %d calls", calls)
	}
}

func TestWithFallbackPrimaryOk(t *testing.T) {
	got := WithFallback(
		func() (string, error) { return "primary", nil },
		func() string { return "backup" },
	)
	if got != "primary" {
		t.Errorf("got %q, want primary", got)
	}
}

func TestWithFallbackPrimaryFails(t *testing.T) {
	got := WithFallback(
		func() (string, error) { return "", errors.New("fail") },
		func() string { return "backup" },
	)
	if got != "backup" {
		t.Errorf("got %q, want backup", got)
	}
}

func TestValidateAgeValid(t *testing.T) {
	for _, age := range []int{0, 25, 150} {
		if err := ValidateAge(age); err != nil {
			t.Errorf("ValidateAge(%d) = %v, want nil", age, err)
		}
	}
}

func TestValidateAgeNegative(t *testing.T) {
	err := ValidateAge(-1)
	if err == nil {
		t.Error("expected error for negative age")
	}
}

func TestValidateAgeTooOld(t *testing.T) {
	err := ValidateAge(200)
	if err == nil {
		t.Error("expected error for age > 150")
	}
}

func TestProcessRetry(t *testing.T) {
	calls := 0
	val, err := ProcessWithStrategy("retry", func() (string, error) {
		calls++
		if calls < 2 {
			return "", errors.New("fail")
		}
		return "ok", nil
	})
	if err != nil || val != "ok" {
		t.Errorf("got (%q, %v), want (ok, nil)", val, err)
	}
}

func TestProcessFallback(t *testing.T) {
	val, err := ProcessWithStrategy("fallback", func() (string, error) {
		return "", errors.New("fail")
	})
	if err != nil || val != "default" {
		t.Errorf("got (%q, %v), want (default, nil)", val, err)
	}
}

func TestProcessStrict(t *testing.T) {
	_, err := ProcessWithStrategy("strict", func() (string, error) {
		return "", errors.New("fail")
	})
	if err == nil {
		t.Error("strict strategy should return error")
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
)

func Retry(maxAttempts int, fn func() error) error {
	var err error
	for i := 0; i < maxAttempts; i++ {
		err = fn()
		if err == nil {
			return nil
		}
	}
	return err
}

func WithFallback(primary func() (string, error), fallback func() string) string {
	val, err := primary()
	if err != nil {
		return fallback()
	}
	return val
}

func ValidateAge(age int) error {
	if age < 0 {
		return fmt.Errorf("validation failed: %w", errors.New("age cannot be negative"))
	}
	if age > 150 {
		return fmt.Errorf("validation failed: %w", errors.New("age cannot exceed 150"))
	}
	return nil
}

func ProcessWithStrategy(strategy string, fn func() (string, error)) (string, error) {
	switch strategy {
	case "retry":
		var val string
		var err error
		for i := 0; i < 3; i++ {
			val, err = fn()
			if err == nil {
				return val, nil
			}
		}
		return "", err
	case "fallback":
		val, err := fn()
		if err != nil {
			return "default", nil
		}
		return val, nil
	case "strict":
		return fn()
	default:
		return fn()
	}
}

var _ = fmt.Sprintf`,
  hints: [
    'Retry: loop up to maxAttempts, calling fn() each time. Return nil on first success, keep the last error.',
    'WithFallback: call primary(), if err != nil return fallback(), otherwise return the primary result.',
    'ProcessWithStrategy: use a switch on the strategy string. "retry" loops 3 times, "fallback" returns "default" on error, "strict" returns fn() directly.'
  ],
}

export default exercise

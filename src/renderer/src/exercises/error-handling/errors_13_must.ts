import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_13_must',
  title: 'Must Pattern',
  category: 'Error Handling',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 13,
  description: `The "Must" pattern wraps a function that returns \`(T, error)\` and panics on error. It's used when failure is a programming bug, not a runtime condition:

\`\`\`
var tmpl = template.Must(template.New("").Parse("Hello {{.Name}}"))
var re   = regexp.MustCompile(\`\\d+\`)
\`\`\`

Standard library examples: \`template.Must\`, \`regexp.MustCompile\`.

Rules for when to use Must:
- **Package-level initialization** (compile-time known values)
- **Tests** (fail fast on setup errors)
- **Never** in request handlers or user-facing code

Your task: implement generic Must helpers.`,
  code: `package main

import (
	"fmt"
	"strconv"
)

// Must takes a value and error. Returns the value if err is nil,
// panics with the error message if err is non-nil.
func Must[T any](val T, err error) T {
	// TODO
	var zero T
	return zero
}

// MustNoErr panics if err is non-nil. For functions that
// return only an error (no value).
func MustNoErr(err error) {
	// TODO
}

// MustAtoi converts a string to int, panicking if it fails.
// Use strconv.Atoi and Must.
func MustAtoi(s string) int {
	// TODO: Use Must with strconv.Atoi
	return 0
}

// SafeMust is like Must but recovers from the panic
// and returns (zero value, error) instead of panicking.
func SafeMust[T any](fn func() (T, error)) (result T, err error) {
	// TODO: Use defer+recover to catch panics from fn
	// If fn panics, return (zero, error from panic)
	// If fn succeeds, return its result
	var zero T
	return zero, nil
}

var _ = fmt.Sprintf
var _ = strconv.Atoi`,
  testCode: `package main

import (
	"errors"
	"testing"
)

func TestMustSuccess(t *testing.T) {
	got := Must(42, nil)
	if got != 42 {
		t.Errorf("Must(42, nil) = %d, want 42", got)
	}
}

func TestMustPanics(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Error("Must should panic on error")
		}
	}()
	Must(0, errors.New("boom"))
}

func TestMustString(t *testing.T) {
	got := Must("hello", nil)
	if got != "hello" {
		t.Errorf("Must(hello, nil) = %q, want hello", got)
	}
}

func TestMustNoErrNil(t *testing.T) {
	// Should not panic
	MustNoErr(nil)
}

func TestMustNoErrPanics(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Error("MustNoErr should panic on error")
		}
	}()
	MustNoErr(errors.New("fail"))
}

func TestMustAtoi(t *testing.T) {
	if got := MustAtoi("42"); got != 42 {
		t.Errorf("MustAtoi(42) = %d, want 42", got)
	}
}

func TestMustAtoiPanics(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Error("MustAtoi should panic on non-numeric string")
		}
	}()
	MustAtoi("abc")
}

func TestSafeMustSuccess(t *testing.T) {
	val, err := SafeMust(func() (int, error) {
		return 99, nil
	})
	if err != nil || val != 99 {
		t.Errorf("SafeMust = (%d, %v), want (99, nil)", val, err)
	}
}

func TestSafeMustWithPanic(t *testing.T) {
	val, err := SafeMust(func() (int, error) {
		panic("something broke")
	})
	if err == nil {
		t.Error("SafeMust should return error on panic")
	}
	if val != 0 {
		t.Errorf("val = %d, want 0", val)
	}
}

func TestSafeMustWithError(t *testing.T) {
	val, err := SafeMust(func() (int, error) {
		return 0, errors.New("regular error")
	})
	if err == nil {
		t.Error("SafeMust should return error")
	}
	if val != 0 {
		t.Errorf("val = %d, want 0", val)
	}
}`,
  solution: `package main

import (
	"fmt"
	"strconv"
)

func Must[T any](val T, err error) T {
	if err != nil {
		panic(err)
	}
	return val
}

func MustNoErr(err error) {
	if err != nil {
		panic(err)
	}
}

func MustAtoi(s string) int {
	return Must(strconv.Atoi(s))
}

func SafeMust[T any](fn func() (T, error)) (result T, err error) {
	defer func() {
		if r := recover(); r != nil {
			var zero T
			result = zero
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	return fn()
}

var _ = fmt.Sprintf
var _ = strconv.Atoi`,
  hints: [
    'Must: check if err != nil, panic(err). Otherwise return val. Generics let it work with any type.',
    'MustAtoi: just return Must(strconv.Atoi(s)) — Must already handles the (value, error) pair.',
    'SafeMust: use defer+recover. If r := recover(); r != nil, set err = fmt.Errorf("panic: %v", r). Otherwise just call fn() normally.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_08_recover',
  title: 'Recover',
  category: 'Error Handling',
  subcategory: 'Panic & Recover',
  difficulty: 'intermediate',
  order: 8,
  description: `\`recover()\` catches a panic and returns the panic value. It only works inside a \`defer\`red function:

\`\`\`
func safeCall() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("panic: %v", r)
        }
    }()
    riskyFunction() // may panic
    return nil
}
\`\`\`

Common uses: HTTP handlers (prevent one bad request from crashing the server), test harnesses, plugin systems.

Your task: use recover to safely handle panics.`,
  code: `package main

import "fmt"

// SafeDiv divides a by b, recovering from panic if b is 0.
// Returns (result, nil) on success, or (0, error) if a panic occurs.
func SafeDiv(a, b int) (result int, err error) {
	// TODO: Use defer + recover to catch the divide-by-zero panic
	// Then perform a/b (integer division panics on b=0)
	return 0, nil
}

// CatchPanic runs fn() and returns its panic value as an error.
// If fn doesn't panic, returns nil.
func CatchPanic(fn func()) error {
	// TODO: Use defer + recover
	return nil
}

// SafeStringIndex returns the byte at index i of s, or 0 and error
// if the index is out of bounds (catches the panic).
func SafeStringIndex(s string, i int) (byte, error) {
	// TODO
	return 0, nil
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestSafeDivOk(t *testing.T) {
	result, err := SafeDiv(10, 3)
	if err != nil || result != 3 {
		t.Errorf("SafeDiv(10,3) = (%d, %v), want (3, nil)", result, err)
	}
}

func TestSafeDivByZero(t *testing.T) {
	result, err := SafeDiv(10, 0)
	if err == nil {
		t.Error("SafeDiv(10,0) should return error")
	}
	if result != 0 {
		t.Errorf("result = %d, want 0", result)
	}
}

func TestCatchPanicNoPanic(t *testing.T) {
	err := CatchPanic(func() {
		_ = 1 + 1
	})
	if err != nil {
		t.Errorf("expected nil, got %v", err)
	}
}

func TestCatchPanicWithPanic(t *testing.T) {
	err := CatchPanic(func() {
		panic("something broke")
	})
	if err == nil {
		t.Fatal("expected error from panic")
	}
}

func TestSafeStringIndexOk(t *testing.T) {
	b, err := SafeStringIndex("hello", 1)
	if err != nil || b != 'e' {
		t.Errorf("SafeStringIndex(hello,1) = (%c, %v), want (e, nil)", b, err)
	}
}

func TestSafeStringIndexOutOfBounds(t *testing.T) {
	_, err := SafeStringIndex("hello", 10)
	if err == nil {
		t.Error("should return error for out-of-bounds")
	}
}`,
  solution: `package main

import "fmt"

func SafeDiv(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	return a / b, nil
}

func CatchPanic(fn func()) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	fn()
	return nil
}

func SafeStringIndex(s string, i int) (b byte, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("index out of bounds: %v", r)
		}
	}()
	return s[i], nil
}`,
  hints: [
    'recover() must be called inside a deferred function: defer func() { if r := recover(); r != nil { ... } }()',
    'Use named return values (result int, err error) so the deferred function can set err.',
    'recover() returns nil if no panic occurred, so check r != nil before using it.'
  ],
}

export default exercise

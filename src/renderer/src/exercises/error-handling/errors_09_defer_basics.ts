import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_09_defer_basics',
  title: 'Defer Basics',
  category: 'Error Handling',
  subcategory: 'Defer',
  difficulty: 'beginner',
  order: 8,
  description: `\`defer\` schedules a function call to run when the enclosing function returns. Key rules:
1. Deferred calls execute in **LIFO** order (last deferred = first executed)
2. Arguments are evaluated **immediately** when defer is called
3. Deferred functions run **after** the return value is set but **before** the function exits
4. To modify the return value from a defer, use **named return values**

\`\`\`
func example() (result string) {
    defer func() { result += " world" }()
    result = "hello"
    return result // returns "hello world"
}
\`\`\`

Without a named return, \`return result\` copies the value and deferred modifications to the local variable are lost.

Your task: predict and work with defer execution order using named returns.`,
  code: `package main

// DeferOrder returns a slice showing the order of execution
// when multiple defers are stacked.
// Use append in deferred calls and in regular code.
// Hint: use named return so deferred closures can modify the result.
func DeferOrder() (result []string) {
	// TODO: Append "a" normally
	// Defer appending "b"
	// Append "c" normally
	// Defer appending "d"
	// Append "e" normally
	// Expected result: ["a", "c", "e", "d", "b"]
	return result
}

// CountDown returns ["3", "2", "1", "Go!"]
// Use defer for everything — remember LIFO order!
// Hint: use named return so deferred closures can modify the result.
func CountDown() (result []string) {
	// TODO: Defer appending "Go!" first (so it runs last — LIFO)
	// Then loop from 1 to 3, deferring each number
	// LIFO means 3 runs first, then 2, then 1, then "Go!"
	return result
}

// WithCleanup runs the action function, then runs the cleanup function.
// Returns whatever the action returns.
func WithCleanup(action func() string, cleanup func()) string {
	// TODO: Defer cleanup, then call action
	return ""
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestDeferOrder(t *testing.T) {
	got := DeferOrder()
	want := []string{"a", "c", "e", "d", "b"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("DeferOrder() = %v, want %v", got, want)
	}
}

func TestCountDown(t *testing.T) {
	got := CountDown()
	want := []string{"3", "2", "1", "Go!"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("CountDown() = %v, want %v", got, want)
	}
}

func TestWithCleanup(t *testing.T) {
	cleaned := false
	result := WithCleanup(
		func() string { return "done" },
		func() { cleaned = true },
	)
	if result != "done" {
		t.Errorf("result = %q, want done", result)
	}
	if !cleaned {
		t.Error("cleanup should have been called")
	}
}`,
  solution: `package main

import "fmt"

func DeferOrder() (result []string) {
	result = append(result, "a")
	defer func() { result = append(result, "b") }()
	result = append(result, "c")
	defer func() { result = append(result, "d") }()
	result = append(result, "e")
	return result
}

func CountDown() (result []string) {
	defer func() { result = append(result, "Go!") }()
	for i := 1; i <= 3; i++ {
		i := i // capture loop variable
		defer func() { result = append(result, fmt.Sprintf("%d", i)) }()
	}
	return result
}

func WithCleanup(action func() string, cleanup func()) string {
	defer cleanup()
	return action()
}`,
  hints: [
    'Named return values let deferred closures modify the return value. Defers run in LIFO order: the last defer runs first.',
    'For CountDown, use closures with a captured loop variable: i := i inside the loop. Named return is key here too.',
    'WithCleanup: just defer cleanup() on the first line, then call and return action().'
  ],
}

export default exercise

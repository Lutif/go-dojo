import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_09_defer_basics',
  title: 'Defer Basics',
  category: 'Error Handling',
  subcategory: 'Defer',
  difficulty: 'beginner',
  order: 9,
  description: `\`defer\` schedules a function call to run when the enclosing function returns. Key rules:
1. Deferred calls execute in **LIFO** order (last deferred = first executed)
2. Arguments are evaluated **immediately** when defer is called
3. Deferred functions run even if the function panics

\`\`\`
func example() {
    defer fmt.Println("first")
    defer fmt.Println("second")
    fmt.Println("main")
}
// Output: main, second, first
\`\`\`

Your task: predict and work with defer execution order.`,
  code: `package main

// DeferOrder returns a slice showing the order of execution
// when multiple defers are stacked.
// Use append in deferred calls and in regular code.
func DeferOrder() []string {
	result := []string{}
	// TODO: Append "a" normally
	// Defer appending "b"
	// Append "c" normally
	// Defer appending "d"
	// Append "e" normally
	// Expected result: ["a", "c", "e", "d", "b"]
	return result
}

// CountDown returns ["3", "2", "1", "Go!"]
// Use defer with an argument to capture values.
// Remember: defer arguments are evaluated immediately!
func CountDown() []string {
	result := []string{}
	// TODO: Use a loop from 3 to 1 with defer
	// Then append "Go!" normally
	// Hint: defer evaluates args at defer time, not at execution time
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

func DeferOrder() []string {
	result := []string{}
	result = append(result, "a")
	defer func() { result = append(result, "b") }()
	result = append(result, "c")
	defer func() { result = append(result, "d") }()
	result = append(result, "e")
	return result
}

func CountDown() []string {
	result := []string{}
	for i := 1; i <= 3; i++ {
		i := i // capture loop variable
		defer func() { result = append(result, fmt.Sprintf("%d", i)) }()
	}
	result = append(result, "Go!")
	return result
}

func WithCleanup(action func() string, cleanup func()) string {
	defer cleanup()
	return action()
}`,
  hints: [
    'Defers run in LIFO order: the last defer runs first. So defer "b" then defer "d" → d runs before b.',
    'For CountDown, use closures with a captured loop variable: i := i inside the loop.',
    'WithCleanup: just defer cleanup() on the first line, then call and return action().'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_10_defer_closures',
  title: 'Defer with Closures',
  category: 'Error Handling',
  subcategory: 'Defer',
  difficulty: 'intermediate',
  order: 10,
  description: `Deferred closures capture variables **by reference**, which can be surprising:

\`\`\`
x := 0
defer func() { fmt.Println(x) }() // prints 1, not 0!
x = 1
\`\`\`

To capture the *current* value, pass it as a parameter:
\`\`\`
defer func(val int) { fmt.Println(val) }(x) // prints 0
\`\`\`

This distinction is critical when using defer in loops.

Your task: demonstrate correct variable capture with deferred closures.`,
  code: `package main

import "fmt"

// TrackChanges returns a slice of recorded changes.
// The deferred closure should capture the FINAL value of status.
func TrackChanges() string {
	status := "pending"
	var finalStatus string

	// TODO: Defer a closure that captures status by reference
	// and assigns it to finalStatus

	status = "processing"
	status = "complete"

	_ = finalStatus
	return finalStatus
}

// LoopCapture demonstrates the loop variable capture problem.
// It should return [0, 1, 2] by correctly capturing each loop value.
func LoopCapture() []int {
	result := []int{}
	// TODO: Loop i from 0 to 2
	// Use defer with proper variable capture to append i values
	// Remember: defers run in LIFO, so last deferred runs first
	// The result should be [0, 1, 2] (after LIFO reversal)
	return result
}

// ModifyReturn uses a deferred closure to modify the return value.
// It should return 100 (not 42) by modifying the named return in defer.
func ModifyReturn() (result int) {
	// TODO: Defer a closure that sets result = 100
	// Then set result = 42 and return
	return
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestTrackChanges(t *testing.T) {
	got := TrackChanges()
	if got != "complete" {
		t.Errorf("TrackChanges() = %q, want %q (closure captures by reference)", got, "complete")
	}
}

func TestLoopCapture(t *testing.T) {
	got := LoopCapture()
	want := []int{0, 1, 2}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("LoopCapture() = %v, want %v", got, want)
	}
}

func TestModifyReturn(t *testing.T) {
	got := ModifyReturn()
	if got != 100 {
		t.Errorf("ModifyReturn() = %d, want 100", got)
	}
}`,
  solution: `package main

import "fmt"

func TrackChanges() string {
	status := "pending"
	var finalStatus string

	defer func() {
		finalStatus = status // captures status by reference — sees "complete"
	}()

	status = "processing"
	status = "complete"

	return finalStatus
}

func LoopCapture() []int {
	result := []int{}
	for i := 2; i >= 0; i-- {
		i := i // shadow loop variable to capture current value
		defer func() {
			result = append(result, i)
		}()
	}
	return result
}

func ModifyReturn() (result int) {
	defer func() {
		result = 100
	}()
	result = 42
	return
}

var _ = fmt.Sprintf`,
  hints: [
    'Closures capture variables by reference — the deferred function sees the variable\'s value at execution time, not defer time.',
    'To capture the current value in a loop: i := i (shadow the variable), or pass as parameter: defer func(v int){...}(i)',
    'ModifyReturn: deferred closures can modify named return values because they run after the return statement sets them.'
  ],
}

export default exercise

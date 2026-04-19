import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_04_zero_values',
  title: 'Zero Values',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 4,
  description: `In Go, every variable is automatically initialized to its **zero value** if you don't assign one. This means you never have "undefined" — every variable always has a valid value.

Zero values by type:
- \`int\`, \`float64\` → \`0\`
- \`string\` → \`""\` (empty string)
- \`bool\` → \`false\`

Your task: declare variables with \`var\` (no assignment) and return them to demonstrate zero values.`,
  code: `package main

// ZeroValues declares variables without assigning values
// and returns them to show Go's zero-value defaults.
// Declare: an int, a float64, a string, and a bool.
func ZeroValues() (int, float64, string, bool) {
	// TODO: Declare four variables using var (without assigning values)
	// Then return all four.

	return 0, 0, "", false
}`,
  testCode: `package main

import "testing"

func TestZeroValues(t *testing.T) {
	i, f, s, b := ZeroValues()

	if i != 0 {
		t.Errorf("int zero value = %d, want 0", i)
	}
	if f != 0.0 {
		t.Errorf("float64 zero value = %f, want 0.0", f)
	}
	if s != "" {
		t.Errorf("string zero value = %q, want empty string", s)
	}
	if b != false {
		t.Errorf("bool zero value = %v, want false", b)
	}
}`,
  solution: `package main

func ZeroValues() (int, float64, string, bool) {
	var i int
	var f float64
	var s string
	var b bool
	return i, f, s, b
}`,
  hints: [
    'Declare with var but no assignment: var i int — i is automatically 0.',
    'Go has no "undefined" or "null" for basic types. Every type has a well-defined zero value.',
    'You can also group declarations: var (i int; f float64; s string; b bool)'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_04_zero_values',
  title: 'Zero Values',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 4,
  description: `If you declare a variable but do not assign a value, Go still gives it a defined starting value called the **zero value** for that type. There is no "uninitialized" or \`undefined\` like in some other languages: every name always holds something valid and predictable. This makes it easier to reason about code and safe to use a variable even before you overwrite it (for example, summing into an \`int\` that starts at \`0\`).

Common zero values: numeric types are \`0\`, \`string\` is the empty string \`""\`, and \`bool\` is \`false\`. Slices, maps, channels, and function values use \`nil\` until you construct them (you will see those in later lessons).

**Your task:** use \`var\` for an \`int\`, a \`float64\`, a \`string\`, and a \`bool\` *without* assigning, then \`return\` those four names (not literals). The starter returns wrong placeholders on purpose so the test fails until you wire it up.`,
  code: `package main

// ZeroValues declares variables without assigning values
// and returns them to show Go's zero-value defaults.
// Declare: an int, a float64, a string, and a bool.
func ZeroValues() (int, float64, string, bool) {
	// TODO: Declare four variables using var (without assigning values)
	// Then return those variables (not literal 0, "", false — that would skip the lesson).

	return 1, 1.0, "replace me", true
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

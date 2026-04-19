import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_04_empty_interface',
  title: 'Empty Interface',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'beginner',
  order: 4,
  description: `The empty interface \`interface{}\` (or \`any\` since Go 1.18) has no methods, so every type satisfies it. It's Go's version of "accept anything":

\`\`\`
var x interface{} = 42
x = "hello"    // ok — any type works
x = true       // ok
\`\`\`

This is useful for generic containers, but you lose type safety — you need type assertions to use the values. Prefer generics when possible.

Your task: work with empty interface values.`,
  code: `package main

import "fmt"

// Describe returns a description of the value's type and content.
// Use fmt.Sprintf to format.
//   int    → "int: 42"
//   string → "string: hello"
//   bool   → "bool: true"
//   other  → "unknown"
func Describe(val interface{}) string {
	// TODO: Use a type switch
	return ""
}

// WrapSlice takes any three values and returns them as a
// []interface{} slice.
func WrapSlice(a, b, c interface{}) []interface{} {
	// TODO
	return nil
}

// SafeAdd adds two values if they are both ints.
// Returns (sum, true) on success, (0, false) if either is not an int.
func SafeAdd(a, b interface{}) (int, bool) {
	// TODO: Use type assertions with comma-ok
	return 0, false
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestDescribe(t *testing.T) {
	tests := []struct {
		val  interface{}
		want string
	}{
		{42, "int: 42"},
		{"hello", "string: hello"},
		{true, "bool: true"},
		{3.14, "unknown"},
	}
	for _, tt := range tests {
		got := Describe(tt.val)
		if got != tt.want {
			t.Errorf("Describe(%v) = %q, want %q", tt.val, got, tt.want)
		}
	}
}

func TestWrapSlice(t *testing.T) {
	result := WrapSlice(1, "two", true)
	if len(result) != 3 {
		t.Fatalf("WrapSlice returned %d elements, want 3", len(result))
	}
	if result[0] != 1 || result[1] != "two" || result[2] != true {
		t.Errorf("WrapSlice = %v, want [1 two true]", result)
	}
}

func TestSafeAdd(t *testing.T) {
	sum, ok := SafeAdd(3, 4)
	if !ok || sum != 7 {
		t.Errorf("SafeAdd(3,4) = (%d,%v), want (7,true)", sum, ok)
	}
	_, ok2 := SafeAdd(3, "four")
	if ok2 {
		t.Error("SafeAdd(3, 'four') should return false")
	}
	_, ok3 := SafeAdd("three", 4)
	if ok3 {
		t.Error("SafeAdd('three', 4) should return false")
	}
}`,
  solution: `package main

import "fmt"

func Describe(val interface{}) string {
	switch v := val.(type) {
	case int:
		return fmt.Sprintf("int: %d", v)
	case string:
		return fmt.Sprintf("string: %s", v)
	case bool:
		return fmt.Sprintf("bool: %v", v)
	default:
		return "unknown"
	}
}

func WrapSlice(a, b, c interface{}) []interface{} {
	return []interface{}{a, b, c}
}

func SafeAdd(a, b interface{}) (int, bool) {
	aInt, aOk := a.(int)
	bInt, bOk := b.(int)
	if !aOk || !bOk {
		return 0, false
	}
	return aInt + bInt, true
}`,
  hints: [
    'Use a type switch: switch v := val.(type) { case int: ... case string: ... }',
    'WrapSlice: just return []interface{}{a, b, c}',
    'Type assertion with comma-ok: aInt, ok := a.(int) — if ok is false, the assertion failed safely.'
  ],
}

export default exercise

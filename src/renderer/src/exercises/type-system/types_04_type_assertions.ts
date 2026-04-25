import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_04_type_assertions',
  title: 'Type Assertions',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'intermediate',
  order: 4,
  description: `Type assertions extract the concrete type from an interface value:

\`\`\`
var i interface{} = "hello"
s := i.(string)     // panics if i is not a string
s, ok := i.(string) // safe: ok is false if wrong type
\`\`\`

**Always use the comma-ok form** unless you're certain of the type. A failed assertion without the ok variable causes a runtime panic.

Your task: use type assertions to work with interface values safely.`,
  code: `package main

import "fmt"

// Stringify converts an interface value to a string.
// If it's already a string, return it directly.
// If it's an int, convert with fmt.Sprintf.
// If it's a Stringer (has String() method), call String().
// Otherwise return "unsupported".
type Stringer interface {
	String() string
}

func Stringify(val interface{}) string {
	// TODO: Use type assertions (comma-ok) to check each type
	return ""
}

// MustString asserts val is a string and returns it.
// If val is not a string, return "" and false.
func MustString(val interface{}) (string, bool) {
	// TODO
	return "", false
}

// ToIntSlice converts a []interface{} to []int.
// Returns the int slice and true if ALL elements are ints.
// Returns nil and false if any element is not an int.
func ToIntSlice(vals []interface{}) ([]int, bool) {
	// TODO
	return nil, false
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

type myStringer struct{ name string }

func (m myStringer) String() string { return "I am " + m.name }

func TestStringify(t *testing.T) {
	tests := []struct {
		val  interface{}
		want string
	}{
		{"hello", "hello"},
		{42, "42"},
		{myStringer{"Go"}, "I am Go"},
		{3.14, "unsupported"},
	}
	for _, tt := range tests {
		got := Stringify(tt.val)
		if got != tt.want {
			t.Errorf("Stringify(%v) = %q, want %q", tt.val, got, tt.want)
		}
	}
}

func TestMustString(t *testing.T) {
	s, ok := MustString("test")
	if !ok || s != "test" {
		t.Errorf("MustString('test') = (%q,%v), want ('test',true)", s, ok)
	}
	_, ok2 := MustString(42)
	if ok2 {
		t.Error("MustString(42) should return false")
	}
}

func TestToIntSlice(t *testing.T) {
	result, ok := ToIntSlice([]interface{}{1, 2, 3})
	if !ok || !reflect.DeepEqual(result, []int{1, 2, 3}) {
		t.Errorf("ToIntSlice([1,2,3]) = (%v,%v), want ([1,2,3],true)", result, ok)
	}
	_, ok2 := ToIntSlice([]interface{}{1, "two", 3})
	if ok2 {
		t.Error("ToIntSlice with mixed types should return false")
	}
}`,
  solution: `package main

import "fmt"

type Stringer interface {
	String() string
}

func Stringify(val interface{}) string {
	if s, ok := val.(string); ok {
		return s
	}
	if n, ok := val.(int); ok {
		return fmt.Sprintf("%d", n)
	}
	if s, ok := val.(Stringer); ok {
		return s.String()
	}
	return "unsupported"
}

func MustString(val interface{}) (string, bool) {
	s, ok := val.(string)
	return s, ok
}

func ToIntSlice(vals []interface{}) ([]int, bool) {
	result := make([]int, len(vals))
	for i, v := range vals {
		n, ok := v.(int)
		if !ok {
			return nil, false
		}
		result[i] = n
	}
	return result, true
}`,
  hints: [
    'Always use the safe form: s, ok := val.(string) — if ok is false, s is the zero value.',
    'Check concrete types before interfaces — string before Stringer, since a string doesn\'t have a String() method.',
    'For ToIntSlice, try asserting each element; return early with false if any fails.'
  ],
}

export default exercise

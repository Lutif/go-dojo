import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_12_reflect_basics',
  title: 'Reflect Basics',
  category: 'Internals',
  subcategory: 'Reflection',
  difficulty: 'advanced',
  order: 12,
  description: `The \`reflect\` package lets you inspect types and values at runtime:

\`\`\`
import "reflect"

x := 42
t := reflect.TypeOf(x)   // reflect.Type
v := reflect.ValueOf(x)  // reflect.Value

t.Name()  // "int"
t.Kind()  // reflect.Int
v.Int()   // 42
\`\`\`

You can inspect structs:

\`\`\`
type User struct {
    Name string
    Age  int
}
u := User{"Alice", 30}
t := reflect.TypeOf(u)
t.NumField()                // 2
t.Field(0).Name             // "Name"
reflect.ValueOf(u).Field(0) // reflect.Value for "Alice"
\`\`\`

Common \`Kind\` values: \`reflect.Int\`, \`reflect.String\`, \`reflect.Struct\`, \`reflect.Slice\`, \`reflect.Map\`, \`reflect.Ptr\`.

Your task: write functions that use reflection to inspect types, values, and struct fields.`,
  code: `package main

import "reflect"

// TypeName returns the type name of any value (e.g., "int", "string").
func TypeName(v interface{}) string {
	// TODO: Use reflect.TypeOf to get the type name
	_ = reflect.TypeOf(v)
	return ""
}

// KindName returns the Kind of any value as a string (e.g., "int", "struct").
func KindName(v interface{}) string {
	// TODO: Use reflect.TypeOf(v).Kind().String()
	_ = reflect.TypeOf(v)
	return ""
}

// IsPointer returns true if the value is a pointer type.
func IsPointer(v interface{}) bool {
	// TODO: Check if reflect.TypeOf(v).Kind() == reflect.Ptr
	_ = reflect.TypeOf(v)
	return false
}

// Person is used for struct reflection exercises.
type Person struct {
	Name string
	Age  int
	City string
}

// FieldNames returns the names of all fields in a struct.
// Returns nil if v is not a struct.
func FieldNames(v interface{}) []string {
	// TODO: Use reflect.TypeOf(v) to iterate over struct fields
	// Return a slice of field names
	_ = reflect.TypeOf(v)
	return nil
}

// FieldValue returns the value of a named field in a struct as a string.
// Uses fmt.Sprintf("%v", ...) to convert to string. Returns "" if not found.
func FieldValue(v interface{}, fieldName string) string {
	// TODO: Use reflect.ValueOf(v).FieldByName(fieldName)
	// Return the value formatted with fmt.Sprintf
	_ = reflect.ValueOf(v)
	return ""
}`,
  testCode: `package main

import "testing"

func TestTypeName(t *testing.T) {
	tests := []struct {
		input interface{}
		want  string
	}{
		{42, "int"},
		{"hello", "string"},
		{3.14, "float64"},
		{true, "bool"},
		{Person{}, "Person"},
	}
	for _, tt := range tests {
		got := TypeName(tt.input)
		if got != tt.want {
			t.Errorf("TypeName(%v) = %q, want %q", tt.input, got, tt.want)
		}
	}
}

func TestKindName(t *testing.T) {
	tests := []struct {
		input interface{}
		want  string
	}{
		{42, "int"},
		{"hello", "string"},
		{[]int{1}, "slice"},
		{Person{}, "struct"},
	}
	for _, tt := range tests {
		got := KindName(tt.input)
		if got != tt.want {
			t.Errorf("KindName(%v) = %q, want %q", tt.input, got, tt.want)
		}
	}
}

func TestIsPointer(t *testing.T) {
	x := 42
	if IsPointer(x) {
		t.Error("int should not be a pointer")
	}
	if !IsPointer(&x) {
		t.Error("*int should be a pointer")
	}
}

func TestFieldNames(t *testing.T) {
	p := Person{Name: "Alice", Age: 30, City: "NYC"}
	names := FieldNames(p)
	if len(names) != 3 {
		t.Fatalf("expected 3 fields, got %d", len(names))
	}
	want := []string{"Name", "Age", "City"}
	for i, n := range want {
		if names[i] != n {
			t.Errorf("field %d: got %q, want %q", i, names[i], n)
		}
	}
}

func TestFieldNamesNonStruct(t *testing.T) {
	names := FieldNames(42)
	if names != nil {
		t.Errorf("non-struct should return nil, got %v", names)
	}
}

func TestFieldValue(t *testing.T) {
	p := Person{Name: "Bob", Age: 25, City: "LA"}
	if got := FieldValue(p, "Name"); got != "Bob" {
		t.Errorf("FieldValue Name = %q, want %q", got, "Bob")
	}
	if got := FieldValue(p, "Age"); got != "25" {
		t.Errorf("FieldValue Age = %q, want %q", got, "25")
	}
	if got := FieldValue(p, "Missing"); got != "" {
		t.Errorf("FieldValue Missing = %q, want empty", got)
	}
}`,
  solution: `package main

import (
	"fmt"
	"reflect"
)

func TypeName(v interface{}) string {
	return reflect.TypeOf(v).Name()
}

func KindName(v interface{}) string {
	return reflect.TypeOf(v).Kind().String()
}

func IsPointer(v interface{}) bool {
	return reflect.TypeOf(v).Kind() == reflect.Ptr
}

type Person struct {
	Name string
	Age  int
	City string
}

func FieldNames(v interface{}) []string {
	t := reflect.TypeOf(v)
	if t.Kind() != reflect.Struct {
		return nil
	}
	names := make([]string, t.NumField())
	for i := 0; i < t.NumField(); i++ {
		names[i] = t.Field(i).Name
	}
	return names
}

func FieldValue(v interface{}, fieldName string) string {
	val := reflect.ValueOf(v)
	f := val.FieldByName(fieldName)
	if !f.IsValid() {
		return ""
	}
	return fmt.Sprintf("%v", f.Interface())
}`,
  hints: [
    'reflect.TypeOf(v).Name() returns the type name like "int" or "Person".',
    'reflect.TypeOf(v).Kind() returns the kind (int, string, struct, etc.).',
    'reflect.ValueOf(v).FieldByName(name) gets a struct field by name; check IsValid() first.',
  ],
}

export default exercise

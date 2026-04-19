import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_01_fmt',
  title: 'fmt Formatting',
  category: 'Standard Library',
  subcategory: 'Formatting',
  difficulty: 'beginner',
  order: 1,
  description: `The \`fmt\` package handles formatted I/O. Key functions:

\`\`\`
fmt.Sprintf("%s is %d years old", name, age)  // format to string
fmt.Printf("Hello %s\\n", name)                // print formatted
fmt.Println("Hello", "World")                 // print with spaces
\`\`\`

Common verbs:
- \`%s\` — string
- \`%d\` — integer (decimal)
- \`%f\` — float (\`%.2f\` for 2 decimal places)
- \`%v\` — default format (works for any type)
- \`%T\` — type name
- \`%q\` — quoted string
- \`%x\` — hexadecimal
- \`%+v\` — struct with field names
- \`%02d\` — zero-padded integer

Your task: master fmt formatting verbs.`,
  code: `package main

import "fmt"

// FormatPerson returns "Name: <name>, Age: <age>"
func FormatPerson(name string, age int) string {
	// TODO: Use fmt.Sprintf
	return ""
}

// FormatPrice returns a price with 2 decimal places: "$<price>"
// Example: FormatPrice(9.5) → "$9.50"
func FormatPrice(price float64) string {
	// TODO
	return ""
}

// FormatHex returns a number in hex with "0x" prefix.
// Example: FormatHex(255) → "0xff"
func FormatHex(n int) string {
	// TODO
	return ""
}

// FormatTable formats a slice of name-score pairs as aligned columns.
// Each line: "<name>    <score>" with name left-padded to 10 chars.
// Example: FormatTable([][2]string{{"Alice","95"},{"Bob","87"}})
// Returns: "     Alice    95\n       Bob    87"
func FormatTable(rows [][2]string) string {
	// TODO: Use %10s for right-aligned name, %s for score
	return ""
}

// TypeName returns the type of the given value as a string.
// Example: TypeName(42) → "int", TypeName("hi") → "string"
func TypeName(v interface{}) string {
	// TODO: Use %T
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestFormatPerson(t *testing.T) {
	got := FormatPerson("Alice", 30)
	want := "Name: Alice, Age: 30"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestFormatPrice(t *testing.T) {
	tests := []struct{ price float64; want string }{
		{9.5, "$9.50"},
		{0.0, "$0.00"},
		{123.456, "$123.46"},
	}
	for _, tt := range tests {
		got := FormatPrice(tt.price)
		if got != tt.want {
			t.Errorf("FormatPrice(%v) = %q, want %q", tt.price, got, tt.want)
		}
	}
}

func TestFormatHex(t *testing.T) {
	tests := []struct{ n int; want string }{
		{255, "0xff"},
		{0, "0x0"},
		{16, "0x10"},
	}
	for _, tt := range tests {
		got := FormatHex(tt.n)
		if got != tt.want {
			t.Errorf("FormatHex(%d) = %q, want %q", tt.n, got, tt.want)
		}
	}
}

func TestFormatTable(t *testing.T) {
	rows := [][2]string{{"Alice", "95"}, {"Bob", "87"}}
	got := FormatTable(rows)
	want := "     Alice    95\n       Bob    87"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestTypeName(t *testing.T) {
	if got := TypeName(42); got != "int" {
		t.Errorf("TypeName(42) = %q", got)
	}
	if got := TypeName("hi"); got != "string" {
		t.Errorf("TypeName(hi) = %q", got)
	}
	if got := TypeName(3.14); got != "float64" {
		t.Errorf("TypeName(3.14) = %q", got)
	}
}`,
  solution: `package main

import (
	"fmt"
	"strings"
)

func FormatPerson(name string, age int) string {
	return fmt.Sprintf("Name: %s, Age: %d", name, age)
}

func FormatPrice(price float64) string {
	return fmt.Sprintf("$%.2f", price)
}

func FormatHex(n int) string {
	return fmt.Sprintf("0x%x", n)
}

func FormatTable(rows [][2]string) string {
	var lines []string
	for _, row := range rows {
		lines = append(lines, fmt.Sprintf("%10s    %s", row[0], row[1]))
	}
	return strings.Join(lines, "\n")
}

func TypeName(v interface{}) string {
	return fmt.Sprintf("%T", v)
}

var _ = fmt.Sprintf`,
  hints: [
    'FormatPerson: fmt.Sprintf("Name: %s, Age: %d", name, age)',
    'FormatPrice: use %.2f for 2 decimal places: fmt.Sprintf("$%.2f", price)',
    'FormatHex: use %x for lowercase hex: fmt.Sprintf("0x%x", n)'
  ],
}

export default exercise

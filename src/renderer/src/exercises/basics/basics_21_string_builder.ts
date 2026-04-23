import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_21_string_builder',
  title: 'String Builder',
  category: 'Basics',
  subcategory: 'Strings',
  difficulty: 'beginner',
  order: 21,
  description: `Each time you do \`s = s + t\` or \`s += t\` in a tight loop, Go may allocate a new backing array for the growing result — fine for a few appends, expensive for thousands. \`strings.Builder\` holds a **growable buffer** of bytes: you \`WriteString\`, \`WriteByte\`, or \`WriteRune\` in place, and call \`String()\` once at the end. The implementation minimizes copies; it is the standard way to build large or loop-built strings. For tiny joins you might not bother, but this exercise is about the pattern.

\`\`\`
var b strings.Builder
b.WriteString("Hello")
b.WriteString(", ")
b.WriteString("World!")
result := b.String()  // "Hello, World!"
\`\`\`

**Your task:** use \`strings.Builder\` in \`RepeatString\` and \`BuildCSV\` as the comments ask.`,
  code: `package main

import (
	"fmt"
	"strings"
)

// RepeatString returns a string repeated n times.
// Example: RepeatString("ab", 3) → "ababab"
func RepeatString(s string, n int) string {
	// TODO: Use strings.Builder
	return ""
}

// BuildCSV joins a slice of integers as a comma-separated string.
// Example: BuildCSV([]int{1, 2, 3}) → "1,2,3"
func BuildCSV(nums []int) string {
	// TODO: Use strings.Builder with fmt.Fprintf or WriteString
	return ""
}

// ensure imports are used
var _ = fmt.Sprintf
var _ = strings.NewReader`,
  testCode: `package main

import "testing"

func TestRepeatString(t *testing.T) {
	tests := []struct {
		s    string
		n    int
		want string
	}{
		{"ab", 3, "ababab"},
		{"Go", 1, "Go"},
		{"x", 5, "xxxxx"},
		{"hi", 0, ""},
	}
	for _, tt := range tests {
		got := RepeatString(tt.s, tt.n)
		if got != tt.want {
			t.Errorf("RepeatString(%q, %d) = %q, want %q", tt.s, tt.n, got, tt.want)
		}
	}
}

func TestBuildCSV(t *testing.T) {
	tests := []struct {
		nums []int
		want string
	}{
		{[]int{1, 2, 3}, "1,2,3"},
		{[]int{42}, "42"},
		{[]int{}, ""},
		{[]int{10, 20, 30, 40}, "10,20,30,40"},
	}
	for _, tt := range tests {
		got := BuildCSV(tt.nums)
		if got != tt.want {
			t.Errorf("BuildCSV(%v) = %q, want %q", tt.nums, got, tt.want)
		}
	}
}`,
  solution: `package main

import (
	"fmt"
	"strings"
)

func RepeatString(s string, n int) string {
	var b strings.Builder
	for i := 0; i < n; i++ {
		b.WriteString(s)
	}
	return b.String()
}

func BuildCSV(nums []int) string {
	var b strings.Builder
	for i, n := range nums {
		if i > 0 {
			b.WriteByte(',')
		}
		fmt.Fprintf(&b, "%d", n)
	}
	return b.String()
}`,
  hints: [
    'Declare with var b strings.Builder (zero value is ready to use, no need for initialization).',
    'Use b.WriteString(s) in a loop, then b.String() to get the final result.',
    'fmt.Fprintf(&b, "%d", n) writes a formatted int directly into the builder — note the & to pass a pointer.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_13_if_else',
  title: 'If/Else',
  category: 'Basics',
  subcategory: 'Control Flow',
  difficulty: 'beginner',
  order: 13,
  description: `Go's \`if/else\` works like other languages, but with two differences:
1. **No parentheses** around the condition (they're optional but not idiomatic)
2. **Braces are required**, even for single-line bodies

Go also supports an **init statement** in if:
\`\`\`
if x := compute(); x > 10 {
    // x is only in scope here
}
\`\`\`

Your task: implement the classification functions below.`,
  code: `package main

// Classify returns "positive", "negative", or "zero"
func Classify(n int) string {
	// TODO: Use if/else to classify the number
	return ""
}

// FizzBuzz returns:
//   "FizzBuzz" if n is divisible by both 3 and 5
//   "Fizz"     if n is divisible by 3 only
//   "Buzz"     if n is divisible by 5 only
//   the number as a string otherwise
func FizzBuzz(n int) string {
	// TODO
	return ""
}`,
  testCode: `package main

import (
	"fmt"
	"testing"
)

func TestClassify(t *testing.T) {
	tests := []struct {
		n    int
		want string
	}{
		{5, "positive"},
		{-3, "negative"},
		{0, "zero"},
		{100, "positive"},
		{-1, "negative"},
	}
	for _, tt := range tests {
		got := Classify(tt.n)
		if got != tt.want {
			t.Errorf("Classify(%d) = %q, want %q", tt.n, got, tt.want)
		}
	}
}

func TestFizzBuzz(t *testing.T) {
	tests := []struct {
		n    int
		want string
	}{
		{15, "FizzBuzz"},
		{30, "FizzBuzz"},
		{3, "Fizz"},
		{9, "Fizz"},
		{5, "Buzz"},
		{10, "Buzz"},
		{7, "7"},
		{1, "1"},
	}
	for _, tt := range tests {
		got := FizzBuzz(tt.n)
		if got != tt.want {
			t.Errorf("FizzBuzz(%d) = %q, want %q", tt.n, got, tt.want)
		}
	}
}

// ensure fmt is used
var _ = fmt.Sprintf`,
  solution: `package main

import "fmt"

func Classify(n int) string {
	if n > 0 {
		return "positive"
	} else if n < 0 {
		return "negative"
	}
	return "zero"
}

func FizzBuzz(n int) string {
	if n%3 == 0 && n%5 == 0 {
		return "FizzBuzz"
	} else if n%3 == 0 {
		return "Fizz"
	} else if n%5 == 0 {
		return "Buzz"
	}
	return fmt.Sprintf("%d", n)
}`,
  hints: [
    'No parentheses needed: if n > 0 { ... } else if n < 0 { ... }',
    'For FizzBuzz, check the combined case (divisible by both 3 AND 5) first.',
    'Use fmt.Sprintf("%d", n) to convert an integer to a string.'
  ],
}

export default exercise

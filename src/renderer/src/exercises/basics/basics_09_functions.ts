import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_09_functions',
  title: 'Functions',
  category: 'Basics',
  subcategory: 'Functions',
  difficulty: 'beginner',
  order: 9,
  description: `Functions in Go are declared with \`func\`, followed by the name, parameters, and return type:

\`\`\`
func Add(a int, b int) int {
    return a + b
}
\`\`\`

When consecutive parameters share a type, you can shorten it: \`func Add(a, b int) int\`

Your task: implement the functions below.`,
  code: `package main

// Add returns the sum of two integers
func Add(a, b int) int {
	// TODO
	return 0
}

// Greet returns "Hello, <name>!"
func Greet(name string) string {
	// TODO
	return ""
}

// IsEven returns true if n is divisible by 2
func IsEven(n int) bool {
	// TODO
	return false
}`,
  testCode: `package main

import "testing"

func TestAdd(t *testing.T) {
	tests := []struct {
		a, b, want int
	}{
		{2, 3, 5},
		{0, 0, 0},
		{-1, 1, 0},
		{100, -50, 50},
	}
	for _, tt := range tests {
		got := Add(tt.a, tt.b)
		if got != tt.want {
			t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
		}
	}
}

func TestGreet(t *testing.T) {
	got := Greet("Gopher")
	want := "Hello, Gopher!"
	if got != want {
		t.Errorf("Greet(%q) = %q, want %q", "Gopher", got, want)
	}
}

func TestIsEven(t *testing.T) {
	tests := []struct {
		n    int
		want bool
	}{
		{4, true},
		{7, false},
		{0, true},
		{-2, true},
	}
	for _, tt := range tests {
		got := IsEven(tt.n)
		if got != tt.want {
			t.Errorf("IsEven(%d) = %v, want %v", tt.n, got, tt.want)
		}
	}
}`,
  solution: `package main

import "fmt"

func Add(a, b int) int {
	return a + b
}

func Greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

func IsEven(n int) bool {
	return n%2 == 0
}`,
  hints: [
    'For Add, just return a + b.',
    'For Greet, use fmt.Sprintf("Hello, %s!", name) to format the string. Don\'t forget to import "fmt".',
    'For IsEven, the modulo operator % gives the remainder: n % 2 == 0 means even.'
  ],
}

export default exercise

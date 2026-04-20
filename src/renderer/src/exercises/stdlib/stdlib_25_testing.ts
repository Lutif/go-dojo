import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_25_testing',
  title: 'Table-Driven Tests',
  category: 'Standard Library',
  subcategory: 'Testing',
  difficulty: 'intermediate',
  order: 25,
  description: `Go's \`testing\` package supports table-driven tests — a pattern where test cases are defined as data:

\`\`\`
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 1, 2, 3},
        {"zero", 0, 0, 0},
        {"negative", -1, -2, -3},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
\`\`\`

Key testing methods:
- \`t.Error/Errorf\` — report failure, continue
- \`t.Fatal/Fatalf\` — report failure, stop test
- \`t.Run(name, fn)\` — run a subtest
- \`t.Helper()\` — mark function as test helper (cleaner stack traces)

Your task: write functions and their corresponding table-driven tests.`,
  code: `package main

// Abs returns the absolute value of n.
func Abs(n int) int {
	// TODO
	return 0
}

// Clamp constrains value to be within [min, max].
func Clamp(value, min, max int) int {
	// TODO
	return 0
}

// Reverse returns the reverse of a string.
func Reverse(s string) string {
	// TODO
	return ""
}

// IsPalindrome checks if a string reads the same forwards and backwards.
// Case-insensitive.
func IsPalindrome(s string) bool {
	// TODO
	return false
}`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestAbs(t *testing.T) {
	tests := []struct {
		name string
		n    int
		want int
	}{
		{"positive", 5, 5},
		{"negative", -5, 5},
		{"zero", 0, 0},
		{"large negative", -1000000, 1000000},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := Abs(tt.n)
			if got != tt.want {
				t.Errorf("Abs(%d) = %d, want %d", tt.n, got, tt.want)
			}
		})
	}
}

func TestClamp(t *testing.T) {
	tests := []struct {
		name       string
		value      int
		min, max   int
		want       int
	}{
		{"in range", 5, 0, 10, 5},
		{"below min", -5, 0, 10, 0},
		{"above max", 15, 0, 10, 10},
		{"at min", 0, 0, 10, 0},
		{"at max", 10, 0, 10, 10},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := Clamp(tt.value, tt.min, tt.max)
			if got != tt.want {
				t.Errorf("Clamp(%d, %d, %d) = %d, want %d",
					tt.value, tt.min, tt.max, got, tt.want)
			}
		})
	}
}

func TestReverse(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{"simple", "hello", "olleh"},
		{"empty", "", ""},
		{"single", "a", "a"},
		{"palindrome", "racecar", "racecar"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := Reverse(tt.input)
			if got != tt.want {
				t.Errorf("Reverse(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestIsPalindrome(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  bool
	}{
		{"simple palindrome", "racecar", true},
		{"mixed case", "Racecar", true},
		{"not palindrome", "hello", false},
		{"single char", "a", true},
		{"empty", "", true},
		{"two chars same", "aa", true},
		{"two chars diff", "ab", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := IsPalindrome(tt.input)
			if got != tt.want {
				t.Errorf("IsPalindrome(%q) = %v, want %v", tt.input, got, tt.want)
			}
		})
	}
}

var _ = strings.ToLower`,
  solution: `package main

import "strings"

func Abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

func Clamp(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func Reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func IsPalindrome(s string) bool {
	s = strings.ToLower(s)
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		if runes[i] != runes[j] {
			return false
		}
	}
	return true
}`,
  hints: [
    'Abs: if n < 0, return -n.',
    'Clamp: check if value < min or value > max, return the boundary.',
    'Reverse: convert to []rune, swap from both ends toward the middle.',
    'IsPalindrome: lowercase first with strings.ToLower, then check if Reverse equals the original.'
  ],
}

export default exercise

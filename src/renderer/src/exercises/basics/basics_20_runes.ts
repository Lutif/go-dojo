import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_20_runes',
  title: 'Runes',
  category: 'Basics',
  subcategory: 'Strings',
  difficulty: 'beginner',
  order: 20,
  description: `A \`rune\` is Go's type for a single Unicode character (an alias for \`int32\`). This matters because:

- \`len("Hello")\` = 5 (bytes)
- \`len("世界")\` = 6 (bytes — each character is 3 bytes in UTF-8)
- \`len([]rune("世界"))\` = 2 (characters)

When you \`range\` over a string, you get runes (not bytes). To get the true character count, convert to \`[]rune\`.

Your task: work with runes to handle Unicode correctly.`,
  code: `package main

// CharCount returns the number of Unicode characters in a string.
// This may differ from len(s) for non-ASCII strings.
func CharCount(s string) int {
	// TODO
	return 0
}

// Reverse returns the string reversed, handling Unicode correctly.
// Example: "Hello" → "olleH", "世界" → "界世"
func Reverse(s string) string {
	// TODO: Convert to []rune, reverse, convert back to string
	return ""
}

// FirstN returns the first n Unicode characters of s.
// If n > character count, return the whole string.
func FirstN(s string, n int) string {
	// TODO
	return ""
}`,
  testCode: `package main

import "testing"

func TestCharCount(t *testing.T) {
	tests := []struct {
		s    string
		want int
	}{
		{"hello", 5},
		{"世界", 2},
		{"Go世界", 4},
		{"", 0},
	}
	for _, tt := range tests {
		got := CharCount(tt.s)
		if got != tt.want {
			t.Errorf("CharCount(%q) = %d, want %d", tt.s, got, tt.want)
		}
	}
}

func TestReverse(t *testing.T) {
	tests := []struct {
		s, want string
	}{
		{"Hello", "olleH"},
		{"世界", "界世"},
		{"ab", "ba"},
		{"a", "a"},
		{"", ""},
	}
	for _, tt := range tests {
		got := Reverse(tt.s)
		if got != tt.want {
			t.Errorf("Reverse(%q) = %q, want %q", tt.s, got, tt.want)
		}
	}
}

func TestFirstN(t *testing.T) {
	if got := FirstN("Hello", 3); got != "Hel" {
		t.Errorf("FirstN(Hello,3) = %q, want %q", got, "Hel")
	}
	if got := FirstN("世界Go", 2); got != "世界" {
		t.Errorf("FirstN(世界Go,2) = %q, want %q", got, "世界")
	}
	if got := FirstN("Hi", 10); got != "Hi" {
		t.Errorf("FirstN(Hi,10) = %q, want %q", got, "Hi")
	}
}`,
  solution: `package main

func CharCount(s string) int {
	return len([]rune(s))
}

func Reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func FirstN(s string, n int) string {
	runes := []rune(s)
	if n > len(runes) {
		n = len(runes)
	}
	return string(runes[:n])
}`,
  hints: [
    '[]rune(s) converts a string to a slice of runes. len([]rune(s)) gives the character count.',
    'To reverse, convert to []rune, swap elements from both ends moving inward, then convert back with string(runes).',
    'For FirstN, convert to []rune first, then slice runes[:n] and convert back to string.'
  ],
}

export default exercise

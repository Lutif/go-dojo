import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_19_strings',
  title: 'Strings',
  category: 'Basics',
  subcategory: 'Strings',
  difficulty: 'beginner',
  order: 19,
  description: `A Go \`string\` holds a read-only **byte** slice under the hood, almost always in **UTF-8** text encoding. You cannot change a string in place: "editing" creates new strings, which is why the standard library is full of small helpers. The \`strings\` package is the first place to look: case changes (\`ToLower\` / \`ToUpper\`), substrings with \`Contains\`, \`Split\` with a separator, \`ReplaceAll\` for every occurrence, \`TrimSpace\` to strip leading and trailing whitespace, and more. The built-in \`len(s)\` counts **bytes**; to count runes, use a later exercise.

**Your task:** import \`strings\` and implement \`Normalize\`, \`Censor\`, and \`WordCount\` with the right helpers and logic.`,
  code: `package main

import "strings"

// Normalize converts a string to lowercase and trims whitespace.
// Example: "  Hello World  " → "hello world"
func Normalize(s string) string {
	// TODO
	return ""
}

// Censor replaces all occurrences of a word with "***".
// Example: Censor("Go is great", "great") → "Go is ***"
func Censor(text, word string) string {
	// TODO
	return ""
}

// WordCount returns the number of words in a string
// (split by spaces). An empty string has 0 words.
func WordCount(s string) int {
	// TODO
	return 0
}

// ensure strings is used
var _ = strings.ToLower`,
  testCode: `package main

import "testing"

func TestNormalize(t *testing.T) {
	tests := []struct {
		input, want string
	}{
		{"  Hello World  ", "hello world"},
		{"GO", "go"},
		{"  spaces  ", "spaces"},
		{"already", "already"},
	}
	for _, tt := range tests {
		got := Normalize(tt.input)
		if got != tt.want {
			t.Errorf("Normalize(%q) = %q, want %q", tt.input, got, tt.want)
		}
	}
}

func TestCensor(t *testing.T) {
	got := Censor("Go is great and great fun", "great")
	want := "Go is *** and *** fun"
	if got != want {
		t.Errorf("Censor = %q, want %q", got, want)
	}
}

func TestWordCount(t *testing.T) {
	tests := []struct {
		input string
		want  int
	}{
		{"hello world", 2},
		{"one", 1},
		{"the quick brown fox", 4},
		{"", 0},
	}
	for _, tt := range tests {
		got := WordCount(tt.input)
		if got != tt.want {
			t.Errorf("WordCount(%q) = %d, want %d", tt.input, got, tt.want)
		}
	}
}`,
  solution: `package main

import "strings"

func Normalize(s string) string {
	return strings.ToLower(strings.TrimSpace(s))
}

func Censor(text, word string) string {
	return strings.ReplaceAll(text, word, "***")
}

func WordCount(s string) int {
	if s == "" {
		return 0
	}
	return len(strings.Fields(s))
}`,
  hints: [
    'Chain calls: strings.ToLower(strings.TrimSpace(s)) first trims, then lowercases.',
    'strings.ReplaceAll(text, old, new) replaces every occurrence.',
    'strings.Fields(s) splits by whitespace and ignores leading/trailing spaces — better than strings.Split for word counting.'
  ],
}

export default exercise

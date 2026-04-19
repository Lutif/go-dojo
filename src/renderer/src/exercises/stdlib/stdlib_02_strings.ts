import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_02_strings',
  title: 'strings Package',
  category: 'Standard Library',
  subcategory: 'Formatting',
  difficulty: 'beginner',
  order: 2,
  description: `The \`strings\` package provides string manipulation functions:

\`\`\`
strings.Contains("hello world", "world")  // true
strings.Split("a,b,c", ",")              // ["a", "b", "c"]
strings.Join([]string{"a","b"}, "-")      // "a-b"
strings.Replace("foo", "o", "0", -1)      // "f00"
strings.ToUpper("hello")                  // "HELLO"
strings.TrimSpace("  hi  ")              // "hi"
strings.HasPrefix("golang", "go")         // true
strings.Count("hello", "l")              // 2
strings.Repeat("ha", 3)                  // "hahaha"
\`\`\`

Your task: use strings functions to process text.`,
  code: `package main

import "strings"

// WordCount splits text by spaces and returns the number of words.
// Consecutive spaces should not create empty words.
func WordCount(text string) int {
	// TODO: Use strings.Fields (splits on any whitespace)
	return 0
}

// CensorWord replaces all occurrences of word in text with "***".
func CensorWord(text, word string) string {
	// TODO
	return ""
}

// TitleCase capitalizes the first letter of each word.
// "hello world" → "Hello World"
func TitleCase(s string) string {
	// TODO: Split into words, capitalize first letter of each
	return ""
}

// ExtractDomain extracts the domain from an email address.
// "user@example.com" → "example.com"
// Returns "" if no @ found.
func ExtractDomain(email string) string {
	// TODO
	return ""
}

// Abbreviate takes "Hello World" and returns "H.W."
func Abbreviate(phrase string) string {
	// TODO: Take first letter of each word, join with "."
	return ""
}

var _ = strings.Contains`,
  testCode: `package main

import "testing"

func TestWordCount(t *testing.T) {
	tests := []struct{ text string; want int }{
		{"hello world", 2},
		{"  spaces  everywhere  ", 2},
		{"", 0},
		{"single", 1},
		{"one\ttwo\nthree", 3},
	}
	for _, tt := range tests {
		got := WordCount(tt.text)
		if got != tt.want {
			t.Errorf("WordCount(%q) = %d, want %d", tt.text, got, tt.want)
		}
	}
}

func TestCensorWord(t *testing.T) {
	got := CensorWord("I love Go and Go loves me", "Go")
	want := "I love *** and *** loves me"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestCensorWordNotFound(t *testing.T) {
	got := CensorWord("hello world", "xyz")
	if got != "hello world" {
		t.Errorf("got %q, want unchanged", got)
	}
}

func TestTitleCase(t *testing.T) {
	tests := []struct{ input, want string }{
		{"hello world", "Hello World"},
		{"go is great", "Go Is Great"},
		{"a", "A"},
	}
	for _, tt := range tests {
		got := TitleCase(tt.input)
		if got != tt.want {
			t.Errorf("TitleCase(%q) = %q, want %q", tt.input, got, tt.want)
		}
	}
}

func TestExtractDomain(t *testing.T) {
	tests := []struct{ email, want string }{
		{"user@example.com", "example.com"},
		{"admin@sub.domain.org", "sub.domain.org"},
		{"nodomain", ""},
	}
	for _, tt := range tests {
		got := ExtractDomain(tt.email)
		if got != tt.want {
			t.Errorf("ExtractDomain(%q) = %q, want %q", tt.email, got, tt.want)
		}
	}
}

func TestAbbreviate(t *testing.T) {
	tests := []struct{ phrase, want string }{
		{"Hello World", "H.W."},
		{"Application Programming Interface", "A.P.I."},
		{"Go", "G."},
	}
	for _, tt := range tests {
		got := Abbreviate(tt.phrase)
		if got != tt.want {
			t.Errorf("Abbreviate(%q) = %q, want %q", tt.phrase, got, tt.want)
		}
	}
}`,
  solution: `package main

import "strings"

func WordCount(text string) int {
	return len(strings.Fields(text))
}

func CensorWord(text, word string) string {
	return strings.ReplaceAll(text, word, "***")
}

func TitleCase(s string) string {
	words := strings.Fields(s)
	for i, w := range words {
		if len(w) > 0 {
			words[i] = strings.ToUpper(w[:1]) + w[1:]
		}
	}
	return strings.Join(words, " ")
}

func ExtractDomain(email string) string {
	idx := strings.Index(email, "@")
	if idx == -1 {
		return ""
	}
	return email[idx+1:]
}

func Abbreviate(phrase string) string {
	words := strings.Fields(phrase)
	var parts []string
	for _, w := range words {
		parts = append(parts, strings.ToUpper(w[:1]))
	}
	return strings.Join(parts, ".") + "."
}

var _ = strings.Contains`,
  hints: [
    'WordCount: strings.Fields splits on any whitespace and ignores leading/trailing spaces. len() gives the count.',
    'CensorWord: strings.ReplaceAll(text, word, "***") replaces all occurrences.',
    'ExtractDomain: strings.Index(email, "@") finds the @ position. Return email[idx+1:] for everything after it.'
  ],
}

export default exercise

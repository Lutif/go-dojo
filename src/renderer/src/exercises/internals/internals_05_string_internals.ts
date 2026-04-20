import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_05_string_internals',
  title: 'String Internals',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'advanced',
  order: 5,
  description: `A Go string is a read-only 2-word header: \`{pointer, length}\`:

\`\`\`
// Internally (reflect.StringHeader, deprecated):
type StringHeader struct {
    Data uintptr
    Len  int
}
\`\`\`

Key properties:
- **Immutable**: you cannot modify a string's bytes
- **UTF-8**: strings are byte sequences, not character arrays
- \`len(s)\` returns **byte count**, not character count
- Substrings share the backing data: \`s[2:5]\` doesn't copy

\`\`\`
s := "Hello, 世界"
len(s)           // 13 (bytes), not 9 (characters)
[]rune(s)        // 9 runes
[]byte(s)        // 13 bytes, copies the data
\`\`\`

Your task: explore string internals.`,
  code: `package main

// ByteLen returns the byte length of a string.
func ByteLen(s string) int {
	// TODO
	return 0
}

// RuneLen returns the rune (character) count of a string.
func RuneLen(s string) int {
	// TODO: Use range loop or utf8.RuneCountInString
	return 0
}

// IsASCII returns true if all bytes in the string are ASCII (< 128).
func IsASCII(s string) bool {
	// TODO
	return false
}

// ReverseString reverses a string correctly, handling multi-byte characters.
func ReverseString(s string) string {
	// TODO: Convert to []rune, reverse, convert back
	return ""
}

// SubstringNoCopy demonstrates that substringing shares memory.
// Given s, return s[start:end] and whether modifying the substring's
// bytes would affect the original (always true since strings are immutable,
// but the backing data IS shared).
func SubstringNoCopy(s string, start, end int) string {
	// TODO: Just return the substring
	return ""
}`,
  testCode: `package main

import "testing"

func TestByteLen(t *testing.T) {
	if got := ByteLen("hello"); got != 5 {
		t.Errorf("ByteLen(hello) = %d", got)
	}
	if got := ByteLen("世界"); got != 6 {
		t.Errorf("ByteLen(世界) = %d, want 6", got)
	}
}

func TestRuneLen(t *testing.T) {
	if got := RuneLen("hello"); got != 5 {
		t.Errorf("RuneLen(hello) = %d", got)
	}
	if got := RuneLen("世界"); got != 2 {
		t.Errorf("RuneLen(世界) = %d, want 2", got)
	}
	if got := RuneLen("Hello, 世界"); got != 9 {
		t.Errorf("RuneLen(Hello, 世界) = %d, want 9", got)
	}
}

func TestIsASCII(t *testing.T) {
	if !IsASCII("hello world") {
		t.Error("hello world should be ASCII")
	}
	if IsASCII("hello 世界") {
		t.Error("contains non-ASCII")
	}
	if !IsASCII("") {
		t.Error("empty string should be ASCII")
	}
}

func TestReverseString(t *testing.T) {
	if got := ReverseString("hello"); got != "olleh" {
		t.Errorf("got %q", got)
	}
	if got := ReverseString("世界"); got != "界世" {
		t.Errorf("got %q, want 界世", got)
	}
}

func TestSubstringNoCopy(t *testing.T) {
	s := "hello world"
	got := SubstringNoCopy(s, 6, 11)
	if got != "world" {
		t.Errorf("got %q", got)
	}
}`,
  solution: `package main

import "unicode/utf8"

func ByteLen(s string) int {
	return len(s)
}

func RuneLen(s string) int {
	return utf8.RuneCountInString(s)
}

func IsASCII(s string) bool {
	for i := 0; i < len(s); i++ {
		if s[i] >= 128 {
			return false
		}
	}
	return true
}

func ReverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func SubstringNoCopy(s string, start, end int) string {
	return s[start:end]
}`,
  hints: [
    'ByteLen: len(s) returns byte length.',
    'RuneLen: use utf8.RuneCountInString(s) or count iterations of a range loop.',
    'ReverseString: convert to []rune to handle multi-byte chars, reverse, convert back.'
  ],
}

export default exercise

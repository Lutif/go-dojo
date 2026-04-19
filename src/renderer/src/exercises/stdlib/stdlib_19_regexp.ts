import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_19_regexp',
  title: 'Regular Expressions',
  category: 'Standard Library',
  subcategory: 'Text Processing',
  difficulty: 'intermediate',
  order: 19,
  description: `The \`regexp\` package provides RE2 regular expressions:

\`\`\`
re := regexp.MustCompile(\`\\d+\`)       // compile once, reuse
re.MatchString("abc123")              // true
re.FindString("abc123def456")         // "123"
re.FindAllString("abc123def456", -1)  // ["123", "456"]
re.ReplaceAllString("abc123", "NUM")  // "abcNUM"
\`\`\`

Submatches (capture groups):
\`\`\`
re := regexp.MustCompile(\`(\\w+)@(\\w+)\`)
matches := re.FindStringSubmatch("user@host")
// matches[0] = "user@host", [1] = "user", [2] = "host"
\`\`\`

Your task: use regular expressions for pattern matching.`,
  code: `package main

import "regexp"

// IsEmail checks if s looks like a valid email (simple check).
// Pattern: one or more word chars, @, one or more word chars, ., one or more word chars
func IsEmail(s string) bool {
	// TODO
	return false
}

// ExtractNumbers returns all numbers found in s.
func ExtractNumbers(s string) []string {
	// TODO: Find all sequences of digits
	return nil
}

// RedactEmails replaces email addresses with "[REDACTED]" in text.
func RedactEmails(text string) string {
	// TODO
	return ""
}

// ParseKV parses "key=value" pairs from text.
// Each line may contain "key=value" format.
func ParseKV(text string) map[string]string {
	// TODO: Use FindAllStringSubmatch
	return nil
}

var _ = regexp.MustCompile`,
  testCode: `package main

import "testing"

func TestIsEmail(t *testing.T) {
	tests := []struct{ input string; want bool }{
		{"user@example.com", true},
		{"a@b.c", true},
		{"not-email", false},
		{"@missing.com", false},
		{"no-at-sign", false},
	}
	for _, tt := range tests {
		got := IsEmail(tt.input)
		if got != tt.want {
			t.Errorf("IsEmail(%q) = %v, want %v", tt.input, got, tt.want)
		}
	}
}

func TestExtractNumbers(t *testing.T) {
	got := ExtractNumbers("abc123def456ghi")
	want := []string{"123", "456"}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %q", i, got[i])
		}
	}
}

func TestExtractNumbersNone(t *testing.T) {
	got := ExtractNumbers("no numbers here")
	if len(got) != 0 {
		t.Errorf("got %v", got)
	}
}

func TestRedactEmails(t *testing.T) {
	input := "Contact alice@example.com or bob@test.org"
	got := RedactEmails(input)
	want := "Contact [REDACTED] or [REDACTED]"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestParseKV(t *testing.T) {
	input := "name=Alice\nage=30\ncity=NYC"
	got := ParseKV(input)
	if got["name"] != "Alice" || got["age"] != "30" || got["city"] != "NYC" {
		t.Errorf("got %v", got)
	}
}

func TestParseKVEmpty(t *testing.T) {
	got := ParseKV("")
	if len(got) != 0 {
		t.Errorf("got %v", got)
	}
}`,
  solution: `package main

import "regexp"

var emailRe = regexp.MustCompile(` + "`" + `^\w+@\w+\.\w+$` + "`" + `)
var numbersRe = regexp.MustCompile(` + "`" + `\d+` + "`" + `)
var emailInTextRe = regexp.MustCompile(` + "`" + `\w+@\w+\.\w+` + "`" + `)
var kvRe = regexp.MustCompile(` + "`" + `(\w+)=(\S+)` + "`" + `)

func IsEmail(s string) bool {
	return emailRe.MatchString(s)
}

func ExtractNumbers(s string) []string {
	matches := numbersRe.FindAllString(s, -1)
	if matches == nil {
		return nil
	}
	return matches
}

func RedactEmails(text string) string {
	return emailInTextRe.ReplaceAllString(text, "[REDACTED]")
}

func ParseKV(text string) map[string]string {
	result := make(map[string]string)
	matches := kvRe.FindAllStringSubmatch(text, -1)
	for _, m := range matches {
		result[m[1]] = m[2]
	}
	return result
}

var _ = regexp.MustCompile`,
  hints: [
    'IsEmail: regexp.MustCompile(`^\\w+@\\w+\\.\\w+$`).MatchString(s). Anchors ^ and $ ensure full match.',
    'ExtractNumbers: regexp.MustCompile(`\\d+`).FindAllString(s, -1). The -1 means find all matches.',
    'ParseKV: use (\\w+)=(\\S+) with FindAllStringSubmatch. Each match[1] is key, match[2] is value.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_03_strconv',
  title: 'strconv Conversions',
  category: 'Standard Library',
  subcategory: 'Formatting',
  difficulty: 'beginner',
  order: 3,
  description: `The \`strconv\` package converts between strings and basic types:

\`\`\`
// String ↔ Int
i, err := strconv.Atoi("42")      // string → int
s := strconv.Itoa(42)              // int → string

// String ↔ Float
f, err := strconv.ParseFloat("3.14", 64)
s := strconv.FormatFloat(3.14, 'f', 2, 64)

// String ↔ Bool
b, err := strconv.ParseBool("true")
s := strconv.FormatBool(true)

// Other bases
i, err := strconv.ParseInt("ff", 16, 64)  // hex → int
s := strconv.FormatInt(255, 16)            // int → hex
\`\`\`

Your task: convert between strings and other types.`,
  code: `package main

import (
	"fmt"
	"strconv"
)

// ParseInts parses a slice of strings to ints.
// Returns error with the invalid value if any string fails.
func ParseInts(strs []string) ([]int, error) {
	// TODO
	return nil, nil
}

// FormatList converts a slice of ints to comma-separated string.
// [1, 2, 3] → "1,2,3"
func FormatList(nums []int) string {
	// TODO
	return ""
}

// ParseConfig parses "key=value" config lines.
// Values can be int, float, or bool. Returns a map of parsed values.
// Example: "port=8080" → {"port": 8080}
func ParseConfig(lines []string) map[string]interface{} {
	// TODO: Try ParseInt, then ParseFloat, then ParseBool, else keep as string
	return nil
}

// ToBinary returns the binary representation of n.
// Example: ToBinary(10) → "1010"
func ToBinary(n int) string {
	// TODO
	return ""
}

// FromBinary parses a binary string to int.
// Example: FromBinary("1010") → 10
func FromBinary(s string) (int, error) {
	// TODO
	return 0, nil
}

var _ = fmt.Sprintf
var _ = strconv.Atoi`,
  testCode: `package main

import "testing"

func TestParseInts(t *testing.T) {
	got, err := ParseInts([]string{"1", "2", "3"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	want := []int{1, 2, 3}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestParseIntsError(t *testing.T) {
	_, err := ParseInts([]string{"1", "abc", "3"})
	if err == nil {
		t.Error("expected error for invalid input")
	}
}

func TestFormatList(t *testing.T) {
	got := FormatList([]int{1, 2, 3})
	if got != "1,2,3" {
		t.Errorf("got %q, want 1,2,3", got)
	}
}

func TestFormatListEmpty(t *testing.T) {
	got := FormatList([]int{})
	if got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

func TestParseConfig(t *testing.T) {
	lines := []string{"port=8080", "debug=true", "rate=3.14", "name=myapp"}
	cfg := ParseConfig(lines)

	if v, ok := cfg["port"].(int64); !ok || v != 8080 {
		t.Errorf("port = %v", cfg["port"])
	}
	if v, ok := cfg["debug"].(bool); !ok || v != true {
		t.Errorf("debug = %v", cfg["debug"])
	}
	if v, ok := cfg["rate"].(float64); !ok || v != 3.14 {
		t.Errorf("rate = %v", cfg["rate"])
	}
	if v, ok := cfg["name"].(string); !ok || v != "myapp" {
		t.Errorf("name = %v", cfg["name"])
	}
}

func TestToBinary(t *testing.T) {
	tests := []struct{ n int; want string }{
		{10, "1010"},
		{0, "0"},
		{255, "11111111"},
	}
	for _, tt := range tests {
		got := ToBinary(tt.n)
		if got != tt.want {
			t.Errorf("ToBinary(%d) = %q, want %q", tt.n, got, tt.want)
		}
	}
}

func TestFromBinary(t *testing.T) {
	got, err := FromBinary("1010")
	if err != nil || got != 10 {
		t.Errorf("FromBinary(1010) = (%d, %v), want (10, nil)", got, err)
	}
}

func TestFromBinaryError(t *testing.T) {
	_, err := FromBinary("12345")
	if err == nil {
		t.Error("expected error for invalid binary")
	}
}`,
  solution: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func ParseInts(strs []string) ([]int, error) {
	result := make([]int, len(strs))
	for i, s := range strs {
		n, err := strconv.Atoi(s)
		if err != nil {
			return nil, fmt.Errorf("invalid value %q: %w", s, err)
		}
		result[i] = n
	}
	return result, nil
}

func FormatList(nums []int) string {
	parts := make([]string, len(nums))
	for i, n := range nums {
		parts[i] = strconv.Itoa(n)
	}
	return strings.Join(parts, ",")
}

func ParseConfig(lines []string) map[string]interface{} {
	cfg := make(map[string]interface{})
	for _, line := range lines {
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key, val := parts[0], parts[1]

		if i, err := strconv.ParseInt(val, 10, 64); err == nil {
			cfg[key] = i
			continue
		}
		if f, err := strconv.ParseFloat(val, 64); err == nil {
			cfg[key] = f
			continue
		}
		if b, err := strconv.ParseBool(val); err == nil {
			cfg[key] = b
			continue
		}
		cfg[key] = val
	}
	return cfg
}

func ToBinary(n int) string {
	return strconv.FormatInt(int64(n), 2)
}

func FromBinary(s string) (int, error) {
	i, err := strconv.ParseInt(s, 2, 64)
	return int(i), err
}

var _ = fmt.Sprintf
var _ = strconv.Atoi`,
  hints: [
    'ParseInts: loop through strings, use strconv.Atoi for each. Return error with context if any fails.',
    'ParseConfig: split on "=", then try ParseInt → ParseFloat → ParseBool → fallback to string.',
    'ToBinary: strconv.FormatInt(int64(n), 2) formats in base 2. FromBinary: strconv.ParseInt(s, 2, 64) parses base 2.'
  ],
}

export default exercise

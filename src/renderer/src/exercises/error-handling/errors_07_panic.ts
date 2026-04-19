import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_07_panic',
  title: 'Panic',
  category: 'Error Handling',
  subcategory: 'Panic & Recover',
  difficulty: 'intermediate',
  order: 7,
  description: `\`panic\` immediately stops normal execution. It should be reserved for truly unrecoverable situations:
- Programming errors (index out of bounds, nil pointer)
- Impossible states that indicate a bug
- Initialization failures that make the program unusable

\`\`\`
func MustCompile(pattern string) *regexp.Regexp {
    re, err := regexp.Compile(pattern)
    if err != nil {
        panic("invalid regex: " + err.Error())
    }
    return re
}
\`\`\`

Your task: understand when panic is appropriate vs returning errors.`,
  code: `package main

import "fmt"

// MustPositive panics if n <= 0, otherwise returns n.
// Panic message: "expected positive number, got <n>"
func MustPositive(n int) int {
	// TODO
	return 0
}

// SafeIndex returns the element at index i from the slice.
// Instead of letting Go panic on out-of-bounds, return
// the value and a bool (like map access).
func SafeIndex(items []string, i int) (string, bool) {
	// TODO: Return ("", false) for invalid indices
	return "", false
}

// InitConfig validates required config values.
// Panics if "database_url" key is missing from the map.
// Returns the database_url value if present.
func InitConfig(config map[string]string) string {
	// TODO: Panic with "missing required config: database_url"
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestMustPositive(t *testing.T) {
	if got := MustPositive(5); got != 5 {
		t.Errorf("MustPositive(5) = %d, want 5", got)
	}
}

func TestMustPositivePanics(t *testing.T) {
	defer func() {
		r := recover()
		if r == nil {
			t.Error("MustPositive(0) should panic")
		}
	}()
	MustPositive(0)
}

func TestMustPositiveNegativePanics(t *testing.T) {
	defer func() {
		r := recover()
		if r == nil {
			t.Error("MustPositive(-1) should panic")
		}
	}()
	MustPositive(-1)
}

func TestSafeIndex(t *testing.T) {
	items := []string{"a", "b", "c"}
	val, ok := SafeIndex(items, 1)
	if !ok || val != "b" {
		t.Errorf("SafeIndex(1) = (%q, %v), want (b, true)", val, ok)
	}
}

func TestSafeIndexOutOfBounds(t *testing.T) {
	items := []string{"a", "b", "c"}
	_, ok := SafeIndex(items, 5)
	if ok {
		t.Error("SafeIndex(5) should return false")
	}
	_, ok2 := SafeIndex(items, -1)
	if ok2 {
		t.Error("SafeIndex(-1) should return false")
	}
}

func TestInitConfig(t *testing.T) {
	config := map[string]string{"database_url": "postgres://localhost"}
	got := InitConfig(config)
	if got != "postgres://localhost" {
		t.Errorf("InitConfig = %q, want postgres://localhost", got)
	}
}

func TestInitConfigMissing(t *testing.T) {
	defer func() {
		r := recover()
		if r == nil {
			t.Error("InitConfig with missing key should panic")
		}
	}()
	InitConfig(map[string]string{"other": "value"})
}`,
  solution: `package main

import "fmt"

func MustPositive(n int) int {
	if n <= 0 {
		panic(fmt.Sprintf("expected positive number, got %d", n))
	}
	return n
}

func SafeIndex(items []string, i int) (string, bool) {
	if i < 0 || i >= len(items) {
		return "", false
	}
	return items[i], true
}

func InitConfig(config map[string]string) string {
	url, ok := config["database_url"]
	if !ok {
		panic("missing required config: database_url")
	}
	return url
}`,
  hints: [
    'panic(message) stops execution — use panic("expected positive number, got " + ...) or panic(fmt.Sprintf(...))',
    'SafeIndex should NOT panic — check bounds first and return false for invalid indices.',
    'InitConfig is a good panic use case: missing required config at startup means the program can\'t run.'
  ],
}

export default exercise

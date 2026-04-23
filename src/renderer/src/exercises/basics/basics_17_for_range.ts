import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_17_for_range',
  title: 'For Range',
  category: 'Basics',
  subcategory: 'Loops',
  difficulty: 'beginner',
  order: 17,
  description: `The \`for range\` form walks a **sequence** and runs the body once per item. For slices and arrays you get the **index** and the **value**; for strings you get the index and a **rune** (Unicode code point) when the source is valid UTF-8. For maps you get key and value; map iteration order is **not** guaranteed to match insertion order. If you only need the value, write \`for _, v := range\`; if you only need the index, \`for i := range\` is enough. Ranging over a \`nil\` slice or map simply runs zero times, which is safe.

\`\`\`
fruits := []string{"apple", "banana", "cherry"}
for i, fruit := range fruits {
    fmt.Printf("%d: %s\\n", i, fruit)
}
\`\`\`

**Your task:** use \`for range\` in \`Contains\`, \`DoubleAll\`, and \`CountChar\` as described in the file.`,
  code: `package main

// Contains returns true if the slice contains the target string
func Contains(items []string, target string) bool {
	// TODO: Use for range to search
	return false
}

// DoubleAll returns a new slice where every element is doubled
func DoubleAll(nums []int) []int {
	// TODO: Use for range, build a new slice with append
	return nil
}

// CountChar counts how many times a character appears in a string.
// Hint: ranging over a string gives you runes (Unicode characters).
func CountChar(s string, ch rune) int {
	// TODO
	return 0
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestContains(t *testing.T) {
	items := []string{"go", "python", "rust", "java"}
	if !Contains(items, "rust") {
		t.Error("Contains should find 'rust'")
	}
	if Contains(items, "ruby") {
		t.Error("Contains should not find 'ruby'")
	}
	if Contains([]string{}, "anything") {
		t.Error("Contains on empty slice should return false")
	}
}

func TestDoubleAll(t *testing.T) {
	got := DoubleAll([]int{1, 2, 3})
	want := []int{2, 4, 6}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("DoubleAll([1,2,3]) = %v, want %v", got, want)
	}
	got2 := DoubleAll([]int{})
	if len(got2) != 0 {
		t.Errorf("DoubleAll([]) = %v, want empty slice", got2)
	}
}

func TestCountChar(t *testing.T) {
	if got := CountChar("hello", 'l'); got != 2 {
		t.Errorf("CountChar(hello, l) = %d, want 2", got)
	}
	if got := CountChar("hello", 'z'); got != 0 {
		t.Errorf("CountChar(hello, z) = %d, want 0", got)
	}
	if got := CountChar("世界世", '世'); got != 2 {
		t.Errorf("CountChar(世界世, 世) = %d, want 2", got)
	}
}`,
  solution: `package main

func Contains(items []string, target string) bool {
	for _, item := range items {
		if item == target {
			return true
		}
	}
	return false
}

func DoubleAll(nums []int) []int {
	result := []int{}
	for _, n := range nums {
		result = append(result, n*2)
	}
	return result
}

func CountChar(s string, ch rune) int {
	count := 0
	for _, c := range s {
		if c == ch {
			count++
		}
	}
	return count
}`,
  hints: [
    'for _, item := range items — use _ to ignore the index when you only need the value.',
    'Use append(result, value) to add elements to a slice. Initialize with result := []int{}.',
    'When you range over a string, you get runes (not bytes), so Unicode characters work correctly.'
  ],
}

export default exercise

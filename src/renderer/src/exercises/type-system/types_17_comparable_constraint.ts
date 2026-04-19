import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_17_comparable_constraint',
  title: 'Comparable Constraint',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'intermediate',
  order: 17,
  description: `The built-in \`comparable\` constraint allows types that support \`==\` and \`!=\`. This includes:
- All basic types (int, string, bool, float64, etc.)
- Arrays and structs (if their elements are comparable)
- Pointers

**Not comparable**: slices, maps, functions.

\`comparable\` is essential for generic map keys and equality checks.

Your task: use the comparable constraint in generic functions.`,
  code: `package main

// IndexOf returns the index of target in items, or -1 if not found.
func IndexOf[T comparable](items []T, target T) int {
	// TODO
	return -1
}

// Unique returns a new slice with duplicates removed,
// preserving order of first occurrence.
func Unique[T comparable](items []T) []T {
	// TODO: Use a map[T]bool to track seen items
	return nil
}

// Equal checks if two slices contain the same elements in the same order.
func Equal[T comparable](a, b []T) bool {
	// TODO
	return false
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestIndexOfInt(t *testing.T) {
	if got := IndexOf([]int{10, 20, 30}, 20); got != 1 {
		t.Errorf("IndexOf([10,20,30], 20) = %d, want 1", got)
	}
	if got := IndexOf([]int{10, 20, 30}, 99); got != -1 {
		t.Errorf("IndexOf([10,20,30], 99) = %d, want -1", got)
	}
}

func TestIndexOfString(t *testing.T) {
	if got := IndexOf([]string{"a", "b", "c"}, "b"); got != 1 {
		t.Errorf("IndexOf = %d, want 1", got)
	}
}

func TestUniqueInt(t *testing.T) {
	got := Unique([]int{1, 2, 2, 3, 1, 4})
	want := []int{1, 2, 3, 4}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Unique = %v, want %v", got, want)
	}
}

func TestUniqueString(t *testing.T) {
	got := Unique([]string{"go", "rust", "go", "python"})
	want := []string{"go", "rust", "python"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Unique = %v, want %v", got, want)
	}
}

func TestEqualTrue(t *testing.T) {
	if !Equal([]int{1, 2, 3}, []int{1, 2, 3}) {
		t.Error("Equal([1,2,3], [1,2,3]) should be true")
	}
}

func TestEqualFalse(t *testing.T) {
	if Equal([]int{1, 2, 3}, []int{1, 2, 4}) {
		t.Error("Equal([1,2,3], [1,2,4]) should be false")
	}
}

func TestEqualDiffLen(t *testing.T) {
	if Equal([]int{1, 2}, []int{1, 2, 3}) {
		t.Error("Equal with different lengths should be false")
	}
}

func TestEqualEmpty(t *testing.T) {
	if !Equal([]int{}, []int{}) {
		t.Error("Equal([], []) should be true")
	}
}`,
  solution: `package main

func IndexOf[T comparable](items []T, target T) int {
	for i, item := range items {
		if item == target {
			return i
		}
	}
	return -1
}

func Unique[T comparable](items []T) []T {
	seen := make(map[T]bool)
	result := []T{}
	for _, item := range items {
		if !seen[item] {
			seen[item] = true
			result = append(result, item)
		}
	}
	return result
}

func Equal[T comparable](a, b []T) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}`,
  hints: [
    'comparable lets you use == and !=. func IndexOf[T comparable](items []T, target T) int { ... }',
    'map[T]bool works when T is comparable — use it to track seen elements in Unique.',
    'For Equal, check lengths first, then compare element by element.'
  ],
}

export default exercise

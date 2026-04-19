import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_23_slices',
  title: 'Slices',
  category: 'Basics',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 23,
  description: `Slices are Go's most-used collection type — dynamic, resizable views into arrays.

\`\`\`
s := []int{1, 2, 3}          // slice literal
s2 := make([]int, 5)         // length 5, all zeros
s3 := make([]int, 0, 10)     // length 0, capacity 10
\`\`\`

Key properties:
- \`len(s)\` — number of elements
- \`cap(s)\` — capacity (underlying array size)
- \`append(s, elem)\` — add elements (may allocate a new underlying array)
- Slices are **reference types** — assigning a slice shares the underlying array

Your task: create and manipulate slices.`,
  code: `package main

// MakeSequence returns a slice containing integers from 1 to n.
// Example: MakeSequence(5) → [1, 2, 3, 4, 5]
func MakeSequence(n int) []int {
	// TODO: Use make or a literal, then append or assign
	return nil
}

// FilterPositive returns a new slice containing only the positive
// numbers from the input.
// Example: FilterPositive([]int{-1, 2, -3, 4, 0}) → [2, 4]
func FilterPositive(nums []int) []int {
	// TODO
	return nil
}

// Prepend adds an element to the beginning of a slice.
// Example: Prepend([]int{2, 3}, 1) → [1, 2, 3]
func Prepend(s []int, val int) []int {
	// TODO: Hint — append works with slices: append([]int{val}, s...)
	return nil
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestMakeSequence(t *testing.T) {
	got := MakeSequence(5)
	want := []int{1, 2, 3, 4, 5}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("MakeSequence(5) = %v, want %v", got, want)
	}
	got2 := MakeSequence(1)
	if !reflect.DeepEqual(got2, []int{1}) {
		t.Errorf("MakeSequence(1) = %v, want [1]", got2)
	}
	got3 := MakeSequence(0)
	if len(got3) != 0 {
		t.Errorf("MakeSequence(0) should return empty slice, got %v", got3)
	}
}

func TestFilterPositive(t *testing.T) {
	got := FilterPositive([]int{-1, 2, -3, 4, 0})
	want := []int{2, 4}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("FilterPositive = %v, want %v", got, want)
	}
	got2 := FilterPositive([]int{-1, -2})
	if len(got2) != 0 {
		t.Errorf("FilterPositive(all negative) should return empty, got %v", got2)
	}
}

func TestPrepend(t *testing.T) {
	got := Prepend([]int{2, 3}, 1)
	want := []int{1, 2, 3}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Prepend([2,3], 1) = %v, want %v", got, want)
	}
}`,
  solution: `package main

func MakeSequence(n int) []int {
	s := make([]int, 0, n)
	for i := 1; i <= n; i++ {
		s = append(s, i)
	}
	return s
}

func FilterPositive(nums []int) []int {
	result := []int{}
	for _, n := range nums {
		if n > 0 {
			result = append(result, n)
		}
	}
	return result
}

func Prepend(s []int, val int) []int {
	return append([]int{val}, s...)
}`,
  hints: [
    'make([]int, 0, n) creates an empty slice with capacity n. Use append to add elements.',
    'For FilterPositive, start with an empty slice and append only elements > 0.',
    'To prepend: append([]int{val}, s...) — the ... spreads the slice into individual arguments.'
  ],
}

export default exercise

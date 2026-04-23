import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_23_slices',
  title: 'Slices',
  category: 'Basics',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 23,
  description: `A **slice** is a **descriptor** (pointer, length, and capacity) over a backing array, so the length can change as you \`append\` without fixing the type at \`[N]T\`. A slice literal \`[]int{1,2,3}\` or \`make([]int, 5)\` (length 5) or \`make([]int, 0, 10)\` (len 0, cap 10) is how you start. \`len\` is how many elements you may read; \`cap\` is how much room exists before a grow might reallocate. \`append\` can return a new slice header if the array needed to grow; you should always assign the result of \`append\` back. Copying a slice value copies the **header**, not every element, so two slices can share the same array until you \`append\` past capacity in a way that causes a reallocation. That sharing is the main "gotcha" to learn next.

\`\`\`
s := []int{1, 2, 3}
s2 := make([]int, 5)
s3 := make([]int, 0, 10)
\`\`\`

**Your task:** use slice creation, \`append\`, and filtering to complete the three functions in the file.`,
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

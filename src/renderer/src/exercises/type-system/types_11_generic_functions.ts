import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_11_generic_functions',
  title: 'Generic Functions',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'intermediate',
  order: 11,
  description: `Go 1.18+ supports generics via type parameters in square brackets:

\`\`\`
func First[T any](items []T) T {
    return items[0]
}

First([]int{1, 2, 3})       // returns 1
First([]string{"a", "b"})   // returns "a"
\`\`\`

\`any\` is an alias for \`interface{}\` — it allows any type. Constraints like \`comparable\` restrict which types are accepted.

Your task: write generic functions that work with any type.`,
  code: `package main

// Contains checks if a slice contains a specific element.
// Works with any comparable type (supports ==).
func Contains[T comparable](items []T, target T) bool {
	// TODO
	return false
}

// Filter returns a new slice containing only elements where
// the predicate function returns true.
func Filter[T any](items []T, pred func(T) bool) []T {
	// TODO
	return nil
}

// Map transforms each element using the given function.
// Input and output types can differ.
func Map[T any, U any](items []T, fn func(T) U) []U {
	// TODO
	return nil
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestContains(t *testing.T) {
	if !Contains([]int{1, 2, 3}, 2) {
		t.Error("Contains([1,2,3], 2) should be true")
	}
	if Contains([]int{1, 2, 3}, 4) {
		t.Error("Contains([1,2,3], 4) should be false")
	}
	if !Contains([]string{"go", "rust"}, "go") {
		t.Error("Contains([go,rust], go) should be true")
	}
	if Contains([]string{"go", "rust"}, "python") {
		t.Error("Contains([go,rust], python) should be false")
	}
}

func TestFilter(t *testing.T) {
	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	if !reflect.DeepEqual(evens, []int{2, 4, 6}) {
		t.Errorf("Filter evens = %v, want [2,4,6]", evens)
	}
	long := Filter([]string{"a", "bb", "ccc", "d"}, func(s string) bool { return len(s) > 1 })
	if !reflect.DeepEqual(long, []string{"bb", "ccc"}) {
		t.Errorf("Filter long = %v, want [bb,ccc]", long)
	}
}

func TestMap(t *testing.T) {
	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	if !reflect.DeepEqual(doubled, []int{2, 4, 6}) {
		t.Errorf("Map doubled = %v, want [2,4,6]", doubled)
	}
	lengths := Map([]string{"go", "rust", "c"}, func(s string) int { return len(s) })
	if !reflect.DeepEqual(lengths, []int{2, 4, 1}) {
		t.Errorf("Map lengths = %v, want [2,4,1]", lengths)
	}
}`,
  solution: `package main

func Contains[T comparable](items []T, target T) bool {
	for _, item := range items {
		if item == target {
			return true
		}
	}
	return false
}

func Filter[T any](items []T, pred func(T) bool) []T {
	result := []T{}
	for _, item := range items {
		if pred(item) {
			result = append(result, item)
		}
	}
	return result
}

func Map[T any, U any](items []T, fn func(T) U) []U {
	result := make([]U, len(items))
	for i, item := range items {
		result[i] = fn(item)
	}
	return result
}`,
  hints: [
    'Contains needs comparable constraint (for ==): func Contains[T comparable](items []T, target T) bool',
    'Filter: loop over items, call pred(item), append to result if true.',
    'Map can have different input/output types: func Map[T any, U any](items []T, fn func(T) U) []U'
  ],
}

export default exercise

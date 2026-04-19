import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_19_type_parameters',
  title: 'Type Parameters',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'advanced',
  order: 19,
  description: `Advanced generic patterns:

**Multiple type parameters**:
\`\`\`
func Zip[T, U any](a []T, b []U) []Pair[T, U] { ... }
\`\`\`

**Type inference**: The compiler can often infer type parameters from arguments:
\`\`\`
Zip([]int{1,2}, []string{"a","b"})  // T=int, U=string inferred
\`\`\`

**Generic methods** cannot introduce new type parameters — only the struct's parameters are available.

Your task: write functions with multiple type parameters.`,
  code: `package main

type Pair[T, U any] struct {
	First  T
	Second U
}

// Zip combines two slices into a slice of Pairs.
// Uses the shorter length if they differ.
func Zip[T, U any](a []T, b []U) []Pair[T, U] {
	// TODO
	return nil
}

// GroupBy groups slice elements by a key function.
// Returns a map from key to slice of matching elements.
// Example: GroupBy([]int{1,2,3,4}, func(n int) string {
//     if n%2==0 { return "even" }
//     return "odd"
// }) → {"odd": [1,3], "even": [2,4]}
func GroupBy[T any, K comparable](items []T, keyFn func(T) K) map[K][]T {
	// TODO
	return nil
}

// Reduce reduces a slice to a single value using an accumulator function.
// Example: Reduce([]int{1,2,3}, 0, func(acc, n int) int { return acc+n }) → 6
func Reduce[T any, U any](items []T, initial U, fn func(U, T) U) U {
	// TODO
	var zero U
	return zero
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestZip(t *testing.T) {
	got := Zip([]int{1, 2, 3}, []string{"a", "b", "c"})
	want := []Pair[int, string]{
		{1, "a"}, {2, "b"}, {3, "c"},
	}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Zip = %v, want %v", got, want)
	}
}

func TestZipDifferentLengths(t *testing.T) {
	got := Zip([]int{1, 2}, []string{"a", "b", "c"})
	if len(got) != 2 {
		t.Errorf("Zip different lengths: got %d pairs, want 2", len(got))
	}
}

func TestGroupBy(t *testing.T) {
	got := GroupBy([]int{1, 2, 3, 4, 5}, func(n int) string {
		if n%2 == 0 {
			return "even"
		}
		return "odd"
	})
	if !reflect.DeepEqual(got["odd"], []int{1, 3, 5}) {
		t.Errorf("odd = %v, want [1,3,5]", got["odd"])
	}
	if !reflect.DeepEqual(got["even"], []int{2, 4}) {
		t.Errorf("even = %v, want [2,4]", got["even"])
	}
}

func TestGroupByStrings(t *testing.T) {
	got := GroupBy([]string{"apple", "avocado", "banana", "blueberry"}, func(s string) byte {
		return s[0]
	})
	if !reflect.DeepEqual(got['a'], []string{"apple", "avocado"}) {
		t.Errorf("a-words = %v", got['a'])
	}
}

func TestReduceSum(t *testing.T) {
	got := Reduce([]int{1, 2, 3, 4, 5}, 0, func(acc, n int) int { return acc + n })
	if got != 15 {
		t.Errorf("Reduce sum = %d, want 15", got)
	}
}

func TestReduceConcat(t *testing.T) {
	got := Reduce([]string{"Go", " ", "is", " ", "fun"}, "", func(acc, s string) string { return acc + s })
	if got != "Go is fun" {
		t.Errorf("Reduce concat = %q, want %q", got, "Go is fun")
	}
}

func TestReduceCount(t *testing.T) {
	got := Reduce([]int{1, 2, 3, 4, 5}, 0, func(acc, n int) int {
		if n%2 == 0 {
			return acc + 1
		}
		return acc
	})
	if got != 2 {
		t.Errorf("Reduce count evens = %d, want 2", got)
	}
}`,
  solution: `package main

type Pair[T, U any] struct {
	First  T
	Second U
}

func Zip[T, U any](a []T, b []U) []Pair[T, U] {
	n := len(a)
	if len(b) < n {
		n = len(b)
	}
	result := make([]Pair[T, U], n)
	for i := 0; i < n; i++ {
		result[i] = Pair[T, U]{First: a[i], Second: b[i]}
	}
	return result
}

func GroupBy[T any, K comparable](items []T, keyFn func(T) K) map[K][]T {
	result := make(map[K][]T)
	for _, item := range items {
		key := keyFn(item)
		result[key] = append(result[key], item)
	}
	return result
}

func Reduce[T any, U any](items []T, initial U, fn func(U, T) U) U {
	acc := initial
	for _, item := range items {
		acc = fn(acc, item)
	}
	return acc
}`,
  hints: [
    'Zip: find the shorter length with min(len(a), len(b)), then loop and create Pairs.',
    'GroupBy: the key type K must be comparable (for map keys). Use keyFn(item) to get the key for each item.',
    'Reduce: start with acc = initial, then acc = fn(acc, item) for each element.'
  ],
}

export default exercise

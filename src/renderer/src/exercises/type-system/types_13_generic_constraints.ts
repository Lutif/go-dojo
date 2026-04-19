import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_13_generic_constraints',
  title: 'Generic Constraints',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'intermediate',
  order: 13,
  description: `Constraints are interfaces that restrict which types can be used as type parameters. You can define your own:

\`\`\`
type Number interface {
    int | int8 | int16 | int32 | int64 | float32 | float64
}

func Sum[T Number](items []T) T { ... }
\`\`\`

The \`|\` operator creates a **type union** — T must be one of the listed types.

Your task: define constraints and use them in generic functions.`,
  code: `package main

// TODO: Define a Number constraint that includes:
// int, int8, int16, int32, int64, float32, float64

// Sum returns the sum of all elements in a numeric slice.
func Sum[T Number](items []T) T {
	// TODO
	var zero T
	return zero
}

// Max returns the largest element in a non-empty slice.
// Uses the Ordered constraint (types that support < > operators).
type Ordered interface {
	int | int8 | int16 | int32 | int64 |
		float32 | float64 | string
}

func Max[T Ordered](items []T) T {
	// TODO: Assume items is non-empty
	var zero T
	return zero
}

// Clamp restricts a value to be within [min, max].
func Clamp[T Ordered](val, min, max T) T {
	// TODO
	var zero T
	return zero
}`,
  testCode: `package main

import "testing"

func TestSumInts(t *testing.T) {
	got := Sum([]int{1, 2, 3, 4, 5})
	if got != 15 {
		t.Errorf("Sum([1..5]) = %d, want 15", got)
	}
}

func TestSumFloats(t *testing.T) {
	got := Sum([]float64{1.5, 2.5, 3.0})
	if got != 7.0 {
		t.Errorf("Sum([1.5,2.5,3.0]) = %f, want 7.0", got)
	}
}

func TestMaxInts(t *testing.T) {
	got := Max([]int{3, 1, 4, 1, 5, 9})
	if got != 9 {
		t.Errorf("Max = %d, want 9", got)
	}
}

func TestMaxStrings(t *testing.T) {
	got := Max([]string{"banana", "apple", "cherry"})
	if got != "cherry" {
		t.Errorf("Max = %q, want cherry", got)
	}
}

func TestMaxSingle(t *testing.T) {
	got := Max([]int{42})
	if got != 42 {
		t.Errorf("Max([42]) = %d, want 42", got)
	}
}

func TestClamp(t *testing.T) {
	if got := Clamp(15, 0, 10); got != 10 {
		t.Errorf("Clamp(15, 0, 10) = %d, want 10", got)
	}
	if got := Clamp(-5, 0, 10); got != 0 {
		t.Errorf("Clamp(-5, 0, 10) = %d, want 0", got)
	}
	if got := Clamp(5, 0, 10); got != 5 {
		t.Errorf("Clamp(5, 0, 10) = %d, want 5", got)
	}
}`,
  solution: `package main

type Number interface {
	int | int8 | int16 | int32 | int64 | float32 | float64
}

func Sum[T Number](items []T) T {
	var total T
	for _, item := range items {
		total += item
	}
	return total
}

type Ordered interface {
	int | int8 | int16 | int32 | int64 |
		float32 | float64 | string
}

func Max[T Ordered](items []T) T {
	max := items[0]
	for _, item := range items[1:] {
		if item > max {
			max = item
		}
	}
	return max
}

func Clamp[T Ordered](val, min, max T) T {
	if val < min {
		return min
	}
	if val > max {
		return max
	}
	return val
}`,
  hints: [
    'Define constraints with type unions: type Number interface { int | float64 | ... }',
    'var total T initializes to the zero value of T. Then use total += item in a loop.',
    'Clamp: if val < min return min; if val > max return max; otherwise return val.'
  ],
}

export default exercise

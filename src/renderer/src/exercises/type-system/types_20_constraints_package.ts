import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_20_constraints_package',
  title: 'Constraints Package',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'advanced',
  order: 20,
  description: `Go 1.21+ includes the \`cmp\` package with useful generic functions. You can also define your own reusable constraints:

\`\`\`
type Ordered interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
    ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 |
    ~float32 | ~float64 | ~string
}
\`\`\`

Combining methods with type unions creates powerful constraints:
\`\`\`
type Stringer interface {
    comparable
    String() string
}
\`\`\`

Your task: build and use reusable constraints.`,
  code: `package main

import "fmt"

// Ordered is a constraint for types that support comparison operators.
type Ordered interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 |
		~float32 | ~float64 | ~string
}

// Min returns the smaller of two ordered values.
func Min[T Ordered](a, b T) T {
	// TODO
	var zero T
	return zero
}

// SortedInsert inserts val into a sorted slice, maintaining sort order.
// Returns the new slice.
func SortedInsert[T Ordered](sorted []T, val T) []T {
	// TODO: Find the right position and insert
	return nil
}

// IsSorted checks if a slice is in non-decreasing order.
func IsSorted[T Ordered](items []T) bool {
	// TODO
	return false
}

// BinarySearch returns the index of target in a sorted slice,
// or -1 if not found.
func BinarySearch[T Ordered](sorted []T, target T) int {
	// TODO
	return -1
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestMin(t *testing.T) {
	if got := Min(3, 5); got != 3 {
		t.Errorf("Min(3,5) = %d, want 3", got)
	}
	if got := Min(5, 3); got != 3 {
		t.Errorf("Min(5,3) = %d, want 3", got)
	}
	if got := Min("apple", "banana"); got != "apple" {
		t.Errorf("Min(apple,banana) = %q, want apple", got)
	}
	if got := Min(3.14, 2.71); got != 2.71 {
		t.Errorf("Min(3.14,2.71) = %f, want 2.71", got)
	}
}

func TestSortedInsert(t *testing.T) {
	got := SortedInsert([]int{1, 3, 5, 7}, 4)
	want := []int{1, 3, 4, 5, 7}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("SortedInsert = %v, want %v", got, want)
	}
	got2 := SortedInsert([]int{1, 3, 5}, 0)
	want2 := []int{0, 1, 3, 5}
	if !reflect.DeepEqual(got2, want2) {
		t.Errorf("SortedInsert(0) = %v, want %v", got2, want2)
	}
	got3 := SortedInsert([]int{1, 3, 5}, 9)
	want3 := []int{1, 3, 5, 9}
	if !reflect.DeepEqual(got3, want3) {
		t.Errorf("SortedInsert(9) = %v, want %v", got3, want3)
	}
	got4 := SortedInsert([]string{"apple", "cherry"}, "banana")
	want4 := []string{"apple", "banana", "cherry"}
	if !reflect.DeepEqual(got4, want4) {
		t.Errorf("SortedInsert(banana) = %v, want %v", got4, want4)
	}
}

func TestIsSorted(t *testing.T) {
	if !IsSorted([]int{1, 2, 3, 4, 5}) {
		t.Error("IsSorted([1..5]) should be true")
	}
	if IsSorted([]int{1, 3, 2}) {
		t.Error("IsSorted([1,3,2]) should be false")
	}
	if !IsSorted([]int{}) {
		t.Error("IsSorted([]) should be true")
	}
	if !IsSorted([]int{42}) {
		t.Error("IsSorted([42]) should be true")
	}
	if !IsSorted([]int{1, 1, 1}) {
		t.Error("IsSorted([1,1,1]) should be true")
	}
}

func TestBinarySearch(t *testing.T) {
	sorted := []int{2, 4, 6, 8, 10, 12}
	if got := BinarySearch(sorted, 8); got != 3 {
		t.Errorf("BinarySearch(8) = %d, want 3", got)
	}
	if got := BinarySearch(sorted, 2); got != 0 {
		t.Errorf("BinarySearch(2) = %d, want 0", got)
	}
	if got := BinarySearch(sorted, 12); got != 5 {
		t.Errorf("BinarySearch(12) = %d, want 5", got)
	}
	if got := BinarySearch(sorted, 7); got != -1 {
		t.Errorf("BinarySearch(7) = %d, want -1", got)
	}
}`,
  solution: `package main

import "fmt"

type Ordered interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 |
		~float32 | ~float64 | ~string
}

func Min[T Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func SortedInsert[T Ordered](sorted []T, val T) []T {
	i := 0
	for i < len(sorted) && sorted[i] < val {
		i++
	}
	result := make([]T, len(sorted)+1)
	copy(result, sorted[:i])
	result[i] = val
	copy(result[i+1:], sorted[i:])
	return result
}

func IsSorted[T Ordered](items []T) bool {
	for i := 1; i < len(items); i++ {
		if items[i] < items[i-1] {
			return false
		}
	}
	return true
}

func BinarySearch[T Ordered](sorted []T, target T) int {
	lo, hi := 0, len(sorted)-1
	for lo <= hi {
		mid := (lo + hi) / 2
		if sorted[mid] == target {
			return mid
		} else if sorted[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}

var _ = fmt.Sprintf`,
  hints: [
    'The Ordered constraint allows <, >, ==. Use if a < b for Min.',
    'For SortedInsert, find the position where val should go, then use copy to shift elements right.',
    'BinarySearch: maintain lo and hi, check the midpoint, narrow the range until found or lo > hi.'
  ],
}

export default exercise

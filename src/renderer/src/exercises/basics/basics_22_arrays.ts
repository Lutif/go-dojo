import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_22_arrays',
  title: 'Arrays',
  category: 'Basics',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 22,
  description: `An **array** has a length fixed at compile time, and the length is **part of the type**: \`[3]int\` and \`[5]int\` are not interchangeable. You can initialize with a literal, or use \`[...]T{a,b,c}\` to let the compiler count the size. When you pass an array to a function, Go **copies the whole value** (every element) unless you pass a pointer. That makes arrays best for small, fixed things like a row of a fixed width; most lists are built with **slices**, which the next exercise covers, but those slices are implemented with arrays under the skin.

\`\`\`
var a [3]int
b := [3]int{1, 2, 3}
c := [...]int{1, 2, 3} // [3]int
\`\`\`

**Your task:** implement the array-based functions: summing, filling a small times table, and the copy-versus-mutate exercise \`ArraysAreValues\`.`,
  code: `package main

// SumArray returns the sum of all elements in a [5]int array.
func SumArray(arr [5]int) int {
	// TODO
	return 0
}

// MakeMultiplicationRow returns a [10]int array where
// element i (0-indexed) = n * (i+1).
// Example: MakeMultiplicationRow(3) → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
func MakeMultiplicationRow(n int) [10]int {
	// TODO
	return [10]int{}
}

// ArraysAreValues demonstrates that arrays are copied.
// Return true if modifying a copy does NOT affect the original.
func ArraysAreValues() bool {
	original := [3]int{1, 2, 3}
	// TODO: Make a copy, modify the copy, and check that original is unchanged
	_ = original
	return false
}`,
  testCode: `package main

import "testing"

func TestSumArray(t *testing.T) {
	got := SumArray([5]int{1, 2, 3, 4, 5})
	if got != 15 {
		t.Errorf("SumArray([1,2,3,4,5]) = %d, want 15", got)
	}
	got2 := SumArray([5]int{10, 20, 30, 40, 50})
	if got2 != 150 {
		t.Errorf("SumArray([10,20,30,40,50]) = %d, want 150", got2)
	}
}

func TestMakeMultiplicationRow(t *testing.T) {
	got := MakeMultiplicationRow(3)
	want := [10]int{3, 6, 9, 12, 15, 18, 21, 24, 27, 30}
	if got != want {
		t.Errorf("MakeMultiplicationRow(3) = %v, want %v", got, want)
	}
	got2 := MakeMultiplicationRow(7)
	want2 := [10]int{7, 14, 21, 28, 35, 42, 49, 56, 63, 70}
	if got2 != want2 {
		t.Errorf("MakeMultiplicationRow(7) = %v, want %v", got2, want2)
	}
}

func TestArraysAreValues(t *testing.T) {
	if !ArraysAreValues() {
		t.Error("ArraysAreValues() should return true — arrays are value types")
	}
}`,
  solution: `package main

func SumArray(arr [5]int) int {
	sum := 0
	for _, v := range arr {
		sum += v
	}
	return sum
}

func MakeMultiplicationRow(n int) [10]int {
	var result [10]int
	for i := 0; i < 10; i++ {
		result[i] = n * (i + 1)
	}
	return result
}

func ArraysAreValues() bool {
	original := [3]int{1, 2, 3}
	copy := original
	copy[0] = 999
	return original[0] == 1
}`,
  hints: [
    'Use for _, v := range arr to iterate over array elements.',
    'Array elements are accessed by index: arr[i]. Indices start at 0.',
    'copy := original creates a full copy for arrays. Changing copy won\'t affect original.'
  ],
}

export default exercise

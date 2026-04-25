import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_26_slice_operations',
  title: 'Slice Operations',
  category: 'Basics',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 26,
  description: `You can take a **window** over an existing slice with \`s[low:high]\`. The interval is **half-open**: index \`low\` is included, \`high\` is excluded, like many APIs in other languages. Omit \`low\` and it is \`0\`; omit \`high\` and it is \`len(s)\`. These windows are usually **shallow** views: the new header points at the same backing array, so an element in the overlap is **one** storage cell — a write through one sub-slice can be seen through another. If you need a true duplicate, use \`copy\` (or \`append\` into a new slice) so the new data is independent. Reslicing and \`append\` are the tools for delete, split, and chunk patterns in application code.

\`\`\`
s := []int{0, 1, 2, 3, 4}
s[1:3]  // [1, 2]
s[:3]   // [0, 1, 2]
s[2:]   // [2, 3, 4]
\`\`\`

**Your task:** use slicing and the ideas above to implement \`RemoveIndex\`, \`Chunk\`, and \`Unique\`.`,
  code: `package main

// RemoveIndex removes the element at index i from the slice
// and returns the resulting slice.
// Example: RemoveIndex([]int{10, 20, 30, 40}, 1) → [10, 30, 40]
func RemoveIndex(s []int, i int) []int {
	// TODO: Use append with slicing
	return nil
}

// Chunk splits a slice into chunks of size n.
// The last chunk may be smaller than n.
// Example: Chunk([]int{1,2,3,4,5}, 2) → [[1,2], [3,4], [5]]
func Chunk(s []int, n int) [][]int {
	// TODO
	return nil
}

// Unique returns a new slice with duplicates removed,
// preserving the first occurrence order.
// Example: Unique([]int{1, 2, 2, 3, 1}) → [1, 2, 3]
func Unique(s []int) []int {
	// TODO: Use a map to track seen values
	return nil
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestRemoveIndex(t *testing.T) {
	got := RemoveIndex([]int{10, 20, 30, 40}, 1)
	want := []int{10, 30, 40}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("RemoveIndex([10,20,30,40], 1) = %v, want %v", got, want)
	}
	got2 := RemoveIndex([]int{1, 2, 3}, 0)
	if !reflect.DeepEqual(got2, []int{2, 3}) {
		t.Errorf("RemoveIndex([1,2,3], 0) = %v, want [2,3]", got2)
	}
	got3 := RemoveIndex([]int{1, 2, 3}, 2)
	if !reflect.DeepEqual(got3, []int{1, 2}) {
		t.Errorf("RemoveIndex([1,2,3], 2) = %v, want [1,2]", got3)
	}
}

func TestChunk(t *testing.T) {
	got := Chunk([]int{1, 2, 3, 4, 5}, 2)
	want := [][]int{{1, 2}, {3, 4}, {5}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Chunk([1..5], 2) = %v, want %v", got, want)
	}
	got2 := Chunk([]int{1, 2, 3}, 3)
	want2 := [][]int{{1, 2, 3}}
	if !reflect.DeepEqual(got2, want2) {
		t.Errorf("Chunk([1,2,3], 3) = %v, want %v", got2, want2)
	}
	got3 := Chunk([]int{}, 2)
	if len(got3) != 0 {
		t.Errorf("Chunk([], 2) should return empty, got %v", got3)
	}
}

func TestUnique(t *testing.T) {
	got := Unique([]int{1, 2, 2, 3, 1, 4})
	want := []int{1, 2, 3, 4}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Unique = %v, want %v", got, want)
	}
	got2 := Unique([]int{5, 5, 5})
	if !reflect.DeepEqual(got2, []int{5}) {
		t.Errorf("Unique([5,5,5]) = %v, want [5]", got2)
	}
}`,
  solution: `package main

func RemoveIndex(s []int, i int) []int {
	return append(s[:i], s[i+1:]...)
}

func Chunk(s []int, n int) [][]int {
	var chunks [][]int
	for i := 0; i < len(s); i += n {
		end := i + n
		if end > len(s) {
			end = len(s)
		}
		chunks = append(chunks, s[i:end])
	}
	return chunks
}

func Unique(s []int) []int {
	seen := make(map[int]bool)
	result := []int{}
	for _, v := range s {
		if !seen[v] {
			seen[v] = true
			result = append(result, v)
		}
	}
	return result
}`,
  hints: [
    'RemoveIndex: append(s[:i], s[i+1:]...) concatenates everything before and after index i.',
    'For Chunk, loop with step size n. Be careful not to go past len(s) for the last chunk.',
    'For Unique, use a map[int]bool to track which values you\'ve already seen.'
  ],
}

export default exercise

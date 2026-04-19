import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_04_sort',
  title: 'sort Package',
  category: 'Standard Library',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 4,
  description: `The \`sort\` package provides sorting for slices and custom types:

\`\`\`
// Built-in sorts
sort.Ints(nums)           // sort []int in place
sort.Strings(words)       // sort []string in place
sort.Float64s(vals)       // sort []float64

// Custom sort with sort.Slice
sort.Slice(people, func(i, j int) bool {
    return people[i].Age < people[j].Age
})

// Check if sorted
sort.IntsAreSorted(nums)  // true if sorted

// Search (binary search on sorted data)
i := sort.SearchInts(nums, target)
\`\`\`

Your task: sort slices with built-in and custom comparators.`,
  code: `package main

import "sort"

type Person struct {
	Name string
	Age  int
}

// SortByAge sorts people by age (ascending).
func SortByAge(people []Person) {
	// TODO: Use sort.Slice
}

// SortByName sorts people by name (alphabetical).
func SortByName(people []Person) {
	// TODO
}

// TopN returns the top N largest numbers from nums.
// Returns them in descending order.
func TopN(nums []int, n int) []int {
	// TODO: Sort descending, take first n
	return nil
}

// Unique returns sorted unique elements from nums.
func Unique(nums []int) []int {
	// TODO: Sort, then deduplicate
	return nil
}

// Rank returns the 1-based rank of target in sorted nums.
// Returns -1 if not found.
func Rank(nums []int, target int) int {
	// TODO: Sort, use sort.SearchInts
	return -1
}

var _ = sort.Ints`,
  testCode: `package main

import (
	"testing"
)

func TestSortByAge(t *testing.T) {
	people := []Person{{"Charlie", 30}, {"Alice", 25}, {"Bob", 35}}
	SortByAge(people)
	if people[0].Name != "Alice" || people[1].Name != "Charlie" || people[2].Name != "Bob" {
		t.Errorf("got %v", people)
	}
}

func TestSortByName(t *testing.T) {
	people := []Person{{"Charlie", 30}, {"Alice", 25}, {"Bob", 35}}
	SortByName(people)
	if people[0].Name != "Alice" || people[1].Name != "Bob" || people[2].Name != "Charlie" {
		t.Errorf("got %v", people)
	}
}

func TestTopN(t *testing.T) {
	got := TopN([]int{3, 1, 4, 1, 5, 9, 2, 6}, 3)
	want := []int{9, 6, 5}
	if len(got) != 3 {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestTopNMoreThanLength(t *testing.T) {
	got := TopN([]int{3, 1}, 5)
	if len(got) != 2 {
		t.Errorf("got %d elements, want 2", len(got))
	}
}

func TestUnique(t *testing.T) {
	got := Unique([]int{3, 1, 4, 1, 5, 3, 2})
	want := []int{1, 2, 3, 4, 5}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("got[%d] = %d, want %d", i, got[i], want[i])
		}
	}
}

func TestUniqueEmpty(t *testing.T) {
	got := Unique([]int{})
	if len(got) != 0 {
		t.Errorf("got %v", got)
	}
}

func TestRank(t *testing.T) {
	nums := []int{50, 10, 30, 20, 40}
	got := Rank(nums, 30)
	if got != 3 {
		t.Errorf("Rank(30) = %d, want 3", got)
	}
}

func TestRankNotFound(t *testing.T) {
	nums := []int{10, 20, 30}
	got := Rank(nums, 25)
	if got != -1 {
		t.Errorf("Rank(25) = %d, want -1", got)
	}
}`,
  solution: `package main

import "sort"

type Person struct {
	Name string
	Age  int
}

func SortByAge(people []Person) {
	sort.Slice(people, func(i, j int) bool {
		return people[i].Age < people[j].Age
	})
}

func SortByName(people []Person) {
	sort.Slice(people, func(i, j int) bool {
		return people[i].Name < people[j].Name
	})
}

func TopN(nums []int, n int) []int {
	sorted := make([]int, len(nums))
	copy(sorted, nums)
	sort.Sort(sort.Reverse(sort.IntSlice(sorted)))
	if n > len(sorted) {
		n = len(sorted)
	}
	return sorted[:n]
}

func Unique(nums []int) []int {
	if len(nums) == 0 {
		return nil
	}
	sorted := make([]int, len(nums))
	copy(sorted, nums)
	sort.Ints(sorted)
	result := []int{sorted[0]}
	for i := 1; i < len(sorted); i++ {
		if sorted[i] != sorted[i-1] {
			result = append(result, sorted[i])
		}
	}
	return result
}

func Rank(nums []int, target int) int {
	sorted := make([]int, len(nums))
	copy(sorted, nums)
	sort.Ints(sorted)
	idx := sort.SearchInts(sorted, target)
	if idx < len(sorted) && sorted[idx] == target {
		return idx + 1
	}
	return -1
}

var _ = sort.Ints`,
  hints: [
    'SortByAge: sort.Slice(people, func(i, j int) bool { return people[i].Age < people[j].Age })',
    'TopN: copy the slice, sort descending with sort.Reverse(sort.IntSlice(s)), take first n.',
    'Rank: sort a copy, use sort.SearchInts to find the index. Verify the element at that index actually matches.'
  ],
}

export default exercise

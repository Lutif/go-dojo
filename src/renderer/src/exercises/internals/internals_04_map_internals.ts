import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_04_map_internals',
  title: 'Map Internals',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'advanced',
  order: 4,
  description: `Go maps are hash tables. Key properties:

- Unordered: iteration order is randomized
- Not safe for concurrent use (use \`sync.Map\` or a mutex)
- \`make(map[K]V, hint)\` pre-allocates for better performance
- Cannot take address of map elements: \`&m["key"]\` is invalid

\`\`\`
m := make(map[string]int, 100) // hint: expect ~100 entries
m["a"] = 1
v, ok := m["a"]  // ok=true
delete(m, "a")
\`\`\`

Your task: explore map behaviors that reveal internal details.`,
  code: `package main

// MapIterationOrder checks if map iteration is deterministic.
// Insert keys "a","b","c","d","e" with values 1-5.
// Iterate twice and return true if the order was different.
func MapIterationOrder() bool {
	// TODO
	return false
}

// MapPrealloc demonstrates pre-allocation.
// Create a map with hint n, insert n entries "key0"..., return the map.
func MapPrealloc(n int) map[string]int {
	// TODO: Use make(map[string]int, n)
	return nil
}

// MapDeleteAndLen deletes keys from a map and returns the new length.
func MapDeleteAndLen(m map[string]int, keys []string) int {
	// TODO: Delete each key, return len(m)
	return 0
}

// CopyMap returns a shallow copy of a map.
// Modifying the copy should not affect the original.
func CopyMap(m map[string]int) map[string]int {
	// TODO
	return nil
}`,
  testCode: `package main

import "testing"

func TestMapIterationOrder(t *testing.T) {
	// Run multiple times; at least once should show different order
	sawDifferent := false
	for i := 0; i < 10; i++ {
		if MapIterationOrder() {
			sawDifferent = true
			break
		}
	}
	if !sawDifferent {
		t.Error("map iteration should be non-deterministic")
	}
}

func TestMapPrealloc(t *testing.T) {
	m := MapPrealloc(100)
	if len(m) != 100 {
		t.Errorf("len = %d, want 100", len(m))
	}
}

func TestMapDeleteAndLen(t *testing.T) {
	m := map[string]int{"a": 1, "b": 2, "c": 3}
	got := MapDeleteAndLen(m, []string{"a", "c"})
	if got != 1 {
		t.Errorf("got %d, want 1", got)
	}
	if _, ok := m["b"]; !ok {
		t.Error("b should still exist")
	}
}

func TestCopyMap(t *testing.T) {
	original := map[string]int{"a": 1, "b": 2}
	copied := CopyMap(original)
	if len(copied) != 2 || copied["a"] != 1 {
		t.Errorf("copy incorrect: %v", copied)
	}
	copied["a"] = 99
	if original["a"] != 1 {
		t.Error("modifying copy affected original")
	}
}`,
  solution: `package main

import "fmt"

func MapIterationOrder() bool {
	m := map[string]int{"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}

	order1 := make([]string, 0, len(m))
	for k := range m {
		order1 = append(order1, k)
	}

	order2 := make([]string, 0, len(m))
	for k := range m {
		order2 = append(order2, k)
	}

	for i := range order1 {
		if order1[i] != order2[i] {
			return true
		}
	}
	return false
}

func MapPrealloc(n int) map[string]int {
	m := make(map[string]int, n)
	for i := 0; i < n; i++ {
		m[fmt.Sprintf("key%d", i)] = i
	}
	return m
}

func MapDeleteAndLen(m map[string]int, keys []string) int {
	for _, k := range keys {
		delete(m, k)
	}
	return len(m)
}

func CopyMap(m map[string]int) map[string]int {
	result := make(map[string]int, len(m))
	for k, v := range m {
		result[k] = v
	}
	return result
}`,
  hints: [
    'MapIterationOrder: iterate the same map twice, collect keys in order, compare.',
    'MapPrealloc: make(map[string]int, n) then loop inserting fmt.Sprintf("key%d", i).',
    'CopyMap: create a new map, range over original, copy each key-value pair.'
  ],
}

export default exercise

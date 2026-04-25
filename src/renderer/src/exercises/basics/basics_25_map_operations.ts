import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_25_map_operations',
  title: 'Map Operations',
  category: 'Basics',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 25,
  description: `Because a missing key still yields a value (the type’s **zero**), a single \`m[k]\` cannot tell you whether the key was stored or "just absent." The **comma-ok** form, \`v, ok := m[k]\`, returns both the value and a \`bool\` that is \`true\` when the key is present, \`false\` when it is not. Use that whenever zero is a legitimate stored value. The built-in \`delete(m, k)\` removes a key; it is safe to call on a missing key. Iteration is \`for k, v := range m\`; order is **not** defined, so if you need sorted order, copy keys to a slice and sort (as in this exercise’s \`Keys\` function).

\`\`\`
val, ok := m["key"]
if ok { /* key exists */ }
\`\`\`

**Your task:** use comma-ok, \`delete\`, and ranging where needed for \`GetOrDefault\`, \`Keys\`, and \`RemoveZeros\`.`,
  code: `package main

// GetOrDefault returns the value for key if it exists,
// otherwise returns the defaultVal.
func GetOrDefault(m map[string]int, key string, defaultVal int) int {
	// TODO: Use the comma ok pattern
	return 0
}

// Keys returns all keys from the map as a sorted slice.
// Example: Keys(map[string]int{"b":2, "a":1}) → ["a", "b"]
func Keys(m map[string]int) []string {
	// TODO: Collect keys, then sort them
	return nil
}

// RemoveZeros deletes all entries with value 0 from the map
// and returns the modified map.
func RemoveZeros(m map[string]int) map[string]int {
	// TODO: Use delete()
	return nil
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestGetOrDefault(t *testing.T) {
	m := map[string]int{"a": 1, "b": 2}
	if got := GetOrDefault(m, "a", 99); got != 1 {
		t.Errorf("GetOrDefault(a) = %d, want 1", got)
	}
	if got := GetOrDefault(m, "z", 99); got != 99 {
		t.Errorf("GetOrDefault(z) = %d, want 99", got)
	}
	// Key exists with value 0 — should return 0, not default
	m2 := map[string]int{"zero": 0}
	if got := GetOrDefault(m2, "zero", 99); got != 0 {
		t.Errorf("GetOrDefault(zero) = %d, want 0 (key exists)", got)
	}
}

func TestKeys(t *testing.T) {
	got := Keys(map[string]int{"c": 3, "a": 1, "b": 2})
	want := []string{"a", "b", "c"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Keys = %v, want %v", got, want)
	}
	got2 := Keys(map[string]int{})
	if len(got2) != 0 {
		t.Errorf("Keys of empty map should be empty, got %v", got2)
	}
}

func TestRemoveZeros(t *testing.T) {
	m := map[string]int{"a": 1, "b": 0, "c": 3, "d": 0}
	got := RemoveZeros(m)
	want := map[string]int{"a": 1, "c": 3}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("RemoveZeros = %v, want %v", got, want)
	}
}`,
  solution: `package main

import "sort"

func GetOrDefault(m map[string]int, key string, defaultVal int) int {
	val, ok := m[key]
	if ok {
		return val
	}
	return defaultVal
}

func Keys(m map[string]int) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

func RemoveZeros(m map[string]int) map[string]int {
	for k, v := range m {
		if v == 0 {
			delete(m, k)
		}
	}
	return m
}`,
  hints: [
    'The comma ok pattern: val, ok := m[key] — ok is true if the key exists, false otherwise.',
    'for k := range m iterates over keys only. Use sort.Strings() to sort (import "sort").',
    'delete(m, key) removes a key from the map. It\'s safe to call even if the key doesn\'t exist.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_25_maps',
  title: 'Maps',
  category: 'Basics',
  subcategory: 'Collections',
  difficulty: 'beginner',
  order: 25,
  description: `A \`map[K]V\` is an associative container: you look up values of type V by a **key** of type K. Insert or update with \`m[key] = value\`, read with \`m[key]\` (if the key is missing, you get the value type’s **zero value**, which is ambiguous — the next exercise fixes that with a two-value lookup). A map variable is \`nil\` until you assign a map created with a composite literal or \`make\`; a **nil** map can be read from (it behaves like empty) but must not be **written** to — you need a real map for assignment. The zero value of a map is \`nil\`; the zero value of an entry is separate.

\`\`\`
ages := map[string]int{
    "Alice": 30,
    "Bob":   25,
}
ages["Charlie"] = 35
\`\`\`

**Your task:** build a letter-counting map, invert a string map, and merge two integer maps with the "later wins" rule in \`Merge\`.`,
  code: `package main

// CountLetters returns a map from each lowercase letter to its count.
// Example: CountLetters("hello") → {"h":1, "e":1, "l":2, "o":1}
func CountLetters(s string) map[rune]int {
	// TODO
	return nil
}

// Invert swaps keys and values in a map.
// Example: Invert(map[string]string{"a":"1"}) → {"1":"a"}
func Invert(m map[string]string) map[string]string {
	// TODO
	return nil
}

// Merge combines two maps. If both have the same key,
// the value from b wins.
func Merge(a, b map[string]int) map[string]int {
	// TODO
	return nil
}`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestCountLetters(t *testing.T) {
	got := CountLetters("hello")
	want := map[rune]int{'h': 1, 'e': 1, 'l': 2, 'o': 1}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("CountLetters(hello) = %v, want %v", got, want)
	}
	got2 := CountLetters("")
	if len(got2) != 0 {
		t.Errorf("CountLetters('') should be empty, got %v", got2)
	}
}

func TestInvert(t *testing.T) {
	got := Invert(map[string]string{"a": "1", "b": "2"})
	want := map[string]string{"1": "a", "2": "b"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Invert = %v, want %v", got, want)
	}
}

func TestMerge(t *testing.T) {
	a := map[string]int{"x": 1, "y": 2}
	b := map[string]int{"y": 99, "z": 3}
	got := Merge(a, b)
	want := map[string]int{"x": 1, "y": 99, "z": 3}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Merge = %v, want %v", got, want)
	}
}`,
  solution: `package main

func CountLetters(s string) map[rune]int {
	counts := make(map[rune]int)
	for _, ch := range s {
		counts[ch]++
	}
	return counts
}

func Invert(m map[string]string) map[string]string {
	result := make(map[string]string)
	for k, v := range m {
		result[v] = k
	}
	return result
}

func Merge(a, b map[string]int) map[string]int {
	result := make(map[string]int)
	for k, v := range a {
		result[k] = v
	}
	for k, v := range b {
		result[k] = v
	}
	return result
}`,
  hints: [
    'counts[ch]++ works even if ch hasn\'t been set — the zero value for int is 0, so it starts at 0 then increments.',
    'Always initialize maps with make(map[K]V) or a literal before writing to them.',
    'For Merge, copy all of a first, then overwrite with all of b — b\'s values take priority.'
  ],
}

export default exercise

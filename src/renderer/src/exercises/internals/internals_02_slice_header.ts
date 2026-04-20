import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_02_slice_header',
  title: 'Slice Header',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'advanced',
  order: 2,
  description: `A slice is a 3-word header: \`{pointer, length, capacity}\`:

\`\`\`
// reflect.SliceHeader (deprecated but illustrative):
type SliceHeader struct {
    Data uintptr  // pointer to underlying array
    Len  int
    Cap  int
}
\`\`\`

Multiple slices can share the same backing array:
\`\`\`
a := []int{1, 2, 3, 4, 5}
b := a[1:3]   // b shares a's array, Len=2, Cap=4
b[0] = 99     // also modifies a[1]!
\`\`\`

Your task: explore how slices share memory.`,
  code: `package main

// SharesBackingArray returns true if two slices share the same backing array.
// Hint: modifying one should affect the other.
func SharesBackingArray(a, b []int) bool {
	// TODO: Check if slices overlap in memory
	return false
}

// SliceInfo returns len and cap of a slice.
func SliceInfo(s []int) (length, capacity int) {
	// TODO
	return 0, 0
}

// SubsliceEffect demonstrates that subslices share memory.
// Create a slice [1,2,3,4,5], take a[1:3], modify the subslice's first element to 99.
// Return the original slice.
func SubsliceEffect() []int {
	// TODO
	return nil
}

// AppendBeyondCap shows what happens when append exceeds capacity.
// Given a slice, append an element. Return whether the result shares
// the backing array with the original.
func AppendBeyondCap(s []int) bool {
	// TODO: Append to a full slice (len == cap) and check sharing
	return false
}`,
  testCode: `package main

import "testing"

func TestSharesBackingArrayTrue(t *testing.T) {
	a := []int{1, 2, 3, 4, 5}
	b := a[1:3]
	if !SharesBackingArray(a, b) {
		t.Error("subslice should share backing array")
	}
}

func TestSharesBackingArrayFalse(t *testing.T) {
	a := []int{1, 2, 3}
	b := []int{1, 2, 3}
	if SharesBackingArray(a, b) {
		t.Error("separate slices should not share backing array")
	}
}

func TestSliceInfo(t *testing.T) {
	s := make([]int, 3, 10)
	l, c := SliceInfo(s)
	if l != 3 || c != 10 {
		t.Errorf("got len=%d cap=%d, want len=3 cap=10", l, c)
	}
}

func TestSubsliceEffect(t *testing.T) {
	got := SubsliceEffect()
	if len(got) != 5 {
		t.Fatalf("length = %d, want 5", len(got))
	}
	if got[1] != 99 {
		t.Errorf("got[1] = %d, want 99 (modified via subslice)", got[1])
	}
}

func TestAppendBeyondCap(t *testing.T) {
	s := make([]int, 3, 3) // full: len == cap
	shares := AppendBeyondCap(s)
	if shares {
		t.Error("append beyond capacity should create new backing array")
	}
}`,
  solution: `package main

import "unsafe"

func SharesBackingArray(a, b []int) bool {
	if len(a) == 0 || len(b) == 0 {
		return false
	}
	aStart := uintptr(unsafe.Pointer(&a[0]))
	aEnd := aStart + uintptr(len(a))*unsafe.Sizeof(a[0])
	bStart := uintptr(unsafe.Pointer(&b[0]))
	return bStart >= aStart && bStart < aEnd
}

func SliceInfo(s []int) (length, capacity int) {
	return len(s), cap(s)
}

func SubsliceEffect() []int {
	a := []int{1, 2, 3, 4, 5}
	b := a[1:3]
	b[0] = 99
	return a
}

func AppendBeyondCap(s []int) bool {
	if len(s) == 0 {
		return false
	}
	original := &s[0]
	s2 := append(s, 0)
	if len(s2) == 0 {
		return false
	}
	return &s2[0] == original
}`,
  hints: [
    'SharesBackingArray: compare the memory addresses of the first elements using unsafe.Pointer.',
    'SliceInfo: just return len(s) and cap(s).',
    'AppendBeyondCap: when len == cap, append allocates a new array. Compare pointers before and after.'
  ],
}

export default exercise

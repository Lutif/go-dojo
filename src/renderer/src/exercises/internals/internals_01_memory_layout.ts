import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_01_memory_layout',
  title: 'Memory Layout',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'advanced',
  order: 1,
  description: `Go stores values contiguously in memory. Understanding layout helps you write cache-friendly code:

\`\`\`
import "unsafe"

// Sizes of basic types
unsafe.Sizeof(int(0))     // 8 on 64-bit
unsafe.Sizeof(bool(false)) // 1
unsafe.Sizeof("")          // 16 (string header: ptr + len)

// Struct fields are laid out sequentially
type Example struct {
    A int64  // offset 0, size 8
    B bool   // offset 8, size 1
    // 7 bytes padding for alignment
}
// unsafe.Sizeof(Example{}) == 16
\`\`\`

Your task: predict and verify memory sizes of Go types.`,
  code: `package main

import "unsafe"

// SizeOfBool returns the size of a bool in bytes.
func SizeOfBool() uintptr {
	// TODO: Use unsafe.Sizeof
	return 0
}

// SizeOfString returns the size of a string header in bytes.
func SizeOfString() uintptr {
	// TODO
	return 0
}

// SizeOfSlice returns the size of a slice header in bytes.
func SizeOfSlice() uintptr {
	// TODO
	return 0
}

// Padded has fields ordered to cause padding.
type Padded struct {
	A bool
	B int64
	C bool
}

// Compact reorders fields to minimize padding.
type Compact struct {
	// TODO: Reorder the same fields (bool, int64, bool) to minimize size
	A bool
	B int64
	C bool
}

// SizeOfPadded returns the size of Padded.
func SizeOfPadded() uintptr {
	return unsafe.Sizeof(Padded{})
}

// SizeOfCompact returns the size of Compact.
func SizeOfCompact() uintptr {
	return unsafe.Sizeof(Compact{})
}

var _ = unsafe.Sizeof`,
  testCode: `package main

import (
	"testing"
	"unsafe"
)

func TestSizeOfBool(t *testing.T) {
	got := SizeOfBool()
	if got != 1 {
		t.Errorf("SizeOfBool() = %d, want 1", got)
	}
}

func TestSizeOfString(t *testing.T) {
	got := SizeOfString()
	want := unsafe.Sizeof("")
	if got != want {
		t.Errorf("SizeOfString() = %d, want %d", got, want)
	}
}

func TestSizeOfSlice(t *testing.T) {
	got := SizeOfSlice()
	want := unsafe.Sizeof([]byte{})
	if got != want {
		t.Errorf("SizeOfSlice() = %d, want %d", got, want)
	}
}

func TestCompactSmaller(t *testing.T) {
	padded := SizeOfPadded()
	compact := SizeOfCompact()
	if compact >= padded {
		t.Errorf("Compact (%d) should be smaller than Padded (%d)", compact, padded)
	}
}

func TestCompactSize(t *testing.T) {
	got := SizeOfCompact()
	if got != 16 {
		t.Errorf("SizeOfCompact() = %d, want 16", got)
	}
}`,
  solution: `package main

import "unsafe"

func SizeOfBool() uintptr {
	return unsafe.Sizeof(false)
}

func SizeOfString() uintptr {
	return unsafe.Sizeof("")
}

func SizeOfSlice() uintptr {
	return unsafe.Sizeof([]byte{})
}

type Padded struct {
	A bool
	B int64
	C bool
}

type Compact struct {
	B int64
	A bool
	C bool
}

func SizeOfPadded() uintptr {
	return unsafe.Sizeof(Padded{})
}

func SizeOfCompact() uintptr {
	return unsafe.Sizeof(Compact{})
}

var _ = unsafe.Sizeof`,
  hints: [
    'Use unsafe.Sizeof(value) to get the size of any type.',
    'A string header is a pointer + length (16 bytes on 64-bit). A slice header adds capacity (24 bytes).',
    'Compact: put the int64 first, then the two bools together. This avoids padding: 8 + 1 + 1 + 6 padding = 16 vs 24.'
  ],
}

export default exercise

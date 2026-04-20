import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_09_alignment',
  title: 'Memory Alignment',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'expert',
  order: 9,
  description: `CPUs access memory most efficiently at aligned addresses. Go inserts **padding** between struct fields to maintain alignment:

\`\`\`
import "unsafe"

type Bad struct {   // 24 bytes
    a bool     // 1 byte + 7 padding
    b int64    // 8 bytes (must be 8-aligned)
    c bool     // 1 byte + 7 padding
}

type Good struct {  // 16 bytes
    b int64    // 8 bytes
    a bool     // 1 byte
    c bool     // 1 byte + 6 padding
}
\`\`\`

Use \`unsafe.Alignof()\` to check alignment and \`unsafe.Offsetof()\` for field offsets.

Your task: optimize struct layouts for minimal memory usage.`,
  code: `package main

import "unsafe"

// Unoptimized has poorly ordered fields.
type Unoptimized struct {
	A bool
	B int64
	C int32
	D bool
	E int64
}

// Optimized should contain the exact same fields as Unoptimized
// but reordered to minimize the struct size.
type Optimized struct {
	// TODO: Reorder fields to minimize padding
	A bool
	B int64
	C int32
	D bool
	E int64
}

// SizeOfUnoptimized returns the size of Unoptimized.
func SizeOfUnoptimized() uintptr {
	return unsafe.Sizeof(Unoptimized{})
}

// SizeOfOptimized returns the size of Optimized.
func SizeOfOptimized() uintptr {
	return unsafe.Sizeof(Optimized{})
}

// FieldOffset returns the offset of a field by index in Optimized.
func FieldOffset(fieldName string) uintptr {
	// TODO: Use unsafe.Offsetof for each field
	return 0
}

var _ = unsafe.Sizeof`,
  testCode: `package main

import "testing"

func TestOptimizedSmaller(t *testing.T) {
	unopt := SizeOfUnoptimized()
	opt := SizeOfOptimized()
	if opt >= unopt {
		t.Errorf("Optimized (%d) should be smaller than Unoptimized (%d)", opt, unopt)
	}
}

func TestOptimizedSize(t *testing.T) {
	got := SizeOfOptimized()
	if got != 24 {
		t.Errorf("SizeOfOptimized() = %d, want 24", got)
	}
}

func TestUnoptimizedSize(t *testing.T) {
	got := SizeOfUnoptimized()
	if got != 40 {
		t.Errorf("SizeOfUnoptimized() = %d, want 40", got)
	}
}

func TestFieldOffsetB(t *testing.T) {
	got := FieldOffset("B")
	if got != 0 {
		t.Errorf("B offset = %d, want 0 (largest field first)", got)
	}
}`,
  solution: `package main

import "unsafe"

type Unoptimized struct {
	A bool
	B int64
	C int32
	D bool
	E int64
}

type Optimized struct {
	B int64
	E int64
	C int32
	A bool
	D bool
}

func SizeOfUnoptimized() uintptr {
	return unsafe.Sizeof(Unoptimized{})
}

func SizeOfOptimized() uintptr {
	return unsafe.Sizeof(Optimized{})
}

func FieldOffset(fieldName string) uintptr {
	var o Optimized
	switch fieldName {
	case "B":
		return unsafe.Offsetof(o.B)
	case "E":
		return unsafe.Offsetof(o.E)
	case "C":
		return unsafe.Offsetof(o.C)
	case "A":
		return unsafe.Offsetof(o.A)
	case "D":
		return unsafe.Offsetof(o.D)
	}
	return 0
}

var _ = unsafe.Sizeof`,
  hints: [
    'Order fields from largest to smallest alignment: int64 (8), int32 (4), bool (1).',
    'Optimized: put both int64 fields first, then int32, then both bools together.',
    'Use unsafe.Offsetof(s.Field) to check the byte offset of each field.'
  ],
}

export default exercise

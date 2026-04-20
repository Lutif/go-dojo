import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_11_unsafe_pointer',
  title: 'Unsafe Pointer',
  category: 'Internals',
  subcategory: 'Unsafe',
  difficulty: 'expert',
  order: 11,
  description: `The \`unsafe\` package lets you bypass Go's type system for low-level memory access:

\`\`\`
import "unsafe"

// Convert between pointer types
var i int64 = 42
p := unsafe.Pointer(&i)
fp := (*float64)(p)  // reinterpret bits

// Query type layout
unsafe.Sizeof(i)     // size in bytes
unsafe.Alignof(i)    // alignment requirement
unsafe.Offsetof(s.f) // field offset in struct
\`\`\`

You can also access struct fields by computing pointer offsets:

\`\`\`
type Point struct { X, Y int }
pt := Point{10, 20}
yPtr := (*int)(unsafe.Pointer(
    uintptr(unsafe.Pointer(&pt)) + unsafe.Offsetof(pt.Y),
))
fmt.Println(*yPtr) // 20
\`\`\`

**Warning**: unsafe code is not portable and can cause crashes. Use only when necessary.

Your task: write functions that use unsafe.Pointer for type punning and struct field access.`,
  code: `package main

import "unsafe"

// IntToFloat64Bits reinterprets an int64's memory as float64.
// This is type punning — the raw bits are the same, just interpreted differently.
func IntToFloat64Bits(i int64) float64 {
	// TODO: Use unsafe.Pointer to convert *int64 to *float64
	// and return the dereferenced value
	_ = unsafe.Pointer(nil)
	return 0.0
}

// Float64ToIntBits reinterprets a float64's memory as int64.
func Float64ToIntBits(f float64) int64 {
	// TODO: Use unsafe.Pointer to convert *float64 to *int64
	_ = unsafe.Pointer(nil)
	return 0
}

// Pair is a struct with two int fields.
type Pair struct {
	First  int
	Second int
}

// GetSecondViaOffset reads the Second field of a Pair using pointer arithmetic.
func GetSecondViaOffset(p *Pair) int {
	// TODO: Use unsafe.Pointer and unsafe.Offsetof to compute
	// a pointer to p.Second and dereference it
	_ = unsafe.Pointer(nil)
	return 0
}

// SetFirstViaPointer sets the First field of a Pair using unsafe.Pointer.
func SetFirstViaPointer(p *Pair, val int) {
	// TODO: Use unsafe.Pointer to get a pointer to p.First and set it
	_ = unsafe.Pointer(nil)
}

// SizeOfPair returns the size of a Pair struct in bytes.
func SizeOfPair() uintptr {
	// TODO: Use unsafe.Sizeof to return the size of Pair
	return 0
}`,
  testCode: `package main

import (
	"math"
	"testing"
	"unsafe"
)

func TestIntToFloat64Bits(t *testing.T) {
	// The int64 representation of 1.0 in IEEE 754
	bits := int64(4607182418800017408) // math.Float64bits(1.0) as int64
	got := IntToFloat64Bits(bits)
	if got != 1.0 {
		t.Errorf("IntToFloat64Bits(%d) = %f, want 1.0", bits, got)
	}
}

func TestFloat64ToIntBits(t *testing.T) {
	f := 1.0
	got := Float64ToIntBits(f)
	want := int64(math.Float64bits(1.0))
	if got != want {
		t.Errorf("Float64ToIntBits(%f) = %d, want %d", f, got, want)
	}
}

func TestGetSecondViaOffset(t *testing.T) {
	p := &Pair{First: 10, Second: 20}
	got := GetSecondViaOffset(p)
	if got != 20 {
		t.Errorf("GetSecondViaOffset got %d, want 20", got)
	}
}

func TestSetFirstViaPointer(t *testing.T) {
	p := &Pair{First: 0, Second: 5}
	SetFirstViaPointer(p, 99)
	if p.First != 99 {
		t.Errorf("after SetFirstViaPointer, First = %d, want 99", p.First)
	}
	if p.Second != 5 {
		t.Errorf("SetFirstViaPointer should not change Second, got %d", p.Second)
	}
}

func TestSizeOfPair(t *testing.T) {
	want := unsafe.Sizeof(Pair{})
	got := SizeOfPair()
	if got != want {
		t.Errorf("SizeOfPair() = %d, want %d", got, want)
	}
}`,
  solution: `package main

import "unsafe"

func IntToFloat64Bits(i int64) float64 {
	return *(*float64)(unsafe.Pointer(&i))
}

func Float64ToIntBits(f float64) int64 {
	return *(*int64)(unsafe.Pointer(&f))
}

type Pair struct {
	First  int
	Second int
}

func GetSecondViaOffset(p *Pair) int {
	ptr := unsafe.Pointer(uintptr(unsafe.Pointer(p)) + unsafe.Offsetof(p.Second))
	return *(*int)(ptr)
}

func SetFirstViaPointer(p *Pair, val int) {
	ptr := (*int)(unsafe.Pointer(p))
	*ptr = val
}

func SizeOfPair() uintptr {
	return unsafe.Sizeof(Pair{})
}`,
  hints: [
    'To type-pun: *(*TargetType)(unsafe.Pointer(&source)) reinterprets the bits.',
    'unsafe.Offsetof(p.Second) gives the byte offset of Second within Pair.',
    'The First field is at offset 0, so unsafe.Pointer(p) points directly to First.',
  ],
}

export default exercise

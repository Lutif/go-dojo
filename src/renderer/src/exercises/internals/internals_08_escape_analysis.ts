import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_08_escape_analysis',
  title: 'Escape Analysis',
  category: 'Internals',
  subcategory: 'Compiler',
  difficulty: 'expert',
  order: 8,
  description: `The Go compiler decides whether to allocate on the **stack** or **heap**:

- **Stack**: fast, automatic cleanup when function returns
- **Heap**: slower, requires garbage collection

A variable "escapes" to the heap when it's referenced after the function returns:

\`\`\`
func noEscape() int {
    x := 42      // stays on stack
    return x      // value is copied
}

func escapes() *int {
    x := 42      // escapes to heap!
    return &x     // pointer outlives function
}
\`\`\`

Check with: \`go build -gcflags="-m" .\`

Your task: write functions that demonstrate stack vs heap allocation.`,
  code: `package main

// StackOnly returns a value. The local variable should stay on the stack.
func StackOnly() int {
	// TODO: Create a local int, return its value (not a pointer)
	return 0
}

// HeapEscape returns a pointer. The local variable escapes to the heap.
func HeapEscape() *int {
	// TODO: Create a local int, return its address
	return nil
}

// SliceEscape creates a slice and returns it.
// The backing array escapes to the heap.
func SliceEscape() []int {
	// TODO: Create and return a slice
	return nil
}

// NoEscapeSlice creates a slice but uses it locally.
// The compiler may keep it on the stack.
func NoEscapeSlice() int {
	// TODO: Create a small slice, sum it, return the sum
	return 0
}

// ClosureEscape returns a closure that captures a local variable.
// The captured variable escapes to the heap.
func ClosureEscape() func() int {
	// TODO: Create a counter, return closure that increments and returns it
	return nil
}`,
  testCode: `package main

import "testing"

func TestStackOnly(t *testing.T) {
	got := StackOnly()
	if got != 42 {
		t.Errorf("got %d, want 42", got)
	}
}

func TestHeapEscape(t *testing.T) {
	p := HeapEscape()
	if p == nil || *p != 42 {
		t.Errorf("got %v", p)
	}
}

func TestSliceEscape(t *testing.T) {
	s := SliceEscape()
	if len(s) != 3 || s[0] != 1 || s[1] != 2 || s[2] != 3 {
		t.Errorf("got %v", s)
	}
}

func TestNoEscapeSlice(t *testing.T) {
	got := NoEscapeSlice()
	if got != 6 {
		t.Errorf("got %d, want 6", got)
	}
}

func TestClosureEscape(t *testing.T) {
	fn := ClosureEscape()
	if fn() != 1 {
		t.Error("first call should return 1")
	}
	if fn() != 2 {
		t.Error("second call should return 2")
	}
}`,
  solution: `package main

func StackOnly() int {
	x := 42
	return x
}

func HeapEscape() *int {
	x := 42
	return &x
}

func SliceEscape() []int {
	return []int{1, 2, 3}
}

func NoEscapeSlice() int {
	s := []int{1, 2, 3}
	sum := 0
	for _, v := range s {
		sum += v
	}
	return sum
}

func ClosureEscape() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}`,
  hints: [
    'StackOnly: x := 42; return x — value is copied, x stays on stack.',
    'HeapEscape: x := 42; return &x — pointer outlives the function, x escapes.',
    'ClosureEscape: the closure captures count by reference, so count escapes to the heap.'
  ],
}

export default exercise

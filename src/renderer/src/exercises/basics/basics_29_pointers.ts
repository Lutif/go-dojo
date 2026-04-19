import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_29_pointers',
  title: 'Pointers',
  category: 'Basics',
  subcategory: 'Structs & Pointers',
  difficulty: 'beginner',
  order: 29,
  description: `A pointer holds the memory address of a value. Two key operators:
- \`&x\` — get the address of x (creates a pointer)
- \`*p\` — dereference p (read/write the value at the address)

\`\`\`
x := 42
p := &x     // p is *int, points to x
*p = 100    // changes x to 100
fmt.Println(x)  // 100
\`\`\`

Pointers let functions modify values in the caller's scope (pass-by-reference).

Your task: use pointers to modify values.`,
  code: `package main

// Double takes a pointer to an int and doubles the value it points to.
func Double(p *int) {
	// TODO: Modify the value at the pointer
}

// SwapValues swaps the values that two pointers point to.
func SwapValues(a, b *int) {
	// TODO: Swap *a and *b
}

// NewInt returns a pointer to a new int with the given value.
// This is a common pattern for creating pointers to literals.
func NewInt(val int) *int {
	// TODO: Return a pointer to val
	return nil
}`,
  testCode: `package main

import "testing"

func TestDouble(t *testing.T) {
	x := 21
	Double(&x)
	if x != 42 {
		t.Errorf("after Double(&x), x = %d, want 42", x)
	}
	y := 0
	Double(&y)
	if y != 0 {
		t.Errorf("after Double(&0), y = %d, want 0", y)
	}
}

func TestSwapValues(t *testing.T) {
	a, b := 1, 2
	SwapValues(&a, &b)
	if a != 2 || b != 1 {
		t.Errorf("after SwapValues, a=%d b=%d, want a=2 b=1", a, b)
	}
}

func TestNewInt(t *testing.T) {
	p := NewInt(42)
	if p == nil {
		t.Fatal("NewInt returned nil")
	}
	if *p != 42 {
		t.Errorf("*NewInt(42) = %d, want 42", *p)
	}
}`,
  solution: `package main

func Double(p *int) {
	*p = *p * 2
}

func SwapValues(a, b *int) {
	*a, *b = *b, *a
}

func NewInt(val int) *int {
	return &val
}`,
  hints: [
    'Use *p to read or write the value at a pointer: *p = *p * 2 doubles it.',
    'Go supports multiple assignment: *a, *b = *b, *a swaps in one line.',
    'Return &val to return a pointer — Go is smart enough to move val to the heap so the pointer stays valid.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_12_generic_types',
  title: 'Generic Types',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'intermediate',
  order: 12,
  description: `Structs can also have type parameters, creating reusable data structures:

\`\`\`
type Pair[T any] struct {
    First, Second T
}

p := Pair[int]{First: 1, Second: 2}
\`\`\`

Methods on generic types repeat the type parameter:
\`\`\`
func (p Pair[T]) Swap() Pair[T] {
    return Pair[T]{First: p.Second, Second: p.First}
}
\`\`\`

Your task: build generic container types.`,
  code: `package main

// Stack is a generic LIFO stack.
type Stack[T any] struct {
	items []T
}

// TODO: Add Push(val T) method
// TODO: Add Pop() (T, bool) method — returns value and ok
// TODO: Add Peek() (T, bool) method — returns top without removing
// TODO: Add Len() int method

// Pair holds two values of potentially different types.
type Pair[T any, U any] struct {
	First  T
	Second U
}

// TODO: Add a Swap() method that returns Pair[U, T]
// (note the types are reversed)`,
  testCode: `package main

import "testing"

func TestStackPushPop(t *testing.T) {
	var s Stack[int]
	s.Push(10)
	s.Push(20)
	s.Push(30)
	val, ok := s.Pop()
	if !ok || val != 30 {
		t.Errorf("Pop = (%d, %v), want (30, true)", val, ok)
	}
	val2, ok2 := s.Pop()
	if !ok2 || val2 != 20 {
		t.Errorf("Pop = (%d, %v), want (20, true)", val2, ok2)
	}
}

func TestStackEmpty(t *testing.T) {
	var s Stack[string]
	_, ok := s.Pop()
	if ok {
		t.Error("Pop on empty should return false")
	}
}

func TestStackPeek(t *testing.T) {
	var s Stack[int]
	s.Push(42)
	val, ok := s.Peek()
	if !ok || val != 42 {
		t.Errorf("Peek = (%d, %v), want (42, true)", val, ok)
	}
	if s.Len() != 1 {
		t.Errorf("Peek should not remove element, Len = %d", s.Len())
	}
}

func TestStackLen(t *testing.T) {
	var s Stack[float64]
	if s.Len() != 0 {
		t.Errorf("empty stack Len = %d", s.Len())
	}
	s.Push(1.1)
	s.Push(2.2)
	if s.Len() != 2 {
		t.Errorf("Len = %d, want 2", s.Len())
	}
}

func TestStackString(t *testing.T) {
	var s Stack[string]
	s.Push("hello")
	s.Push("world")
	val, _ := s.Pop()
	if val != "world" {
		t.Errorf("Pop = %q, want world", val)
	}
}

func TestPairSwap(t *testing.T) {
	p := Pair[string, int]{First: "age", Second: 30}
	swapped := p.Swap()
	if swapped.First != 30 {
		t.Errorf("swapped.First = %v, want 30", swapped.First)
	}
	if swapped.Second != "age" {
		t.Errorf("swapped.Second = %v, want age", swapped.Second)
	}
}`,
  solution: `package main

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(val T) {
	s.items = append(s.items, val)
}

func (s *Stack[T]) Pop() (T, bool) {
	var zero T
	if len(s.items) == 0 {
		return zero, false
	}
	val := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return val, true
}

func (s *Stack[T]) Peek() (T, bool) {
	var zero T
	if len(s.items) == 0 {
		return zero, false
	}
	return s.items[len(s.items)-1], true
}

func (s *Stack[T]) Len() int {
	return len(s.items)
}

type Pair[T any, U any] struct {
	First  T
	Second U
}

func (p Pair[T, U]) Swap() Pair[U, T] {
	return Pair[U, T]{First: p.Second, Second: p.First}
}`,
  hints: [
    'Methods on generic types: func (s *Stack[T]) Push(val T) { ... }',
    'For Pop returning a zero value: var zero T gives you the zero value for any type T.',
    'Pair.Swap returns Pair[U, T] (reversed): func (p Pair[T, U]) Swap() Pair[U, T] { ... }'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_14_iterator',
  title: 'Iterator Pattern',
  category: 'Patterns',
  subcategory: 'Behavioral Patterns',
  difficulty: 'intermediate',
  order: 14,
  description: `Implement the iterator pattern for traversing collections without exposing their internal structure.

In Go, iterators can be implemented with a struct that tracks position, exposing \`HasNext()\` and \`Next()\` methods. This is useful for trees, filtered views, or any custom collection.

Your tasks:

1. Create a \`SliceIterator[T]\` generic struct that wraps a slice and tracks the current index.

2. Implement \`NewSliceIterator[T](items []T) *SliceIterator[T]\` to create an iterator.

3. Implement \`HasNext() bool\` that returns true if more elements remain.

4. Implement \`Next() (T, bool)\` that returns the next element and true, or zero value and false if exhausted.

5. Implement \`RangeIterator\` (non-generic) that iterates over a range of integers from \`start\` (inclusive) to \`end\` (exclusive), with \`HasNext()\` and \`Next() (int, bool)\`.`,
  code: `package main

// TODO: Define SliceIterator[T] struct with items []T and index int

// TODO: Implement NewSliceIterator[T](items []T) *SliceIterator[T]

// TODO: Implement (it *SliceIterator[T]) HasNext() bool

// TODO: Implement (it *SliceIterator[T]) Next() (T, bool)

// TODO: Define RangeIterator struct with start, end, current int

// TODO: Implement NewRangeIterator(start, end int) *RangeIterator

// TODO: Implement (it *RangeIterator) HasNext() bool

// TODO: Implement (it *RangeIterator) Next() (int, bool)

func main() {}`,
  testCode: `package main

import "testing"

func TestSliceIterator(t *testing.T) {
	items := []string{"a", "b", "c"}
	it := NewSliceIterator(items)

	var result []string
	for it.HasNext() {
		val, ok := it.Next()
		if !ok {
			t.Fatal("Next() returned false while HasNext() was true")
		}
		result = append(result, val)
	}
	if len(result) != 3 {
		t.Fatalf("expected 3 items, got %d", len(result))
	}
	if result[0] != "a" || result[1] != "b" || result[2] != "c" {
		t.Errorf("got %v, want [a b c]", result)
	}
}

func TestSliceIteratorExhausted(t *testing.T) {
	it := NewSliceIterator([]int{42})
	val, ok := it.Next()
	if !ok || val != 42 {
		t.Errorf("expected (42, true), got (%d, %v)", val, ok)
	}
	val, ok = it.Next()
	if ok {
		t.Errorf("expected ok=false after exhaustion, got (%d, %v)", val, ok)
	}
	if it.HasNext() {
		t.Error("HasNext() should be false after exhaustion")
	}
}

func TestSliceIteratorEmpty(t *testing.T) {
	it := NewSliceIterator([]int{})
	if it.HasNext() {
		t.Error("empty iterator should not have next")
	}
	_, ok := it.Next()
	if ok {
		t.Error("Next() on empty iterator should return false")
	}
}

func TestRangeIterator(t *testing.T) {
	it := NewRangeIterator(1, 5)
	var result []int
	for it.HasNext() {
		val, ok := it.Next()
		if !ok {
			t.Fatal("Next() returned false while HasNext() was true")
		}
		result = append(result, val)
	}
	expected := []int{1, 2, 3, 4}
	if len(result) != len(expected) {
		t.Fatalf("expected %d items, got %d", len(expected), len(result))
	}
	for i, v := range expected {
		if result[i] != v {
			t.Errorf("index %d: got %d, want %d", i, result[i], v)
		}
	}
}

func TestRangeIteratorEmpty(t *testing.T) {
	it := NewRangeIterator(5, 5)
	if it.HasNext() {
		t.Error("range [5,5) should be empty")
	}
}`,
  solution: `package main

type SliceIterator[T any] struct {
	items []T
	index int
}

func NewSliceIterator[T any](items []T) *SliceIterator[T] {
	return &SliceIterator[T]{items: items, index: 0}
}

func (it *SliceIterator[T]) HasNext() bool {
	return it.index < len(it.items)
}

func (it *SliceIterator[T]) Next() (T, bool) {
	if it.index >= len(it.items) {
		var zero T
		return zero, false
	}
	val := it.items[it.index]
	it.index++
	return val, true
}

type RangeIterator struct {
	start   int
	end     int
	current int
}

func NewRangeIterator(start, end int) *RangeIterator {
	return &RangeIterator{start: start, end: end, current: start}
}

func (it *RangeIterator) HasNext() bool {
	return it.current < it.end
}

func (it *RangeIterator) Next() (int, bool) {
	if it.current >= it.end {
		return 0, false
	}
	val := it.current
	it.current++
	return val, true
}

func main() {}`,
  hints: [
    'SliceIterator[T] needs an items field and an index field to track position.',
    'HasNext() checks if index < len(items). Next() returns items[index] and increments index.',
    'RangeIterator tracks current, start, and end. Next() returns current and increments it.',
  ],
}

export default exercise

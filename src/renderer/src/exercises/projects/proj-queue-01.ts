import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-01',
  title: 'Message Queue — Basic FIFO Queue',
  category: 'Projects',
  subcategory: 'Message Queue',
  difficulty: 'intermediate',
  order: 22,
  description: `Build a basic FIFO (First-In, First-Out) queue data structure.

Implement a Queue struct with these methods:
- Push(item string): add an item to the back of the queue
- Pop() (string, bool): remove and return the front item (returns false if empty)
- Len() int: return the number of items in the queue
- Peek() (string, bool): return the front item without removing it (returns false if empty)

The queue should handle edge cases like popping from an empty queue gracefully.`,
  code: `package main

// TODO: Define a Queue struct that holds items internally.

// TODO: Implement Push(item string) to add an item to the back.

// TODO: Implement Pop() (string, bool) to remove and return the front item.

// TODO: Implement Len() int to return the current queue size.

// TODO: Implement Peek() (string, bool) to return the front item without removing it.

func main() {}
`,
  testCode: `package main

import "testing"

func TestQueuePushAndPop(t *testing.T) {
	q := &Queue{}
	q.Push("a")
	q.Push("b")
	q.Push("c")

	val, ok := q.Pop()
	if !ok || val != "a" {
		t.Fatalf("expected (a, true), got (%s, %v)", val, ok)
	}
	val, ok = q.Pop()
	if !ok || val != "b" {
		t.Fatalf("expected (b, true), got (%s, %v)", val, ok)
	}
	val, ok = q.Pop()
	if !ok || val != "c" {
		t.Fatalf("expected (c, true), got (%s, %v)", val, ok)
	}
}

func TestQueuePopEmpty(t *testing.T) {
	q := &Queue{}
	_, ok := q.Pop()
	if ok {
		t.Fatal("expected Pop on empty queue to return false")
	}
}

func TestQueueLen(t *testing.T) {
	q := &Queue{}
	if q.Len() != 0 {
		t.Fatalf("expected Len 0, got %d", q.Len())
	}
	q.Push("x")
	q.Push("y")
	if q.Len() != 2 {
		t.Fatalf("expected Len 2, got %d", q.Len())
	}
	q.Pop()
	if q.Len() != 1 {
		t.Fatalf("expected Len 1, got %d", q.Len())
	}
}

func TestQueuePeek(t *testing.T) {
	q := &Queue{}
	_, ok := q.Peek()
	if ok {
		t.Fatal("expected Peek on empty queue to return false")
	}
	q.Push("first")
	q.Push("second")
	val, ok := q.Peek()
	if !ok || val != "first" {
		t.Fatalf("expected (first, true), got (%s, %v)", val, ok)
	}
	if q.Len() != 2 {
		t.Fatal("Peek should not remove items")
	}
}

func TestQueueFIFOOrder(t *testing.T) {
	q := &Queue{}
	items := []string{"one", "two", "three", "four", "five"}
	for _, item := range items {
		q.Push(item)
	}
	for _, expected := range items {
		val, ok := q.Pop()
		if !ok || val != expected {
			t.Fatalf("expected (%s, true), got (%s, %v)", expected, val, ok)
		}
	}
}
`,
  solution: `package main

type Queue struct {
	items []string
}

func (q *Queue) Push(item string) {
	q.items = append(q.items, item)
}

func (q *Queue) Pop() (string, bool) {
	if len(q.items) == 0 {
		return "", false
	}
	item := q.items[0]
	q.items = q.items[1:]
	return item, true
}

func (q *Queue) Len() int {
	return len(q.items)
}

func (q *Queue) Peek() (string, bool) {
	if len(q.items) == 0 {
		return "", false
	}
	return q.items[0], true
}

func main() {}
`,
  hints: [
    'Use a string slice to store items internally.',
    'Push appends to the end of the slice.',
    'Pop removes from the front: item = items[0], items = items[1:].',
    'Always check length before accessing items[0] to avoid panics.',
  ],
  projectId: 'proj-queue',
  step: 1,
  totalSteps: 6,
}

export default exercise

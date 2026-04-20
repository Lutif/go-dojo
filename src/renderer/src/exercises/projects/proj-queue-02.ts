import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-02',
  title: 'Message Queue — Priority Queue',
  category: 'Projects',
  subcategory: 'Message Queue',
  difficulty: 'intermediate',
  order: 23,
  description: `Extend the queue system with priority support. Items with higher priority values are dequeued first. Items with the same priority follow FIFO order.

Implement a PriorityQueue struct with:
- Push(item string, priority int): add an item with a priority
- Pop() (string, bool): remove and return the highest-priority item
- Len() int: return the number of items

Keep the basic Queue from the previous step as well.`,
  code: `package main

// --- Basic Queue from Step 1 ---

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

// --- Priority Queue ---

// TODO: Define a PriorityItem struct with Value string and Priority int.

// TODO: Define a PriorityQueue struct that holds priority items.

// TODO: Implement Push(item string, priority int).

// TODO: Implement Pop() (string, bool) — return highest priority item first.

// TODO: Implement Len() int.

func main() {}
`,
  testCode: `package main

import "testing"

func TestBasicQueueStillWorks(t *testing.T) {
	q := &Queue{}
	q.Push("a")
	q.Push("b")
	val, ok := q.Pop()
	if !ok || val != "a" {
		t.Fatalf("basic queue broken: expected (a, true), got (%s, %v)", val, ok)
	}
}

func TestPriorityQueueHighestFirst(t *testing.T) {
	pq := &PriorityQueue{}
	pq.Push("low", 1)
	pq.Push("high", 10)
	pq.Push("medium", 5)

	val, ok := pq.Pop()
	if !ok || val != "high" {
		t.Fatalf("expected (high, true), got (%s, %v)", val, ok)
	}
	val, ok = pq.Pop()
	if !ok || val != "medium" {
		t.Fatalf("expected (medium, true), got (%s, %v)", val, ok)
	}
	val, ok = pq.Pop()
	if !ok || val != "low" {
		t.Fatalf("expected (low, true), got (%s, %v)", val, ok)
	}
}

func TestPriorityQueueSamePriorityFIFO(t *testing.T) {
	pq := &PriorityQueue{}
	pq.Push("first", 5)
	pq.Push("second", 5)
	pq.Push("third", 5)

	val, _ := pq.Pop()
	if val != "first" {
		t.Fatalf("same priority should be FIFO: expected first, got %s", val)
	}
	val, _ = pq.Pop()
	if val != "second" {
		t.Fatalf("same priority should be FIFO: expected second, got %s", val)
	}
}

func TestPriorityQueuePopEmpty(t *testing.T) {
	pq := &PriorityQueue{}
	_, ok := pq.Pop()
	if ok {
		t.Fatal("expected Pop on empty priority queue to return false")
	}
}

func TestPriorityQueueLen(t *testing.T) {
	pq := &PriorityQueue{}
	if pq.Len() != 0 {
		t.Fatalf("expected Len 0, got %d", pq.Len())
	}
	pq.Push("a", 1)
	pq.Push("b", 2)
	if pq.Len() != 2 {
		t.Fatalf("expected Len 2, got %d", pq.Len())
	}
	pq.Pop()
	if pq.Len() != 1 {
		t.Fatalf("expected Len 1, got %d", pq.Len())
	}
}
`,
  solution: `package main

// --- Basic Queue from Step 1 ---

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

// --- Priority Queue ---

type PriorityItem struct {
	Value    string
	Priority int
	order    int
}

type PriorityQueue struct {
	items []PriorityItem
	seq   int
}

func (pq *PriorityQueue) Push(item string, priority int) {
	pq.items = append(pq.items, PriorityItem{Value: item, Priority: priority, order: pq.seq})
	pq.seq++
}

func (pq *PriorityQueue) Pop() (string, bool) {
	if len(pq.items) == 0 {
		return "", false
	}
	best := 0
	for i := 1; i < len(pq.items); i++ {
		if pq.items[i].Priority > pq.items[best].Priority {
			best = i
		} else if pq.items[i].Priority == pq.items[best].Priority && pq.items[i].order < pq.items[best].order {
			best = i
		}
	}
	val := pq.items[best].Value
	pq.items = append(pq.items[:best], pq.items[best+1:]...)
	return val, true
}

func (pq *PriorityQueue) Len() int {
	return len(pq.items)
}

func main() {}
`,
  hints: [
    'Create a PriorityItem struct with Value, Priority, and an internal insertion order field.',
    'To find the highest-priority item, scan the slice for the maximum priority.',
    'Break ties using the insertion order to preserve FIFO for same-priority items.',
    'Remove the found item by slicing around its index.',
  ],
  projectId: 'proj-queue',
  step: 2,
  totalSteps: 6,
}

export default exercise

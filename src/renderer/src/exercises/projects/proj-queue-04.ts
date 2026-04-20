import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-04',
  title: 'Message Queue — Message Acknowledgment',
  category: 'Projects',
  subcategory: 'Message Queue',
  difficulty: 'advanced',
  order: 25,
  description: `Add message acknowledgment to the queue system. Messages remain "in-flight" until the consumer explicitly acknowledges them. If not acknowledged, they can be requeued.

Implement an AckQueue struct with:
- Push(msg string): add a message
- Receive() (msgID string, msg string, ok bool): get the next message and mark it in-flight; returns a unique msgID
- Ack(msgID string) bool: acknowledge successful processing; returns false if msgID not found
- Nack(msgID string) bool: negatively acknowledge; returns the message to the queue for redelivery
- InFlight() int: return count of messages currently in-flight (received but not ack'd/nack'd)`,
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

// --- Priority Queue from Step 2 ---

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

// --- Pub/Sub from Step 3 ---

type Subscriber struct {
	messages []string
}

func (s *Subscriber) Messages() []string {
	return s.messages
}

type Broker struct {
	topics map[string][]*Subscriber
}

func NewBroker() *Broker {
	return &Broker{topics: make(map[string][]*Subscriber)}
}

func (b *Broker) Subscribe(topic string) *Subscriber {
	sub := &Subscriber{}
	b.topics[topic] = append(b.topics[topic], sub)
	return sub
}

func (b *Broker) Publish(topic string, msg string) {
	for _, sub := range b.topics[topic] {
		sub.messages = append(sub.messages, msg)
	}
}

// --- Ack Queue ---

// TODO: Define an AckQueue struct with a pending queue, in-flight map, and ID counter.

// TODO: Implement Push(msg string).

// TODO: Implement Receive() (msgID string, msg string, ok bool).

// TODO: Implement Ack(msgID string) bool.

// TODO: Implement Nack(msgID string) bool — return message to front of queue.

// TODO: Implement InFlight() int.

func main() {}
`,
  testCode: `package main

import "testing"

func TestAckQueueReceiveAndAck(t *testing.T) {
	aq := NewAckQueue()
	aq.Push("task1")
	aq.Push("task2")

	id1, msg1, ok := aq.Receive()
	if !ok || msg1 != "task1" {
		t.Fatalf("expected (_, task1, true), got (%s, %s, %v)", id1, msg1, ok)
	}
	if aq.InFlight() != 1 {
		t.Fatalf("expected 1 in-flight, got %d", aq.InFlight())
	}

	if !aq.Ack(id1) {
		t.Fatal("Ack should return true for valid msgID")
	}
	if aq.InFlight() != 0 {
		t.Fatalf("expected 0 in-flight after ack, got %d", aq.InFlight())
	}
}

func TestAckQueueNack(t *testing.T) {
	aq := NewAckQueue()
	aq.Push("retry-me")

	id, msg, ok := aq.Receive()
	if !ok || msg != "retry-me" {
		t.Fatalf("expected retry-me, got %s", msg)
	}

	if !aq.Nack(id) {
		t.Fatal("Nack should return true for valid msgID")
	}
	if aq.InFlight() != 0 {
		t.Fatal("in-flight should be 0 after nack")
	}

	// Message should be available again
	_, msg2, ok2 := aq.Receive()
	if !ok2 || msg2 != "retry-me" {
		t.Fatalf("expected nack'd message to be redelivered, got (%s, %v)", msg2, ok2)
	}
}

func TestAckQueueReceiveEmpty(t *testing.T) {
	aq := NewAckQueue()
	_, _, ok := aq.Receive()
	if ok {
		t.Fatal("Receive on empty queue should return false")
	}
}

func TestAckQueueAckUnknownID(t *testing.T) {
	aq := NewAckQueue()
	if aq.Ack("nonexistent") {
		t.Fatal("Ack with unknown ID should return false")
	}
	if aq.Nack("nonexistent") {
		t.Fatal("Nack with unknown ID should return false")
	}
}

func TestAckQueueMultipleInFlight(t *testing.T) {
	aq := NewAckQueue()
	aq.Push("a")
	aq.Push("b")
	aq.Push("c")

	id1, _, _ := aq.Receive()
	id2, _, _ := aq.Receive()
	_, _, _ = aq.Receive()

	if aq.InFlight() != 3 {
		t.Fatalf("expected 3 in-flight, got %d", aq.InFlight())
	}

	aq.Ack(id1)
	aq.Nack(id2)
	if aq.InFlight() != 1 {
		t.Fatalf("expected 1 in-flight, got %d", aq.InFlight())
	}
}
`,
  solution: `package main

import "fmt"

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

// --- Priority Queue from Step 2 ---

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

// --- Pub/Sub from Step 3 ---

type Subscriber struct {
	messages []string
}

func (s *Subscriber) Messages() []string {
	return s.messages
}

type Broker struct {
	topics map[string][]*Subscriber
}

func NewBroker() *Broker {
	return &Broker{topics: make(map[string][]*Subscriber)}
}

func (b *Broker) Subscribe(topic string) *Subscriber {
	sub := &Subscriber{}
	b.topics[topic] = append(b.topics[topic], sub)
	return sub
}

func (b *Broker) Publish(topic string, msg string) {
	for _, sub := range b.topics[topic] {
		sub.messages = append(sub.messages, msg)
	}
}

// --- Ack Queue ---

type AckQueue struct {
	pending  []string
	inflight map[string]string
	counter  int
}

func NewAckQueue() *AckQueue {
	return &AckQueue{
		inflight: make(map[string]string),
	}
}

func (aq *AckQueue) Push(msg string) {
	aq.pending = append(aq.pending, msg)
}

func (aq *AckQueue) Receive() (string, string, bool) {
	if len(aq.pending) == 0 {
		return "", "", false
	}
	msg := aq.pending[0]
	aq.pending = aq.pending[1:]
	aq.counter++
	id := fmt.Sprintf("msg-%d", aq.counter)
	aq.inflight[id] = msg
	return id, msg, true
}

func (aq *AckQueue) Ack(msgID string) bool {
	if _, ok := aq.inflight[msgID]; !ok {
		return false
	}
	delete(aq.inflight, msgID)
	return true
}

func (aq *AckQueue) Nack(msgID string) bool {
	msg, ok := aq.inflight[msgID]
	if !ok {
		return false
	}
	delete(aq.inflight, msgID)
	aq.pending = append([]string{msg}, aq.pending...)
	return true
}

func (aq *AckQueue) InFlight() int {
	return len(aq.inflight)
}

func main() {}
`,
  hints: [
    'Use a map[string]string to track in-flight messages by their ID.',
    'Generate unique IDs with a counter: fmt.Sprintf("msg-%d", counter).',
    'Nack should prepend the message back to the pending slice for redelivery.',
    'Ack simply deletes the message from the in-flight map.',
  ],
  projectId: 'proj-queue',
  step: 4,
  totalSteps: 6,
}

export default exercise

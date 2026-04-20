import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-05',
  title: 'Message Queue — Dead Letter Queue',
  category: 'Projects',
  subcategory: 'Message Queue',
  difficulty: 'advanced',
  order: 26,
  description: `Add a dead letter queue (DLQ) for messages that fail repeatedly. When a message is Nack'd more times than the maximum retry count, it moves to the DLQ instead of being requeued.

Implement a DLQQueue struct with:
- NewDLQQueue(maxRetries int) *DLQQueue: create a queue with a retry limit
- Push(msg string): add a message
- Receive() (msgID string, msg string, ok bool): get the next message
- Ack(msgID string) bool: acknowledge success
- Nack(msgID string) bool: negative ack; requeue if retries remain, otherwise move to DLQ
- DeadLetters() []string: return all messages in the DLQ
- InFlight() int: count of in-flight messages`,
  code: `package main

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

// --- Ack Queue from Step 4 ---

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

// --- Dead Letter Queue ---

// TODO: Define a dlqEntry struct to track message content and retry count.

// TODO: Define a DLQQueue struct with pending entries, in-flight map, dead letters, max retries, and counter.

// TODO: Implement NewDLQQueue(maxRetries int) *DLQQueue.

// TODO: Implement Push(msg string).

// TODO: Implement Receive() (msgID string, msg string, ok bool).

// TODO: Implement Ack(msgID string) bool.

// TODO: Implement Nack(msgID string) bool — track retries, move to DLQ when exceeded.

// TODO: Implement DeadLetters() []string.

// TODO: Implement InFlight() int.

func main() {}
`,
  testCode: `package main

import "testing"

func TestDLQQueueBasicFlow(t *testing.T) {
	dq := NewDLQQueue(3)
	dq.Push("task1")

	id, msg, ok := dq.Receive()
	if !ok || msg != "task1" {
		t.Fatalf("expected task1, got %s", msg)
	}
	if !dq.Ack(id) {
		t.Fatal("Ack should succeed")
	}
	if len(dq.DeadLetters()) != 0 {
		t.Fatal("no dead letters expected after ack")
	}
}

func TestDLQQueueRetryAndDLQ(t *testing.T) {
	dq := NewDLQQueue(2) // max 2 retries
	dq.Push("fragile")

	// First delivery
	id1, msg1, _ := dq.Receive()
	if msg1 != "fragile" {
		t.Fatalf("expected fragile, got %s", msg1)
	}
	dq.Nack(id1) // retry 1

	// Second delivery
	id2, msg2, _ := dq.Receive()
	if msg2 != "fragile" {
		t.Fatalf("expected fragile on retry, got %s", msg2)
	}
	dq.Nack(id2) // retry 2

	// Third delivery
	id3, msg3, _ := dq.Receive()
	if msg3 != "fragile" {
		t.Fatalf("expected fragile on retry 2, got %s", msg3)
	}
	dq.Nack(id3) // exceeds max retries -> DLQ

	// Should now be in DLQ
	dl := dq.DeadLetters()
	if len(dl) != 1 || dl[0] != "fragile" {
		t.Fatalf("expected [fragile] in DLQ, got %v", dl)
	}

	// No more messages in main queue
	_, _, ok := dq.Receive()
	if ok {
		t.Fatal("queue should be empty after DLQ")
	}
}

func TestDLQQueueMultipleMessages(t *testing.T) {
	dq := NewDLQQueue(1) // max 1 retry
	dq.Push("ok-msg")
	dq.Push("bad-msg")

	// Process ok-msg successfully
	id1, _, _ := dq.Receive()
	dq.Ack(id1)

	// Fail bad-msg once
	id2, _, _ := dq.Receive()
	dq.Nack(id2)

	// Fail bad-msg again -> DLQ
	id3, _, _ := dq.Receive()
	dq.Nack(id3)

	dl := dq.DeadLetters()
	if len(dl) != 1 || dl[0] != "bad-msg" {
		t.Fatalf("expected [bad-msg] in DLQ, got %v", dl)
	}
}

func TestDLQQueueInFlight(t *testing.T) {
	dq := NewDLQQueue(3)
	dq.Push("a")
	dq.Push("b")

	dq.Receive()
	dq.Receive()
	if dq.InFlight() != 2 {
		t.Fatalf("expected 2 in-flight, got %d", dq.InFlight())
	}
}

func TestDLQQueueZeroRetries(t *testing.T) {
	dq := NewDLQQueue(0) // no retries allowed
	dq.Push("instant-dlq")

	id, _, _ := dq.Receive()
	dq.Nack(id) // immediately goes to DLQ

	dl := dq.DeadLetters()
	if len(dl) != 1 || dl[0] != "instant-dlq" {
		t.Fatalf("expected [instant-dlq] in DLQ, got %v", dl)
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

// --- Ack Queue from Step 4 ---

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

// --- Dead Letter Queue ---

type dlqEntry struct {
	msg     string
	retries int
}

type DLQQueue struct {
	pending    []dlqEntry
	inflight   map[string]dlqEntry
	deadLetters []string
	maxRetries int
	counter    int
}

func NewDLQQueue(maxRetries int) *DLQQueue {
	return &DLQQueue{
		inflight:   make(map[string]dlqEntry),
		maxRetries: maxRetries,
	}
}

func (dq *DLQQueue) Push(msg string) {
	dq.pending = append(dq.pending, dlqEntry{msg: msg, retries: 0})
}

func (dq *DLQQueue) Receive() (string, string, bool) {
	if len(dq.pending) == 0 {
		return "", "", false
	}
	entry := dq.pending[0]
	dq.pending = dq.pending[1:]
	dq.counter++
	id := fmt.Sprintf("dlq-%d", dq.counter)
	dq.inflight[id] = entry
	return id, entry.msg, true
}

func (dq *DLQQueue) Ack(msgID string) bool {
	if _, ok := dq.inflight[msgID]; !ok {
		return false
	}
	delete(dq.inflight, msgID)
	return true
}

func (dq *DLQQueue) Nack(msgID string) bool {
	entry, ok := dq.inflight[msgID]
	if !ok {
		return false
	}
	delete(dq.inflight, msgID)
	entry.retries++
	if entry.retries > dq.maxRetries {
		dq.deadLetters = append(dq.deadLetters, entry.msg)
	} else {
		dq.pending = append([]dlqEntry{entry}, dq.pending...)
	}
	return true
}

func (dq *DLQQueue) DeadLetters() []string {
	return dq.deadLetters
}

func (dq *DLQQueue) InFlight() int {
	return len(dq.inflight)
}

func main() {}
`,
  hints: [
    'Track retry count per message using an internal struct (e.g., dlqEntry{msg, retries}).',
    'On Nack, increment retries. If retries > maxRetries, append to deadLetters slice.',
    'The in-flight map should store dlqEntry values so retry count persists across deliveries.',
    'DeadLetters() simply returns the accumulated dead letter slice.',
  ],
  projectId: 'proj-queue',
  step: 5,
  totalSteps: 6,
}

export default exercise

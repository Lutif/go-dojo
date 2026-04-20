import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-06',
  title: 'Message Queue — Persistent Queue (WAL)',
  category: 'Projects',
  subcategory: 'Message Queue',
  difficulty: 'expert',
  order: 27,
  description: `Add durability to the queue with a Write-Ahead Log (WAL). Every Push and Ack is recorded to an append-only log file. On recovery, the log is replayed to reconstruct queue state.

Implement a PersistentQueue struct with:
- NewPersistentQueue(path string) (*PersistentQueue, error): create or recover a queue from the log file
- Push(msg string) error: append a PUSH record and enqueue
- Pop() (string, bool): dequeue the front item and append a POP record
- Len() int: return current queue size
- Close() error: close the log file

The log format is line-based: each line is either "PUSH:<message>" or "POP".
On recovery, replay the log to rebuild the queue state.`,
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

// --- DLQ Queue from Step 5 ---

type dlqEntry struct {
	msg     string
	retries int
}

type DLQQueue struct {
	pending     []dlqEntry
	inflight    map[string]dlqEntry
	deadLetters []string
	maxRetries  int
	counter     int
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

// --- Persistent Queue ---

// TODO: Define a PersistentQueue struct with an internal items slice and a log file (*os.File).

// TODO: Implement NewPersistentQueue(path string) (*PersistentQueue, error):
//   - Open/create the log file
//   - If the file exists, replay log lines to rebuild state

// TODO: Implement Push(msg string) error — write "PUSH:<msg>" to the log, then append to items.

// TODO: Implement Pop() (string, bool) — write "POP" to the log, then remove from front.

// TODO: Implement Len() int.

// TODO: Implement Close() error — close the log file.

func main() {}
`,
  testCode: `package main

import (
	"os"
	"path/filepath"
	"testing"
)

func tempLogPath(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	return filepath.Join(dir, "queue.wal")
}

func TestPersistentQueueBasic(t *testing.T) {
	path := tempLogPath(t)
	pq, err := NewPersistentQueue(path)
	if err != nil {
		t.Fatal(err)
	}
	defer pq.Close()

	if err := pq.Push("hello"); err != nil {
		t.Fatal(err)
	}
	if err := pq.Push("world"); err != nil {
		t.Fatal(err)
	}
	if pq.Len() != 2 {
		t.Fatalf("expected Len 2, got %d", pq.Len())
	}

	val, ok := pq.Pop()
	if !ok || val != "hello" {
		t.Fatalf("expected (hello, true), got (%s, %v)", val, ok)
	}
	val, ok = pq.Pop()
	if !ok || val != "world" {
		t.Fatalf("expected (world, true), got (%s, %v)", val, ok)
	}
}

func TestPersistentQueueRecovery(t *testing.T) {
	path := tempLogPath(t)

	// First session: push 3, pop 1
	pq1, err := NewPersistentQueue(path)
	if err != nil {
		t.Fatal(err)
	}
	pq1.Push("a")
	pq1.Push("b")
	pq1.Push("c")
	pq1.Pop() // removes "a"
	pq1.Close()

	// Second session: recover from log
	pq2, err := NewPersistentQueue(path)
	if err != nil {
		t.Fatal(err)
	}
	defer pq2.Close()

	if pq2.Len() != 2 {
		t.Fatalf("after recovery expected Len 2, got %d", pq2.Len())
	}
	val, ok := pq2.Pop()
	if !ok || val != "b" {
		t.Fatalf("expected (b, true) after recovery, got (%s, %v)", val, ok)
	}
	val, ok = pq2.Pop()
	if !ok || val != "c" {
		t.Fatalf("expected (c, true) after recovery, got (%s, %v)", val, ok)
	}
}

func TestPersistentQueuePopEmpty(t *testing.T) {
	path := tempLogPath(t)
	pq, err := NewPersistentQueue(path)
	if err != nil {
		t.Fatal(err)
	}
	defer pq.Close()

	_, ok := pq.Pop()
	if ok {
		t.Fatal("Pop on empty persistent queue should return false")
	}
}

func TestPersistentQueueLogFileCreated(t *testing.T) {
	path := tempLogPath(t)
	pq, err := NewPersistentQueue(path)
	if err != nil {
		t.Fatal(err)
	}
	pq.Push("test")
	pq.Close()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Fatal("log file should exist after Push")
	}
}

func TestPersistentQueueEmptyRecovery(t *testing.T) {
	path := tempLogPath(t)

	pq1, _ := NewPersistentQueue(path)
	pq1.Close()

	pq2, err := NewPersistentQueue(path)
	if err != nil {
		t.Fatal(err)
	}
	defer pq2.Close()
	if pq2.Len() != 0 {
		t.Fatalf("expected Len 0 after empty recovery, got %d", pq2.Len())
	}
}
`,
  solution: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

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

// --- DLQ Queue from Step 5 ---

type dlqEntry struct {
	msg     string
	retries int
}

type DLQQueue struct {
	pending     []dlqEntry
	inflight    map[string]dlqEntry
	deadLetters []string
	maxRetries  int
	counter     int
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

// --- Persistent Queue ---

type PersistentQueue struct {
	items []string
	log   *os.File
}

func NewPersistentQueue(path string) (*PersistentQueue, error) {
	pq := &PersistentQueue{}

	// Replay existing log if present
	if f, err := os.Open(path); err == nil {
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, "PUSH:") {
				pq.items = append(pq.items, strings.TrimPrefix(line, "PUSH:"))
			} else if line == "POP" {
				if len(pq.items) > 0 {
					pq.items = pq.items[1:]
				}
			}
		}
		f.Close()
	}

	logFile, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, err
	}
	pq.log = logFile
	return pq, nil
}

func (pq *PersistentQueue) Push(msg string) error {
	if _, err := fmt.Fprintf(pq.log, "PUSH:%s\n", msg); err != nil {
		return err
	}
	pq.items = append(pq.items, msg)
	return nil
}

func (pq *PersistentQueue) Pop() (string, bool) {
	if len(pq.items) == 0 {
		return "", false
	}
	fmt.Fprintln(pq.log, "POP")
	item := pq.items[0]
	pq.items = pq.items[1:]
	return item, true
}

func (pq *PersistentQueue) Len() int {
	return len(pq.items)
}

func (pq *PersistentQueue) Close() error {
	return pq.log.Close()
}

func main() {}
`,
  hints: [
    'Use os.OpenFile with O_APPEND|O_CREATE|O_WRONLY for the log file.',
    'For recovery, open the file read-only, scan line by line, and replay PUSH/POP operations.',
    'The log format "PUSH:message" and "POP" is simple enough to parse with strings.HasPrefix.',
    'Close the read-only file before opening for append writes.',
  ],
  projectId: 'proj-queue',
  step: 6,
  totalSteps: 6,
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-03',
  title: 'Message Queue — Topic-Based Pub/Sub',
  category: 'Projects',
  subcategory: 'Message Queue',
  difficulty: 'advanced',
  order: 24,
  description: `Add topic-based publish/subscribe to the queue system. This allows multiple subscribers to receive messages published to a topic.

Implement a Broker struct with:
- Subscribe(topic string) *Subscriber: register a new subscriber for a topic, returning a Subscriber with a Messages() method
- Publish(topic string, msg string): send a message to all subscribers of that topic
- Subscriber.Messages() []string: return all messages received so far

Messages should only go to subscribers that were registered before the message was published.`,
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

// --- Pub/Sub ---

// TODO: Define a Subscriber struct that accumulates messages.

// TODO: Implement Subscriber.Messages() []string.

// TODO: Define a Broker struct that maps topics to subscribers.

// TODO: Implement NewBroker() *Broker.

// TODO: Implement Broker.Subscribe(topic string) *Subscriber.

// TODO: Implement Broker.Publish(topic string, msg string).

func main() {}
`,
  testCode: `package main

import "testing"

func TestBrokerPublishSubscribe(t *testing.T) {
	b := NewBroker()
	sub := b.Subscribe("news")
	b.Publish("news", "hello")
	b.Publish("news", "world")

	msgs := sub.Messages()
	if len(msgs) != 2 {
		t.Fatalf("expected 2 messages, got %d", len(msgs))
	}
	if msgs[0] != "hello" || msgs[1] != "world" {
		t.Fatalf("expected [hello, world], got %v", msgs)
	}
}

func TestBrokerMultipleSubscribers(t *testing.T) {
	b := NewBroker()
	sub1 := b.Subscribe("events")
	sub2 := b.Subscribe("events")
	b.Publish("events", "ping")

	msgs1 := sub1.Messages()
	msgs2 := sub2.Messages()
	if len(msgs1) != 1 || msgs1[0] != "ping" {
		t.Fatalf("sub1 expected [ping], got %v", msgs1)
	}
	if len(msgs2) != 1 || msgs2[0] != "ping" {
		t.Fatalf("sub2 expected [ping], got %v", msgs2)
	}
}

func TestBrokerTopicIsolation(t *testing.T) {
	b := NewBroker()
	subA := b.Subscribe("topicA")
	subB := b.Subscribe("topicB")
	b.Publish("topicA", "only-A")

	msgsA := subA.Messages()
	msgsB := subB.Messages()
	if len(msgsA) != 1 || msgsA[0] != "only-A" {
		t.Fatalf("subA expected [only-A], got %v", msgsA)
	}
	if len(msgsB) != 0 {
		t.Fatalf("subB should have no messages, got %v", msgsB)
	}
}

func TestBrokerSubscribeAfterPublish(t *testing.T) {
	b := NewBroker()
	b.Publish("late", "missed")
	sub := b.Subscribe("late")

	msgs := sub.Messages()
	if len(msgs) != 0 {
		t.Fatalf("subscriber registered after publish should get 0 messages, got %d", len(msgs))
	}
}

func TestBrokerNoSubscribers(t *testing.T) {
	b := NewBroker()
	// Publishing to a topic with no subscribers should not panic
	b.Publish("empty", "no one listening")
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

// --- Pub/Sub ---

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

func main() {}
`,
  hints: [
    'The Subscriber struct can simply hold a []string slice for accumulated messages.',
    'The Broker uses a map[string][]*Subscriber to track subscribers per topic.',
    'Publish iterates over all subscribers for the given topic and appends the message.',
    'Use pointers to Subscriber so Publish can modify the same instance the caller holds.',
  ],
  projectId: 'proj-queue',
  step: 3,
  totalSteps: 6,
}

export default exercise

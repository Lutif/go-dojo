import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_15_pubsub',
  title: 'Pub/Sub System',
  category: 'Patterns',
  subcategory: 'Messaging Patterns',
  difficulty: 'advanced',
  order: 15,
  description: `Build a simple publish-subscribe message broker with topic-based routing.

Pub/Sub decouples publishers from subscribers. Publishers send messages to topics, and all subscribers to that topic receive the message.

Your tasks:

1. Create a \`Broker\` struct that manages topic subscriptions. Use a map from topic name to a slice of subscriber callbacks.

2. Implement \`NewBroker() *Broker\`.

3. Implement \`Subscribe(topic string, handler func(string)) int\` that registers a handler for a topic and returns a subscription ID.

4. Implement \`Publish(topic string, message string) int\` that sends a message to all subscribers of that topic and returns the number of subscribers notified.

5. Implement \`Unsubscribe(id int)\` that removes a subscription by its ID.`,
  code: `package main

import "sync"

// TODO: Define a subscription struct with id, topic, and handler func(string)

// TODO: Define Broker struct with subscriptions map, mutex, and nextID counter

// TODO: Implement NewBroker() *Broker

// TODO: Implement (b *Broker) Subscribe(topic string, handler func(string)) int
// Should return a unique subscription ID

// TODO: Implement (b *Broker) Publish(topic string, message string) int
// Should call all handlers for the topic and return count of notified subscribers

// TODO: Implement (b *Broker) Unsubscribe(id int)
// Should remove the subscription with the given ID

var _ = sync.Mutex{}

func main() {}`,
  testCode: `package main

import (
	"sync"
	"testing"
)

func TestPublishSubscribe(t *testing.T) {
	b := NewBroker()
	var received []string
	var mu sync.Mutex

	b.Subscribe("news", func(msg string) {
		mu.Lock()
		received = append(received, msg)
		mu.Unlock()
	})

	count := b.Publish("news", "hello")
	if count != 1 {
		t.Errorf("expected 1 subscriber notified, got %d", count)
	}
	mu.Lock()
	if len(received) != 1 || received[0] != "hello" {
		t.Errorf("expected [hello], got %v", received)
	}
	mu.Unlock()
}

func TestMultipleSubscribers(t *testing.T) {
	b := NewBroker()
	count1 := 0
	count2 := 0

	b.Subscribe("events", func(msg string) { count1++ })
	b.Subscribe("events", func(msg string) { count2++ })

	notified := b.Publish("events", "test")
	if notified != 2 {
		t.Errorf("expected 2 notified, got %d", notified)
	}
	if count1 != 1 || count2 != 1 {
		t.Errorf("expected both subscribers called once, got %d and %d", count1, count2)
	}
}

func TestTopicIsolation(t *testing.T) {
	b := NewBroker()
	called := false
	b.Subscribe("topicA", func(msg string) { called = true })

	count := b.Publish("topicB", "test")
	if count != 0 {
		t.Errorf("expected 0 notified for unsubscribed topic, got %d", count)
	}
	if called {
		t.Error("subscriber should not be called for different topic")
	}
}

func TestUnsubscribe(t *testing.T) {
	b := NewBroker()
	callCount := 0
	id := b.Subscribe("topic", func(msg string) { callCount++ })

	b.Publish("topic", "first")
	if callCount != 1 {
		t.Fatalf("expected 1 call before unsubscribe, got %d", callCount)
	}

	b.Unsubscribe(id)
	notified := b.Publish("topic", "second")
	if notified != 0 {
		t.Errorf("expected 0 notified after unsubscribe, got %d", notified)
	}
	if callCount != 1 {
		t.Errorf("expected still 1 call after unsubscribe, got %d", callCount)
	}
}

func TestPublishNoSubscribers(t *testing.T) {
	b := NewBroker()
	count := b.Publish("empty", "msg")
	if count != 0 {
		t.Errorf("expected 0, got %d", count)
	}
}`,
  solution: `package main

import "sync"

type subscription struct {
	id      int
	topic   string
	handler func(string)
}

type Broker struct {
	mu            sync.Mutex
	subscriptions map[int]*subscription
	topics        map[string][]int
	nextID        int
}

func NewBroker() *Broker {
	return &Broker{
		subscriptions: make(map[int]*subscription),
		topics:        make(map[string][]int),
	}
}

func (b *Broker) Subscribe(topic string, handler func(string)) int {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.nextID++
	id := b.nextID
	b.subscriptions[id] = &subscription{id: id, topic: topic, handler: handler}
	b.topics[topic] = append(b.topics[topic], id)
	return id
}

func (b *Broker) Publish(topic string, message string) int {
	b.mu.Lock()
	ids := make([]int, len(b.topics[topic]))
	copy(ids, b.topics[topic])
	handlers := make([]func(string), 0, len(ids))
	for _, id := range ids {
		if sub, ok := b.subscriptions[id]; ok {
			handlers = append(handlers, sub.handler)
		}
	}
	b.mu.Unlock()

	for _, h := range handlers {
		h(message)
	}
	return len(handlers)
}

func (b *Broker) Unsubscribe(id int) {
	b.mu.Lock()
	defer b.mu.Unlock()

	sub, ok := b.subscriptions[id]
	if !ok {
		return
	}
	delete(b.subscriptions, id)

	ids := b.topics[sub.topic]
	for i, sid := range ids {
		if sid == id {
			b.topics[sub.topic] = append(ids[:i], ids[i+1:]...)
			break
		}
	}
}

func main() {}`,
  hints: [
    'Use a map[int]*subscription to store subscriptions by ID and a map[string][]int to map topics to subscription IDs.',
    'Publish() should copy the handler list under the lock, then call handlers outside the lock to avoid deadlocks.',
    'Unsubscribe() removes the subscription from both the subscriptions map and the topic list.',
  ],
}

export default exercise

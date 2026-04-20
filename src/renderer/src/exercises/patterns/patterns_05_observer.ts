import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_05_observer',
  title: 'Observer Pattern',
  category: 'Patterns',
  subcategory: 'Behavioral',
  difficulty: 'intermediate',
  order: 5,
  description: `The observer pattern allows objects to subscribe to events and get notified when they occur. This decouples the event source from its consumers:

\`\`\`go
type Subscriber interface {
    OnMessage(msg string)
}

type Publisher struct {
    subscribers []Subscriber
}
\`\`\`

Your task:

1. Define a \`Subscriber\` interface with \`OnMessage(msg string)\`
2. Define a \`Publisher\` struct that holds a slice of subscribers
3. \`NewPublisher() *Publisher\`
4. \`Subscribe(s Subscriber)\` - adds a subscriber
5. \`Unsubscribe(s Subscriber)\` - removes a subscriber
6. \`Publish(msg string)\` - calls OnMessage on all subscribers
7. Define \`TestSubscriber\` struct with \`LastMessage string\` and \`CallCount int\` fields that implements Subscriber`,
  code: `package main

// TODO: Define Subscriber interface with OnMessage(msg string)

// TODO: Define TestSubscriber struct with LastMessage string and CallCount int
// Implement OnMessage: store msg in LastMessage, increment CallCount

// TODO: Define Publisher struct with subscribers slice

// TODO: Implement NewPublisher() *Publisher

// TODO: Implement Subscribe(s Subscriber)

// TODO: Implement Unsubscribe(s Subscriber)

// TODO: Implement Publish(msg string) - notify all subscribers

func main() {}`,
  testCode: `package main

import "testing"

func TestPublishToSubscriber(t *testing.T) {
	sub := &TestSubscriber{}
	pub := NewPublisher()
	pub.Subscribe(sub)

	pub.Publish("test message")

	if sub.LastMessage != "test message" {
		t.Errorf("LastMessage = %q, want %q", sub.LastMessage, "test message")
	}
	if sub.CallCount != 1 {
		t.Errorf("CallCount = %d, want 1", sub.CallCount)
	}
}

func TestMultipleSubscribers(t *testing.T) {
	sub1 := &TestSubscriber{}
	sub2 := &TestSubscriber{}
	pub := NewPublisher()
	pub.Subscribe(sub1)
	pub.Subscribe(sub2)

	pub.Publish("broadcast")

	if sub1.LastMessage != "broadcast" {
		t.Errorf("sub1.LastMessage = %q, want %q", sub1.LastMessage, "broadcast")
	}
	if sub2.LastMessage != "broadcast" {
		t.Errorf("sub2.LastMessage = %q, want %q", sub2.LastMessage, "broadcast")
	}
}

func TestUnsubscribe(t *testing.T) {
	sub := &TestSubscriber{}
	pub := NewPublisher()
	pub.Subscribe(sub)
	pub.Publish("first")
	pub.Unsubscribe(sub)
	pub.Publish("second")

	if sub.LastMessage != "first" {
		t.Errorf("LastMessage = %q, want %q (should not receive after unsubscribe)", sub.LastMessage, "first")
	}
	if sub.CallCount != 1 {
		t.Errorf("CallCount = %d, want 1", sub.CallCount)
	}
}

func TestMultiplePublishes(t *testing.T) {
	sub := &TestSubscriber{}
	pub := NewPublisher()
	pub.Subscribe(sub)

	pub.Publish("one")
	pub.Publish("two")
	pub.Publish("three")

	if sub.LastMessage != "three" {
		t.Errorf("LastMessage = %q, want %q", sub.LastMessage, "three")
	}
	if sub.CallCount != 3 {
		t.Errorf("CallCount = %d, want 3", sub.CallCount)
	}
}`,
  solution: `package main

type Subscriber interface {
	OnMessage(msg string)
}

type TestSubscriber struct {
	LastMessage string
	CallCount   int
}

func (ts *TestSubscriber) OnMessage(msg string) {
	ts.LastMessage = msg
	ts.CallCount++
}

type Publisher struct {
	subscribers []Subscriber
}

func NewPublisher() *Publisher {
	return &Publisher{}
}

func (p *Publisher) Subscribe(s Subscriber) {
	p.subscribers = append(p.subscribers, s)
}

func (p *Publisher) Unsubscribe(s Subscriber) {
	for i, sub := range p.subscribers {
		if sub == s {
			p.subscribers = append(p.subscribers[:i], p.subscribers[i+1:]...)
			return
		}
	}
}

func (p *Publisher) Publish(msg string) {
	for _, sub := range p.subscribers {
		sub.OnMessage(msg)
	}
}

func main() {}`,
  hints: [
    'Store subscribers in a slice. Subscribe appends, Unsubscribe removes by finding and splicing.',
    'Publish loops over all subscribers calling OnMessage on each.',
    'TestSubscriber tracks LastMessage and CallCount for verification.',
  ],
}

export default exercise

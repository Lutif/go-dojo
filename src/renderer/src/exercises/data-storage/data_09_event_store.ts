import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_09_event_store',
  title: 'Event Store',
  category: 'Data & Storage',
  subcategory: 'Event Sourcing',
  difficulty: 'expert',
  order: 9,
  description: `Create an event store for event sourcing. Instead of storing current state, you store a sequence of immutable events that can be replayed to reconstruct state at any point in time.

Each event has:
\`\`\`
type Event struct {
    ID        int
    Stream    string  // aggregate/entity ID
    Type      string  // event type like "Deposited", "Withdrawn"
    Data      string  // event payload
    Version   int     // version within the stream
    Timestamp int64   // Unix timestamp
}
\`\`\`

Events are stored per stream (e.g., per account). Replaying events for a stream rebuilds that entity's state.

For this exercise, model a simple bank account: "Deposited" adds to balance, "Withdrawn" subtracts.

Implement:
- \`NewEventStore()\` - creates an empty store
- \`Append(stream, eventType, data string) Event\` - appends an event to a stream
- \`GetStream(stream string) []Event\` - returns all events for a stream in order
- \`GetAll() []Event\` - returns all events across all streams in order
- \`ReplayBalance(stream string) int\` - replays events to compute a bank balance
  - "Deposited" events: parse data as int and add to balance
  - "Withdrawn" events: parse data as int and subtract from balance`,
  code: `package main

import (
	"strconv"
	"time"
)

// Event represents an immutable event in the store.
type Event struct {
	ID        int
	Stream    string
	Type      string
	Data      string
	Version   int
	Timestamp int64
}

// EventStore stores immutable events per stream.
type EventStore struct {
	// TODO: Add events slice, stream index map, and ID counter
}

// NewEventStore creates an empty event store.
func NewEventStore() *EventStore {
	// TODO
	return nil
}

// Append adds an event to the given stream. Returns the created event.
// Version is auto-incremented per stream (starting at 1).
// ID is globally unique (starting at 1).
func (es *EventStore) Append(stream, eventType, data string) Event {
	// TODO
	return Event{}
}

// GetStream returns all events for a stream in order.
func (es *EventStore) GetStream(stream string) []Event {
	// TODO
	return nil
}

// GetAll returns all events in global order.
func (es *EventStore) GetAll() []Event {
	// TODO
	return nil
}

// ReplayBalance replays events for a stream to compute a bank balance.
// "Deposited" adds the data (parsed as int) to balance.
// "Withdrawn" subtracts the data (parsed as int) from balance.
func (es *EventStore) ReplayBalance(stream string) int {
	// TODO
	return 0
}

var _ = strconv.Atoi
var _ = time.Now

func main() {}`,
  testCode: `package main

import "testing"

func TestEventStoreAppend(t *testing.T) {
	es := NewEventStore()
	e1 := es.Append("acct-1", "Deposited", "100")
	e2 := es.Append("acct-1", "Withdrawn", "30")
	e3 := es.Append("acct-2", "Deposited", "200")

	if e1.ID != 1 || e2.ID != 2 || e3.ID != 3 {
		t.Errorf("IDs = (%d, %d, %d), want (1, 2, 3)", e1.ID, e2.ID, e3.ID)
	}
	if e1.Version != 1 || e2.Version != 2 {
		t.Errorf("acct-1 versions = (%d, %d), want (1, 2)", e1.Version, e2.Version)
	}
	if e3.Version != 1 {
		t.Errorf("acct-2 version = %d, want 1", e3.Version)
	}
}

func TestEventStoreGetStream(t *testing.T) {
	es := NewEventStore()
	es.Append("acct-1", "Deposited", "100")
	es.Append("acct-2", "Deposited", "200")
	es.Append("acct-1", "Withdrawn", "50")

	events := es.GetStream("acct-1")
	if len(events) != 2 {
		t.Fatalf("GetStream(acct-1) has %d events, want 2", len(events))
	}
	if events[0].Type != "Deposited" || events[1].Type != "Withdrawn" {
		t.Errorf("events types = (%q, %q), want (Deposited, Withdrawn)", events[0].Type, events[1].Type)
	}
}

func TestEventStoreGetStreamEmpty(t *testing.T) {
	es := NewEventStore()
	events := es.GetStream("nonexistent")
	if len(events) != 0 {
		t.Errorf("GetStream(nonexistent) should return empty slice, got %d events", len(events))
	}
}

func TestEventStoreGetAll(t *testing.T) {
	es := NewEventStore()
	es.Append("a", "X", "1")
	es.Append("b", "Y", "2")
	es.Append("a", "Z", "3")

	all := es.GetAll()
	if len(all) != 3 {
		t.Fatalf("GetAll() has %d events, want 3", len(all))
	}
	if all[0].ID != 1 || all[1].ID != 2 || all[2].ID != 3 {
		t.Error("GetAll should return events in global order")
	}
}

func TestEventStoreReplayBalance(t *testing.T) {
	es := NewEventStore()
	es.Append("acct-1", "Deposited", "100")
	es.Append("acct-1", "Deposited", "50")
	es.Append("acct-1", "Withdrawn", "30")

	balance := es.ReplayBalance("acct-1")
	if balance != 120 {
		t.Errorf("ReplayBalance(acct-1) = %d, want 120", balance)
	}
}

func TestEventStoreReplayBalanceEmpty(t *testing.T) {
	es := NewEventStore()
	balance := es.ReplayBalance("nonexistent")
	if balance != 0 {
		t.Errorf("ReplayBalance(nonexistent) = %d, want 0", balance)
	}
}

func TestEventStoreMultipleStreams(t *testing.T) {
	es := NewEventStore()
	es.Append("acct-1", "Deposited", "100")
	es.Append("acct-2", "Deposited", "500")
	es.Append("acct-1", "Withdrawn", "25")
	es.Append("acct-2", "Withdrawn", "100")

	if b := es.ReplayBalance("acct-1"); b != 75 {
		t.Errorf("acct-1 balance = %d, want 75", b)
	}
	if b := es.ReplayBalance("acct-2"); b != 400 {
		t.Errorf("acct-2 balance = %d, want 400", b)
	}
}

func TestEventStoreTimestamp(t *testing.T) {
	es := NewEventStore()
	e := es.Append("s", "T", "d")
	if e.Timestamp <= 0 {
		t.Error("event should have a non-zero timestamp")
	}
}`,
  solution: `package main

import (
	"strconv"
	"time"
)

type Event struct {
	ID        int
	Stream    string
	Type      string
	Data      string
	Version   int
	Timestamp int64
}

type EventStore struct {
	events   []Event
	streams  map[string][]int // stream -> indices into events
	nextID   int
	versions map[string]int   // stream -> current version
}

func NewEventStore() *EventStore {
	return &EventStore{
		streams:  make(map[string][]int),
		versions: make(map[string]int),
		nextID:   1,
	}
}

func (es *EventStore) Append(stream, eventType, data string) Event {
	es.versions[stream]++
	e := Event{
		ID:        es.nextID,
		Stream:    stream,
		Type:      eventType,
		Data:      data,
		Version:   es.versions[stream],
		Timestamp: time.Now().UnixNano(),
	}
	es.nextID++
	idx := len(es.events)
	es.events = append(es.events, e)
	es.streams[stream] = append(es.streams[stream], idx)
	return e
}

func (es *EventStore) GetStream(stream string) []Event {
	indices := es.streams[stream]
	result := make([]Event, len(indices))
	for i, idx := range indices {
		result[i] = es.events[idx]
	}
	return result
}

func (es *EventStore) GetAll() []Event {
	result := make([]Event, len(es.events))
	copy(result, es.events)
	return result
}

func (es *EventStore) ReplayBalance(stream string) int {
	balance := 0
	for _, e := range es.GetStream(stream) {
		amount, _ := strconv.Atoi(e.Data)
		switch e.Type {
		case "Deposited":
			balance += amount
		case "Withdrawn":
			balance -= amount
		}
	}
	return balance
}

func main() {}`,
  hints: [
    'Track per-stream versions with a map[string]int. Increment before creating each event.',
    'Store events in a global slice for ordering, and keep a map[string][]int of indices per stream.',
    'ReplayBalance: iterate stream events, parse Data as int with strconv.Atoi, add for Deposited, subtract for Withdrawn.',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_07_wal',
  title: 'Write-Ahead Log',
  category: 'Data & Storage',
  subcategory: 'Durability',
  difficulty: 'expert',
  order: 7,
  description: `Build a Write-Ahead Log (WAL) that records entries before they are applied to an in-memory store. This pattern ensures durability: on crash, the log can be replayed to rebuild state.

In this exercise, the WAL operates in memory (simulated durability). Each log entry has a sequence number, an operation type, a key, and a value:

\`\`\`
type Entry struct {
    SeqNum int
    Op     string  // "SET" or "DELETE"
    Key    string
    Value  string
}
\`\`\`

The WAL maintains a log of entries and can replay them against a store (a simple map).

Implement:
- \`NewWAL()\` - creates an empty WAL
- \`Append(op, key, value string) int\` - appends an entry, returns its sequence number (starting at 1)
- \`Entries() []Entry\` - returns all log entries
- \`Replay() map[string]string\` - replays all entries to build a key-value map
- \`Truncate(upTo int)\` - removes entries with SeqNum <= upTo (compaction)
- \`Len() int\` - returns the number of entries in the log`,
  code: `package main

// Entry represents a single WAL entry.
type Entry struct {
	SeqNum int
	Op     string // "SET" or "DELETE"
	Key    string
	Value  string
}

// WAL is a write-ahead log.
type WAL struct {
	// TODO: Add entries slice and sequence counter
}

// NewWAL creates an empty write-ahead log.
func NewWAL() *WAL {
	// TODO
	return nil
}

// Append adds an entry to the log and returns its sequence number.
// Sequence numbers start at 1 and increment.
func (w *WAL) Append(op, key, value string) int {
	// TODO
	return 0
}

// Entries returns all entries in the log.
func (w *WAL) Entries() []Entry {
	// TODO
	return nil
}

// Replay applies all log entries in order to build a key-value map.
// SET adds/updates a key; DELETE removes a key.
func (w *WAL) Replay() map[string]string {
	// TODO
	return nil
}

// Truncate removes all entries with SeqNum <= upTo.
func (w *WAL) Truncate(upTo int) {
	// TODO
}

// Len returns the number of entries in the log.
func (w *WAL) Len() int {
	// TODO
	return 0
}

func main() {}`,
  testCode: `package main

import "testing"

func TestWALAppend(t *testing.T) {
	wal := NewWAL()
	s1 := wal.Append("SET", "name", "Alice")
	s2 := wal.Append("SET", "city", "NYC")
	s3 := wal.Append("DELETE", "name", "")

	if s1 != 1 || s2 != 2 || s3 != 3 {
		t.Errorf("sequence numbers = (%d, %d, %d), want (1, 2, 3)", s1, s2, s3)
	}
	if wal.Len() != 3 {
		t.Errorf("Len() = %d, want 3", wal.Len())
	}
}

func TestWALEntries(t *testing.T) {
	wal := NewWAL()
	wal.Append("SET", "a", "1")
	wal.Append("SET", "b", "2")

	entries := wal.Entries()
	if len(entries) != 2 {
		t.Fatalf("Entries() has %d items, want 2", len(entries))
	}
	if entries[0].Op != "SET" || entries[0].Key != "a" || entries[0].Value != "1" {
		t.Errorf("entry 0 = %+v, want SET a=1", entries[0])
	}
	if entries[1].SeqNum != 2 {
		t.Errorf("entry 1 SeqNum = %d, want 2", entries[1].SeqNum)
	}
}

func TestWALReplay(t *testing.T) {
	wal := NewWAL()
	wal.Append("SET", "name", "Alice")
	wal.Append("SET", "city", "NYC")
	wal.Append("SET", "name", "Bob")
	wal.Append("DELETE", "city", "")

	state := wal.Replay()
	if state["name"] != "Bob" {
		t.Errorf("state[name] = %q, want Bob", state["name"])
	}
	if _, ok := state["city"]; ok {
		t.Error("state[city] should not exist after DELETE")
	}
}

func TestWALReplayEmpty(t *testing.T) {
	wal := NewWAL()
	state := wal.Replay()
	if len(state) != 0 {
		t.Errorf("Replay on empty WAL should return empty map, got %v", state)
	}
}

func TestWALTruncate(t *testing.T) {
	wal := NewWAL()
	wal.Append("SET", "a", "1")
	wal.Append("SET", "b", "2")
	wal.Append("SET", "c", "3")
	wal.Append("SET", "d", "4")

	wal.Truncate(2) // remove entries 1 and 2
	if wal.Len() != 2 {
		t.Errorf("after Truncate(2) Len() = %d, want 2", wal.Len())
	}

	entries := wal.Entries()
	if entries[0].SeqNum != 3 || entries[0].Key != "c" {
		t.Errorf("first remaining entry = %+v, want SeqNum=3 Key=c", entries[0])
	}
}

func TestWALTruncateAndReplay(t *testing.T) {
	wal := NewWAL()
	wal.Append("SET", "x", "old")
	wal.Append("SET", "x", "new")
	wal.Truncate(1) // remove the first SET

	state := wal.Replay()
	if state["x"] != "new" {
		t.Errorf("after truncate, Replay state[x] = %q, want new", state["x"])
	}
}

func TestWALSequenceContinuesAfterTruncate(t *testing.T) {
	wal := NewWAL()
	wal.Append("SET", "a", "1")
	wal.Append("SET", "b", "2")
	wal.Truncate(2)

	s := wal.Append("SET", "c", "3")
	if s != 3 {
		t.Errorf("sequence after truncate = %d, want 3", s)
	}
}`,
  solution: `package main

type Entry struct {
	SeqNum int
	Op     string
	Key    string
	Value  string
}

type WAL struct {
	entries []Entry
	nextSeq int
}

func NewWAL() *WAL {
	return &WAL{nextSeq: 1}
}

func (w *WAL) Append(op, key, value string) int {
	seq := w.nextSeq
	w.nextSeq++
	w.entries = append(w.entries, Entry{
		SeqNum: seq,
		Op:     op,
		Key:    key,
		Value:  value,
	})
	return seq
}

func (w *WAL) Entries() []Entry {
	result := make([]Entry, len(w.entries))
	copy(result, w.entries)
	return result
}

func (w *WAL) Replay() map[string]string {
	state := make(map[string]string)
	for _, e := range w.entries {
		switch e.Op {
		case "SET":
			state[e.Key] = e.Value
		case "DELETE":
			delete(state, e.Key)
		}
	}
	return state
}

func (w *WAL) Truncate(upTo int) {
	kept := w.entries[:0]
	for _, e := range w.entries {
		if e.SeqNum > upTo {
			kept = append(kept, e)
		}
	}
	w.entries = kept
}

func (w *WAL) Len() int {
	return len(w.entries)
}

func main() {}`,
  hints: [
    'Use a nextSeq counter that increments on each Append and never resets, even after Truncate.',
    'Replay iterates entries in order: SET adds to the map, DELETE removes from it.',
    'Truncate filters entries keeping only those with SeqNum > upTo.',
  ],
}

export default exercise

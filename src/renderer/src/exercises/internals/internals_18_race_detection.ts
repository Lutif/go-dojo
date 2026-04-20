import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_18_race_detection',
  title: 'Race Detection',
  category: 'Internals',
  subcategory: 'Concurrency',
  difficulty: 'expert',
  order: 18,
  description: `The race detector (\`go test -race\`) finds concurrent access to shared data without synchronization. A **data race** occurs when two goroutines access the same variable concurrently and at least one write occurs.

\`\`\`
// DATA RACE: concurrent read + write without sync
var counter int
go func() { counter++ }()
fmt.Println(counter)

// FIXED with mutex:
var mu sync.Mutex
go func() { mu.Lock(); counter++; mu.Unlock() }()
mu.Lock(); fmt.Println(counter); mu.Unlock()
\`\`\`

Your task: identify and fix data races.`,
  code: `package main

import "sync"

// SafeCounter is a thread-safe counter.
type SafeCounter struct {
	// TODO: Add mutex and value
}

// NewSafeCounter creates a new SafeCounter.
func NewSafeCounter() *SafeCounter {
	// TODO
	return nil
}

// Inc increments the counter by 1. Must be safe for concurrent use.
func (c *SafeCounter) Inc() {
	// TODO
}

// Value returns the current count. Must be safe for concurrent use.
func (c *SafeCounter) Value() int {
	// TODO
	return 0
}

// SafeMap is a thread-safe string map.
type SafeMap struct {
	// TODO: Add RWMutex and map
}

// NewSafeMap creates a new SafeMap.
func NewSafeMap() *SafeMap {
	// TODO
	return nil
}

// Set sets a key-value pair.
func (m *SafeMap) Set(key, value string) {
	// TODO
}

// Get returns the value and whether the key exists.
func (m *SafeMap) Get(key string) (string, bool) {
	// TODO
	return "", false
}

// Len returns the number of entries.
func (m *SafeMap) Len() int {
	// TODO
	return 0
}

var _ = sync.Mutex{}`,
  testCode: `package main

import (
	"sync"
	"testing"
)

func TestSafeCounterConcurrent(t *testing.T) {
	c := NewSafeCounter()
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Inc()
		}()
	}
	wg.Wait()
	if c.Value() != 1000 {
		t.Errorf("got %d, want 1000", c.Value())
	}
}

func TestSafeMapConcurrent(t *testing.T) {
	m := NewSafeMap()
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			key := string(rune('a' + i%26))
			m.Set(key, "value")
		}(i)
	}
	wg.Wait()
	if m.Len() == 0 {
		t.Error("map should have entries")
	}
}

func TestSafeMapGetSet(t *testing.T) {
	m := NewSafeMap()
	m.Set("key", "value")
	got, ok := m.Get("key")
	if !ok || got != "value" {
		t.Errorf("got %q, %v", got, ok)
	}
}

func TestSafeMapGetMissing(t *testing.T) {
	m := NewSafeMap()
	_, ok := m.Get("missing")
	if ok {
		t.Error("should return false for missing key")
	}
}`,
  solution: `package main

import "sync"

type SafeCounter struct {
	mu    sync.Mutex
	value int
}

func NewSafeCounter() *SafeCounter {
	return &SafeCounter{}
}

func (c *SafeCounter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.value++
}

func (c *SafeCounter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.value
}

type SafeMap struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewSafeMap() *SafeMap {
	return &SafeMap{data: make(map[string]string)}
}

func (m *SafeMap) Set(key, value string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data[key] = value
}

func (m *SafeMap) Get(key string) (string, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	v, ok := m.data[key]
	return v, ok
}

func (m *SafeMap) Len() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.data)
}

var _ = sync.Mutex{}`,
  hints: [
    'SafeCounter: embed sync.Mutex, lock/unlock around every read and write of the value.',
    'SafeMap: use sync.RWMutex. RLock for reads (Get, Len), Lock for writes (Set).',
    'Always defer Unlock() right after Lock() to ensure it runs even on panic.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_10_mutex',
  title: 'Mutex',
  category: 'Concurrency',
  subcategory: 'Sync Primitives',
  difficulty: 'intermediate',
  order: 10,
  description: `\`sync.Mutex\` protects shared state from concurrent access:

\`\`\`
var mu sync.Mutex
var count int

mu.Lock()
count++         // safe — only one goroutine at a time
mu.Unlock()
\`\`\`

Best practices:
- Always \`defer mu.Unlock()\` right after \`Lock()\` to prevent deadlocks
- Keep the critical section (code between Lock/Unlock) as small as possible
- Never copy a mutex after first use
- Embed mutex in the struct it protects:

\`\`\`
type SafeMap struct {
    mu   sync.Mutex
    data map[string]int
}
\`\`\`

Your task: build thread-safe data structures with Mutex.`,
  code: `package main

import "sync"

// SafeCounter is a thread-safe counter.
type SafeCounter struct {
	// TODO: Add mutex and value field
}

// NewSafeCounter creates a new SafeCounter starting at 0.
func NewSafeCounter() *SafeCounter {
	// TODO
	return nil
}

// Inc increments the counter by 1 and returns the new value.
func (c *SafeCounter) Inc() int {
	// TODO: Lock, increment, return
	return 0
}

// Value returns the current count.
func (c *SafeCounter) Value() int {
	// TODO
	return 0
}

// SafeMap is a thread-safe string→int map.
type SafeMap struct {
	// TODO: Add mutex and data map
}

// NewSafeMap creates a new SafeMap.
func NewSafeMap() *SafeMap {
	// TODO
	return nil
}

// Set stores a key-value pair.
func (m *SafeMap) Set(key string, val int) {
	// TODO
}

// Get retrieves a value. Returns (0, false) if not found.
func (m *SafeMap) Get(key string) (int, bool) {
	// TODO
	return 0, false
}

// Keys returns all keys in the map.
func (m *SafeMap) Keys() []string {
	// TODO
	return nil
}

var _ = sync.Mutex{}`,
  testCode: `package main

import (
	"sync"
	"testing"
)

func TestSafeCounterBasic(t *testing.T) {
	c := NewSafeCounter()
	if v := c.Value(); v != 0 {
		t.Errorf("initial = %d, want 0", v)
	}
	c.Inc()
	c.Inc()
	c.Inc()
	if v := c.Value(); v != 3 {
		t.Errorf("after 3 Inc = %d, want 3", v)
	}
}

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
	if v := c.Value(); v != 1000 {
		t.Errorf("after 1000 concurrent Inc = %d, want 1000", v)
	}
}

func TestSafeCounterIncReturns(t *testing.T) {
	c := NewSafeCounter()
	if got := c.Inc(); got != 1 {
		t.Errorf("first Inc returned %d, want 1", got)
	}
	if got := c.Inc(); got != 2 {
		t.Errorf("second Inc returned %d, want 2", got)
	}
}

func TestSafeMapBasic(t *testing.T) {
	m := NewSafeMap()
	m.Set("a", 1)
	m.Set("b", 2)

	val, ok := m.Get("a")
	if !ok || val != 1 {
		t.Errorf("Get(a) = (%d, %v), want (1, true)", val, ok)
	}

	_, ok = m.Get("missing")
	if ok {
		t.Error("Get(missing) should return false")
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
			m.Set(key, i)
			m.Get(key)
		}(i)
	}
	wg.Wait()
}

func TestSafeMapKeys(t *testing.T) {
	m := NewSafeMap()
	m.Set("x", 1)
	m.Set("y", 2)
	m.Set("z", 3)
	keys := m.Keys()
	if len(keys) != 3 {
		t.Errorf("got %d keys, want 3", len(keys))
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

func (c *SafeCounter) Inc() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.value++
	return c.value
}

func (c *SafeCounter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.value
}

type SafeMap struct {
	mu   sync.Mutex
	data map[string]int
}

func NewSafeMap() *SafeMap {
	return &SafeMap{data: make(map[string]int)}
}

func (m *SafeMap) Set(key string, val int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data[key] = val
}

func (m *SafeMap) Get(key string) (int, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	v, ok := m.data[key]
	return v, ok
}

func (m *SafeMap) Keys() []string {
	m.mu.Lock()
	defer m.mu.Unlock()
	keys := make([]string, 0, len(m.data))
	for k := range m.data {
		keys = append(keys, k)
	}
	return keys
}`,
  hints: [
    'SafeCounter: embed sync.Mutex in the struct. Inc: lock, increment, store the new value, unlock, return it.',
    'SafeMap: use sync.Mutex + map[string]int. Every method (Set, Get, Keys) must Lock/Unlock.',
    'Always use defer mu.Unlock() immediately after mu.Lock() to prevent forgetting to unlock.'
  ],
}

export default exercise

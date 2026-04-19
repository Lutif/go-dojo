import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_11_rwmutex',
  title: 'RWMutex',
  category: 'Concurrency',
  subcategory: 'Sync Primitives',
  difficulty: 'intermediate',
  order: 11,
  description: `\`sync.RWMutex\` allows **multiple concurrent readers** or **one exclusive writer**:

\`\`\`
var rw sync.RWMutex

rw.RLock()    // shared read lock — many can hold this
rw.RUnlock()

rw.Lock()     // exclusive write lock — blocks all readers and writers
rw.Unlock()
\`\`\`

Performance benefit: in read-heavy workloads (config lookups, caches), many goroutines can read simultaneously. Use regular \`Mutex\` when reads and writes are roughly equal.

Your task: build a read-heavy data structure with RWMutex.`,
  code: `package main

import "sync"

// Config is a thread-safe configuration store.
// Many goroutines read config, but writes are rare.
type Config struct {
	// TODO: Add RWMutex and data map[string]string
}

// NewConfig creates a Config with initial values.
func NewConfig(initial map[string]string) *Config {
	// TODO
	return nil
}

// Get reads a config value. Uses read lock for concurrency.
func (c *Config) Get(key string) (string, bool) {
	// TODO: Use RLock/RUnlock
	return "", false
}

// Set writes a config value. Uses exclusive write lock.
func (c *Config) Set(key, value string) {
	// TODO: Use Lock/Unlock
}

// GetAll returns a copy of all config values.
func (c *Config) GetAll() map[string]string {
	// TODO: Use RLock, copy the map, RUnlock
	return nil
}

// Count returns the number of config entries.
func (c *Config) Count() int {
	// TODO: Use RLock
	return 0
}

var _ = sync.RWMutex{}`,
  testCode: `package main

import (
	"sync"
	"testing"
)

func TestConfigGetSet(t *testing.T) {
	c := NewConfig(map[string]string{"host": "localhost"})
	val, ok := c.Get("host")
	if !ok || val != "localhost" {
		t.Errorf("Get(host) = (%q, %v), want (localhost, true)", val, ok)
	}

	c.Set("port", "8080")
	val, ok = c.Get("port")
	if !ok || val != "8080" {
		t.Errorf("Get(port) = (%q, %v), want (8080, true)", val, ok)
	}
}

func TestConfigMissing(t *testing.T) {
	c := NewConfig(map[string]string{})
	_, ok := c.Get("missing")
	if ok {
		t.Error("missing key should return false")
	}
}

func TestConfigGetAll(t *testing.T) {
	c := NewConfig(map[string]string{"a": "1", "b": "2"})
	all := c.GetAll()
	if len(all) != 2 || all["a"] != "1" || all["b"] != "2" {
		t.Errorf("GetAll = %v, want {a:1 b:2}", all)
	}
	// Verify it's a copy
	all["c"] = "3"
	if c.Count() != 2 {
		t.Error("GetAll should return a copy, not the internal map")
	}
}

func TestConfigCount(t *testing.T) {
	c := NewConfig(map[string]string{"x": "1", "y": "2", "z": "3"})
	if n := c.Count(); n != 3 {
		t.Errorf("Count = %d, want 3", n)
	}
}

func TestConfigConcurrentReads(t *testing.T) {
	c := NewConfig(map[string]string{"key": "value"})
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Get("key")
			c.GetAll()
			c.Count()
		}()
	}
	wg.Wait()
}

func TestConfigConcurrentReadWrite(t *testing.T) {
	c := NewConfig(map[string]string{})
	var wg sync.WaitGroup
	// Writers
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			c.Set("key", "value")
		}(i)
	}
	// Readers
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Get("key")
		}()
	}
	wg.Wait()
}`,
  solution: `package main

import "sync"

type Config struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewConfig(initial map[string]string) *Config {
	data := make(map[string]string)
	for k, v := range initial {
		data[k] = v
	}
	return &Config{data: data}
}

func (c *Config) Get(key string) (string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	val, ok := c.data[key]
	return val, ok
}

func (c *Config) Set(key, value string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data[key] = value
}

func (c *Config) GetAll() map[string]string {
	c.mu.RLock()
	defer c.mu.RUnlock()
	cp := make(map[string]string, len(c.data))
	for k, v := range c.data {
		cp[k] = v
	}
	return cp
}

func (c *Config) Count() int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return len(c.data)
}`,
  hints: [
    'Use RLock()/RUnlock() for Get, GetAll, Count — these are read-only operations that can run concurrently.',
    'Use Lock()/Unlock() for Set — this is a write that needs exclusive access.',
    'GetAll must return a copy: create a new map and copy entries while holding the read lock.'
  ],
}

export default exercise

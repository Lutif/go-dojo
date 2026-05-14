import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-03',
  title: 'KV Store — Thread-Safe with RWMutex',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'intermediate',
  order: 125,
  description: `Make the store safe for concurrent access using sync.RWMutex.

Implement a SafeStore struct with the same API as Store:
- NewSafeStore() *SafeStore
- Set(key, value string)
- Get(key string) (string, bool)
- Delete(key string) bool
- Len() int

Use a read-write mutex so multiple goroutines can read simultaneously, but writes are exclusive. Get and Len take a read lock; Set and Delete take a write lock.

The tests will hammer the store from multiple goroutines concurrently.`,
  code: `package main

// TODO: Import "sync"

// TODO: Define SafeStore with a map and a sync.RWMutex.

// TODO: Implement NewSafeStore() *SafeStore.

// TODO: Implement Set(key, value string) — use s.mu.Lock()/Unlock().

// TODO: Implement Get(key string) (string, bool) — use s.mu.RLock()/RUnlock().

// TODO: Implement Delete(key string) bool — use s.mu.Lock()/Unlock().

// TODO: Implement Len() int — use s.mu.RLock()/RUnlock().

func main() {}
`,
  testCode: `package main

import (
	"fmt"
	"sync"
	"testing"
)

func TestSafeStoreBasic(t *testing.T) {
	s := NewSafeStore()
	s.Set("a", "1")
	val, ok := s.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected (1, true), got (%s, %v)", val, ok)
	}
}

func TestSafeStoreDelete(t *testing.T) {
	s := NewSafeStore()
	s.Set("x", "y")
	if !s.Delete("x") {
		t.Fatal("Delete existing should return true")
	}
	if s.Delete("x") {
		t.Fatal("Delete missing should return false")
	}
}

func TestSafeStoreConcurrentWrites(t *testing.T) {
	s := NewSafeStore()
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			key := fmt.Sprintf("key-%d", n)
			s.Set(key, fmt.Sprintf("val-%d", n))
		}(i)
	}
	wg.Wait()

	if s.Len() != 100 {
		t.Fatalf("expected 100 keys, got %d", s.Len())
	}
}

func TestSafeStoreConcurrentReads(t *testing.T) {
	s := NewSafeStore()
	s.Set("shared", "value")

	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			val, ok := s.Get("shared")
			if !ok || val != "value" {
				t.Errorf("concurrent read failed: got (%s, %v)", val, ok)
			}
		}()
	}
	wg.Wait()
}

func TestSafeStoreConcurrentReadWrite(t *testing.T) {
	s := NewSafeStore()
	var wg sync.WaitGroup

	for i := 0; i < 50; i++ {
		wg.Add(2)
		go func(n int) {
			defer wg.Done()
			s.Set(fmt.Sprintf("k%d", n), "v")
		}(i)
		go func(n int) {
			defer wg.Done()
			s.Get(fmt.Sprintf("k%d", n))
		}(i)
	}
	wg.Wait()
}

func TestSafeStoreConcurrentDelete(t *testing.T) {
	s := NewSafeStore()
	for i := 0; i < 50; i++ {
		s.Set(fmt.Sprintf("d%d", i), "val")
	}

	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			s.Delete(fmt.Sprintf("d%d", n))
		}(i)
	}
	wg.Wait()

	if s.Len() != 0 {
		t.Fatalf("expected 0 keys after concurrent delete, got %d", s.Len())
	}
}

func TestSafeStoreLenUnderContention(t *testing.T) {
	s := NewSafeStore()
	var wg sync.WaitGroup

	for i := 0; i < 50; i++ {
		wg.Add(2)
		go func(n int) {
			defer wg.Done()
			s.Set(fmt.Sprintf("len-%d", n), "v")
		}(i)
		go func() {
			defer wg.Done()
			s.Len()
		}()
	}
	wg.Wait()

	if s.Len() != 50 {
		t.Fatalf("expected 50, got %d", s.Len())
	}
}
`,
  solution: `package main

import "sync"

type SafeStore struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewSafeStore() *SafeStore {
	return &SafeStore{data: make(map[string]string)}
}

func (s *SafeStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = value
}

func (s *SafeStore) Get(key string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, ok := s.data[key]
	return val, ok
}

func (s *SafeStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *SafeStore) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}

func main() {}
`,
  hints: [
    'Embed a sync.RWMutex as a field in your struct (not a pointer).',
    'Use mu.Lock()/mu.Unlock() for writes (Set, Delete) and mu.RLock()/mu.RUnlock() for reads (Get, Len).',
    'Always defer the unlock immediately after locking to prevent deadlocks on early returns.',
    'RWMutex allows multiple concurrent readers but only one writer — this is ideal for read-heavy workloads.',
  ],
  projectId: 'proj-kv',
  step: 3,
  totalSteps: 8,
}

export default exercise

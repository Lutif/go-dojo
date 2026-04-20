import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_01_kv_store',
  title: 'In-Memory KV Store',
  category: 'Data & Storage',
  subcategory: 'Key-Value Stores',
  difficulty: 'intermediate',
  order: 1,
  description: `Build a thread-safe in-memory key-value store with Get, Set, and Delete operations.

A key-value store is the simplest storage abstraction: map a key to a value. Adding thread safety with \`sync.RWMutex\` makes it safe for concurrent access:

\`\`\`
type KVStore struct {
    mu   sync.RWMutex
    data map[string]string
}
\`\`\`

\`RWMutex\` allows multiple concurrent readers but only one writer:
- \`RLock()/RUnlock()\` for read operations (Get, Keys)
- \`Lock()/Unlock()\` for write operations (Set, Delete)

Your task: implement a thread-safe KV store with Get, Set, Delete, Keys, and Len methods.`,
  code: `package main

import "sync"

// KVStore is a thread-safe in-memory key-value store.
type KVStore struct {
	// TODO: Add RWMutex and data map
}

// NewKVStore creates a new empty KVStore.
func NewKVStore() *KVStore {
	// TODO
	return nil
}

// Set stores a key-value pair.
func (s *KVStore) Set(key, value string) {
	// TODO: Use write lock
}

// Get retrieves a value by key. Returns ("", false) if not found.
func (s *KVStore) Get(key string) (string, bool) {
	// TODO: Use read lock
	return "", false
}

// Delete removes a key. Returns true if the key existed.
func (s *KVStore) Delete(key string) bool {
	// TODO: Use write lock
	return false
}

// Keys returns all keys in the store.
func (s *KVStore) Keys() []string {
	// TODO: Use read lock
	return nil
}

// Len returns the number of entries.
func (s *KVStore) Len() int {
	// TODO: Use read lock
	return 0
}

var _ = sync.RWMutex{}

func main() {}`,
  testCode: `package main

import (
	"sort"
	"sync"
	"testing"
)

func TestKVSetAndGet(t *testing.T) {
	store := NewKVStore()
	store.Set("name", "Alice")
	store.Set("city", "NYC")

	val, ok := store.Get("name")
	if !ok || val != "Alice" {
		t.Errorf("Get(name) = (%q, %v), want (Alice, true)", val, ok)
	}

	val, ok = store.Get("city")
	if !ok || val != "NYC" {
		t.Errorf("Get(city) = (%q, %v), want (NYC, true)", val, ok)
	}

	_, ok = store.Get("missing")
	if ok {
		t.Error("Get(missing) should return false")
	}
}

func TestKVOverwrite(t *testing.T) {
	store := NewKVStore()
	store.Set("k", "v1")
	store.Set("k", "v2")
	val, _ := store.Get("k")
	if val != "v2" {
		t.Errorf("after overwrite got %q, want v2", val)
	}
}

func TestKVDelete(t *testing.T) {
	store := NewKVStore()
	store.Set("a", "1")
	if !store.Delete("a") {
		t.Error("Delete(a) should return true")
	}
	if store.Delete("a") {
		t.Error("Delete(a) again should return false")
	}
	_, ok := store.Get("a")
	if ok {
		t.Error("Get(a) after delete should return false")
	}
}

func TestKVKeysAndLen(t *testing.T) {
	store := NewKVStore()
	store.Set("x", "1")
	store.Set("y", "2")
	store.Set("z", "3")

	if store.Len() != 3 {
		t.Errorf("Len() = %d, want 3", store.Len())
	}

	keys := store.Keys()
	sort.Strings(keys)
	if len(keys) != 3 || keys[0] != "x" || keys[1] != "y" || keys[2] != "z" {
		t.Errorf("Keys() = %v, want [x y z]", keys)
	}
}

func TestKVConcurrent(t *testing.T) {
	store := NewKVStore()
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			key := string(rune('a' + i%26))
			store.Set(key, "val")
			store.Get(key)
			store.Delete(key)
			store.Len()
		}(i)
	}
	wg.Wait()
}`,
  solution: `package main

import "sync"

type KVStore struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewKVStore() *KVStore {
	return &KVStore{data: make(map[string]string)}
}

func (s *KVStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = value
}

func (s *KVStore) Get(key string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	v, ok := s.data[key]
	return v, ok
}

func (s *KVStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.data[key]
	if ok {
		delete(s.data, key)
	}
	return ok
}

func (s *KVStore) Keys() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	keys := make([]string, 0, len(s.data))
	for k := range s.data {
		keys = append(keys, k)
	}
	return keys
}

func (s *KVStore) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}

func main() {}`,
  hints: [
    'Use sync.RWMutex for thread safety. RLock for reads (Get, Keys, Len), Lock for writes (Set, Delete).',
    'Delete should check if the key exists first, delete it, and return whether it existed.',
    'Always defer the Unlock immediately after Lock to prevent deadlocks.',
  ],
}

export default exercise

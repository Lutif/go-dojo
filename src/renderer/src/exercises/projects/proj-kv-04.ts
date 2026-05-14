import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-04',
  title: 'KV Store — TTL & Expiration',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'advanced',
  order: 126,
  description: `Add time-to-live (TTL) support so keys can automatically expire.

Implement a TTLStore struct with:
- NewTTLStore() *TTLStore
- Set(key, value string) — stores with no expiration
- SetWithTTL(key, value string, ttl time.Duration) — expires after ttl
- Get(key string) (string, bool) — returns false for expired keys (lazy deletion)
- Delete(key string) bool
- Len() int — counts only non-expired keys
- CleanUp() int — removes all expired entries, returns the count removed

The store uses lazy deletion: expired keys are removed when accessed via Get, Len, or CleanUp. Thread-safe with sync.RWMutex.`,
  code: `package main

import (
	"sync"
	"time"
)

// --- SafeStore from Step 3 (provided) ---

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

// --- TTL Store ---

// TODO: Define an entry struct with value string and an optional expiration time.
//   Use a *time.Time for expireAt (nil means no expiration).

// TODO: Define TTLStore with a sync.RWMutex and a map[string]entry.

// TODO: Implement NewTTLStore() *TTLStore.

// TODO: Implement Set(key, value string) — no expiration.

// TODO: Implement SetWithTTL(key, value string, ttl time.Duration).

// TODO: Implement Get(key string) (string, bool) — check expiration, lazy delete.

// TODO: Implement Delete(key string) bool.

// TODO: Implement Len() int — only count non-expired entries.

// TODO: Implement CleanUp() int — remove all expired, return count.

// Use time.Now() to check expiration and time.Now().Add(ttl) to set it.

func main() {}
`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestTTLStoreSetAndGet(t *testing.T) {
	s := NewTTLStore()
	s.Set("name", "Go")
	val, ok := s.Get("name")
	if !ok || val != "Go" {
		t.Fatalf("expected (Go, true), got (%s, %v)", val, ok)
	}
}

func TestTTLStoreSetWithTTL(t *testing.T) {
	s := NewTTLStore()
	s.SetWithTTL("temp", "data", 100*time.Millisecond)

	val, ok := s.Get("temp")
	if !ok || val != "data" {
		t.Fatalf("before expiry expected (data, true), got (%s, %v)", val, ok)
	}

	time.Sleep(150 * time.Millisecond)

	_, ok = s.Get("temp")
	if ok {
		t.Fatal("expected expired key to return false")
	}
}

func TestTTLStoreNoExpiry(t *testing.T) {
	s := NewTTLStore()
	s.Set("forever", "value")
	time.Sleep(50 * time.Millisecond)
	val, ok := s.Get("forever")
	if !ok || val != "value" {
		t.Fatalf("key with no TTL should not expire, got (%s, %v)", val, ok)
	}
}

func TestTTLStoreDelete(t *testing.T) {
	s := NewTTLStore()
	s.Set("x", "1")
	if !s.Delete("x") {
		t.Fatal("Delete existing should return true")
	}
	if s.Delete("x") {
		t.Fatal("Delete missing should return false")
	}
}

func TestTTLStoreLenExcludesExpired(t *testing.T) {
	s := NewTTLStore()
	s.Set("a", "1")
	s.SetWithTTL("b", "2", 50*time.Millisecond)
	s.Set("c", "3")

	if s.Len() != 3 {
		t.Fatalf("expected 3, got %d", s.Len())
	}

	time.Sleep(100 * time.Millisecond)

	if s.Len() != 2 {
		t.Fatalf("expected 2 after expiry, got %d", s.Len())
	}
}

func TestTTLStoreCleanUp(t *testing.T) {
	s := NewTTLStore()
	s.SetWithTTL("e1", "v1", 50*time.Millisecond)
	s.SetWithTTL("e2", "v2", 50*time.Millisecond)
	s.Set("keep", "v3")

	time.Sleep(100 * time.Millisecond)

	removed := s.CleanUp()
	if removed != 2 {
		t.Fatalf("expected 2 removed, got %d", removed)
	}
	if s.Len() != 1 {
		t.Fatalf("expected 1 remaining, got %d", s.Len())
	}
}

func TestTTLStoreOverwriteResetsExpiry(t *testing.T) {
	s := NewTTLStore()
	s.SetWithTTL("k", "v1", 50*time.Millisecond)
	s.Set("k", "v2") // overwrite with no expiry

	time.Sleep(100 * time.Millisecond)

	val, ok := s.Get("k")
	if !ok || val != "v2" {
		t.Fatalf("overwrite should clear TTL, got (%s, %v)", val, ok)
	}
}

func TestTTLStoreCleanUpNoneExpired(t *testing.T) {
	s := NewTTLStore()
	s.Set("a", "1")
	s.Set("b", "2")
	removed := s.CleanUp()
	if removed != 0 {
		t.Fatalf("expected 0 removed, got %d", removed)
	}
}
`,
  solution: `package main

import (
	"sync"
	"time"
)

// --- SafeStore from Step 3 ---

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

// --- TTL Store ---

type entry struct {
	value    string
	expireAt *time.Time
}

type TTLStore struct {
	mu   sync.RWMutex
	data map[string]entry
}

func NewTTLStore() *TTLStore {
	return &TTLStore{data: make(map[string]entry)}
}

func (s *TTLStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = entry{value: value}
}

func (s *TTLStore) SetWithTTL(key, value string, ttl time.Duration) {
	s.mu.Lock()
	defer s.mu.Unlock()
	exp := time.Now().Add(ttl)
	s.data[key] = entry{value: value, expireAt: &exp}
}

func (s *TTLStore) Get(key string) (string, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	e, ok := s.data[key]
	if !ok {
		return "", false
	}
	if e.expireAt != nil && time.Now().After(*e.expireAt) {
		delete(s.data, key)
		return "", false
	}
	return e.value, true
}

func (s *TTLStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *TTLStore) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	count := 0
	now := time.Now()
	for _, e := range s.data {
		if e.expireAt == nil || now.Before(*e.expireAt) {
			count++
		}
	}
	return count
}

func (s *TTLStore) CleanUp() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	removed := 0
	now := time.Now()
	for k, e := range s.data {
		if e.expireAt != nil && now.After(*e.expireAt) {
			delete(s.data, k)
			removed++
		}
	}
	return removed
}

func main() {}
`,
  hints: [
    'Define an entry struct with value string and expireAt *time.Time (nil means no expiry).',
    'In Get, check if expireAt is non-nil and time.Now().After(*expireAt) — if so, delete the key and return false.',
    'For SetWithTTL, compute exp := time.Now().Add(ttl) and store &exp.',
    'Len must iterate and count only non-expired entries. CleanUp iterates and deletes expired ones.',
    'Use a full Lock (not RLock) in Get since lazy deletion mutates the map.',
  ],
  projectId: 'proj-kv',
  step: 4,
  totalSteps: 8,
}

export default exercise

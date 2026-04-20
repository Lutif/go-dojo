import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_02_kv_ttl',
  title: 'KV Store with TTL',
  category: 'Data & Storage',
  subcategory: 'Key-Value Stores',
  difficulty: 'intermediate',
  order: 2,
  description: `Add time-to-live (TTL) expiration to key-value entries. TTL allows automatic cleanup of stale data, essential for caches and session storage.

Each entry stores its value alongside an expiration timestamp. On \`Get\`, if the entry has expired, it should be deleted and treated as missing:

\`\`\`
type entry struct {
    value     string
    expiresAt time.Time
}
\`\`\`

\`Set(key, value, ttl)\` stores the value with an expiration of \`time.Now().Add(ttl)\`. \`Get(key)\` checks whether the entry exists and has not expired. If expired, the entry is removed and \`("", false)\` is returned.

Implement a \`TTLStore\` with:
- \`NewTTLStore()\` - creates an empty store
- \`Set(key, value string, ttl time.Duration)\` - stores a value with expiration
- \`Get(key string) (string, bool)\` - retrieves a value if not expired
- \`Delete(key string) bool\` - removes a key, returns true if it existed
- \`Len() int\` - returns count of non-expired entries
- \`Cleanup()\` - removes all expired entries`,
  code: `package main

import (
	"sync"
	"time"
)

type entry struct {
	value     string
	expiresAt time.Time
}

// TTLStore is a key-value store where entries expire after a TTL.
type TTLStore struct {
	// TODO: Add mutex and data map
}

// NewTTLStore creates a new empty TTLStore.
func NewTTLStore() *TTLStore {
	// TODO
	return nil
}

// Set stores a key-value pair that expires after the given TTL.
func (s *TTLStore) Set(key, value string, ttl time.Duration) {
	// TODO: Store value with expiration time
}

// Get retrieves a value by key. Returns ("", false) if not found or expired.
// Expired entries should be deleted on access.
func (s *TTLStore) Get(key string) (string, bool) {
	// TODO: Check existence and expiration
	return "", false
}

// Delete removes a key. Returns true if the key existed (even if expired).
func (s *TTLStore) Delete(key string) bool {
	// TODO
	return false
}

// Len returns the number of non-expired entries.
func (s *TTLStore) Len() int {
	// TODO: Count only entries that haven't expired
	return 0
}

// Cleanup removes all expired entries from the store.
func (s *TTLStore) Cleanup() {
	// TODO: Iterate and remove expired entries
}

// Prevent unused import errors
var _ = sync.Mutex{}
var _ = time.Now

func main() {}`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestTTLSetAndGet(t *testing.T) {
	store := NewTTLStore()
	store.Set("name", "Alice", 1*time.Hour)

	val, ok := store.Get("name")
	if !ok || val != "Alice" {
		t.Errorf("Get(name) = (%q, %v), want (Alice, true)", val, ok)
	}
}

func TestTTLMissing(t *testing.T) {
	store := NewTTLStore()
	_, ok := store.Get("missing")
	if ok {
		t.Error("Get(missing) should return false")
	}
}

func TestTTLExpiration(t *testing.T) {
	store := NewTTLStore()
	store.Set("fast", "gone", 1*time.Millisecond)
	time.Sleep(5 * time.Millisecond)

	_, ok := store.Get("fast")
	if ok {
		t.Error("Get(fast) should return false after expiration")
	}
}

func TestTTLNotExpired(t *testing.T) {
	store := NewTTLStore()
	store.Set("slow", "here", 1*time.Hour)

	val, ok := store.Get("slow")
	if !ok || val != "here" {
		t.Errorf("Get(slow) = (%q, %v), want (here, true)", val, ok)
	}
}

func TestTTLOverwrite(t *testing.T) {
	store := NewTTLStore()
	store.Set("k", "v1", 1*time.Millisecond)
	time.Sleep(5 * time.Millisecond)
	store.Set("k", "v2", 1*time.Hour)

	val, ok := store.Get("k")
	if !ok || val != "v2" {
		t.Errorf("after overwrite got (%q, %v), want (v2, true)", val, ok)
	}
}

func TestTTLDelete(t *testing.T) {
	store := NewTTLStore()
	store.Set("a", "1", 1*time.Hour)
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

func TestTTLLen(t *testing.T) {
	store := NewTTLStore()
	store.Set("a", "1", 1*time.Hour)
	store.Set("b", "2", 1*time.Hour)
	store.Set("c", "3", 1*time.Millisecond)
	time.Sleep(5 * time.Millisecond)

	if l := store.Len(); l != 2 {
		t.Errorf("Len() = %d, want 2 (one expired)", l)
	}
}

func TestTTLCleanup(t *testing.T) {
	store := NewTTLStore()
	store.Set("a", "1", 1*time.Millisecond)
	store.Set("b", "2", 1*time.Millisecond)
	store.Set("c", "3", 1*time.Hour)
	time.Sleep(5 * time.Millisecond)

	store.Cleanup()
	if l := store.Len(); l != 1 {
		t.Errorf("after Cleanup Len() = %d, want 1", l)
	}
	val, ok := store.Get("c")
	if !ok || val != "3" {
		t.Error("non-expired entry should survive cleanup")
	}
}`,
  solution: `package main

import (
	"sync"
	"time"
)

type entry struct {
	value     string
	expiresAt time.Time
}

type TTLStore struct {
	mu   sync.Mutex
	data map[string]entry
}

func NewTTLStore() *TTLStore {
	return &TTLStore{data: make(map[string]entry)}
}

func (s *TTLStore) Set(key, value string, ttl time.Duration) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = entry{value: value, expiresAt: time.Now().Add(ttl)}
}

func (s *TTLStore) Get(key string) (string, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	e, ok := s.data[key]
	if !ok {
		return "", false
	}
	if time.Now().After(e.expiresAt) {
		delete(s.data, key)
		return "", false
	}
	return e.value, true
}

func (s *TTLStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.data[key]
	if ok {
		delete(s.data, key)
	}
	return ok
}

func (s *TTLStore) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	count := 0
	for _, e := range s.data {
		if now.Before(e.expiresAt) {
			count++
		}
	}
	return count
}

func (s *TTLStore) Cleanup() {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	for k, e := range s.data {
		if now.After(e.expiresAt) {
			delete(s.data, k)
		}
	}
}

func main() {}`,
  hints: [
    'Store each value as a struct containing the value and an expiration time (time.Time).',
    'In Get, check if time.Now().After(entry.expiresAt). If so, delete the key and return ("", false).',
    'For Len, iterate all entries and only count those where time.Now() is before expiresAt.',
  ],
}

export default exercise

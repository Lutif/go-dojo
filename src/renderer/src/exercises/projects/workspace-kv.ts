import { WorkspaceProject } from '../../types'

const project: WorkspaceProject = {
  projectId: 'proj-kv',
  title: 'Key-Value Store',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  order: 123,
  difficulty: 'advanced',
  workspaceScaffold: {
    goMod: 'module kvstore\n\ngo 1.21\n',
    files: [
      {
        name: 'store.go',
        content: `package main

// TODO: Define a Store struct backed by a map.

// TODO: Implement NewStore() *Store.

// TODO: Implement Set(key, value string).

// TODO: Implement Get(key string) (string, bool).

// TODO: Implement Delete(key string) bool.

// TODO: Implement Len() int.

func main() {}
`,
      },
    ],
    testFiles: [],
  },
  steps: [
    {
      id: 'proj-kv-01',
      title: 'In-Memory Store',
      difficulty: 'intermediate',
      description: `Build the core of an in-memory key-value store.

Implement a Store struct with:
- NewStore() *Store: create a new empty store
- Set(key, value string): store a key-value pair (overwrite if exists)
- Get(key string) (string, bool): retrieve a value by key
- Delete(key string) bool: remove a key, return true if it existed
- Len() int: return the number of stored keys

This is the foundation — later steps add thread safety, TTL, eviction, and persistence.`,
      testFiles: [
        {
          name: 'step01_test.go',
          content: `package main

import "testing"

func TestStoreSetAndGet(t *testing.T) {
	s := NewStore()
	s.Set("name", "Go")
	val, ok := s.Get("name")
	if !ok || val != "Go" {
		t.Fatalf("expected (Go, true), got (%s, %v)", val, ok)
	}
}

func TestStoreGetMissing(t *testing.T) {
	s := NewStore()
	_, ok := s.Get("nope")
	if ok {
		t.Fatal("expected Get on missing key to return false")
	}
}

func TestStoreOverwrite(t *testing.T) {
	s := NewStore()
	s.Set("k", "v1")
	s.Set("k", "v2")
	val, ok := s.Get("k")
	if !ok || val != "v2" {
		t.Fatalf("expected overwritten value v2, got %s", val)
	}
	if s.Len() != 1 {
		t.Fatalf("overwrite should not increase Len, got %d", s.Len())
	}
}

func TestStoreDelete(t *testing.T) {
	s := NewStore()
	s.Set("x", "1")
	if !s.Delete("x") {
		t.Fatal("Delete existing key should return true")
	}
	if s.Delete("x") {
		t.Fatal("Delete missing key should return false")
	}
	_, ok := s.Get("x")
	if ok {
		t.Fatal("Get after Delete should return false")
	}
}

func TestStoreLen(t *testing.T) {
	s := NewStore()
	if s.Len() != 0 {
		t.Fatalf("empty store Len should be 0, got %d", s.Len())
	}
	s.Set("a", "1")
	s.Set("b", "2")
	s.Set("c", "3")
	if s.Len() != 3 {
		t.Fatalf("expected Len 3, got %d", s.Len())
	}
	s.Delete("b")
	if s.Len() != 2 {
		t.Fatalf("expected Len 2 after delete, got %d", s.Len())
	}
}

func TestStoreEmptyKeyAndValue(t *testing.T) {
	s := NewStore()
	s.Set("", "empty-key")
	val, ok := s.Get("")
	if !ok || val != "empty-key" {
		t.Fatalf("empty key should work, got (%s, %v)", val, ok)
	}
	s.Set("empty-val", "")
	val, ok = s.Get("empty-val")
	if !ok || val != "" {
		t.Fatalf("empty value should work, got (%s, %v)", val, ok)
	}
}
`,
        },
      ],
      hints: [
        'Use a map[string]string as the backing data structure.',
        'Get can use the two-value map lookup: val, ok := m[key].',
        'Delete should check existence before calling delete() to return the correct bool.',
        'Len just returns len(s.data).',
      ],
      solution: `package main

type Store struct {
	data map[string]string
}

func NewStore() *Store {
	return &Store{data: make(map[string]string)}
}

func (s *Store) Set(key, value string) {
	s.data[key] = value
}

func (s *Store) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

func (s *Store) Delete(key string) bool {
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *Store) Len() int {
	return len(s.data)
}

func main() {}
`,
      requires: [],
    },
    {
      id: 'proj-kv-02',
      title: 'Command Protocol',
      difficulty: 'intermediate',
      description: `Add a text protocol parser so the store can be driven by string commands.

Implement an Execute function:
- Execute(store *Store, command string) string

Supported commands (case-sensitive):
- "SET key value" → sets the key, returns "OK"
- "GET key" → returns the value, or "ERROR: key not found"
- "DEL key" → deletes the key, returns "OK" if deleted, "ERROR: key not found" if missing
- "LEN" → returns the count as a string (e.g. "3")
- Unknown commands → "ERROR: unknown command"

Commands have exactly the right number of space-separated tokens. Extra or missing tokens return "ERROR: wrong number of arguments".`,
      testFiles: [
        {
          name: 'step02_test.go',
          content: `package main

import "testing"

func TestExecuteSet(t *testing.T) {
	s := NewStore()
	result := Execute(s, "SET name Go")
	if result != "OK" {
		t.Fatalf("SET should return OK, got %q", result)
	}
	val, ok := s.Get("name")
	if !ok || val != "Go" {
		t.Fatalf("after SET, Get should return Go, got (%s, %v)", val, ok)
	}
}

func TestExecuteGet(t *testing.T) {
	s := NewStore()
	s.Set("lang", "Go")
	result := Execute(s, "GET lang")
	if result != "Go" {
		t.Fatalf("GET should return Go, got %q", result)
	}
}

func TestExecuteGetMissing(t *testing.T) {
	s := NewStore()
	result := Execute(s, "GET nope")
	if result != "ERROR: key not found" {
		t.Fatalf("GET missing key should return error, got %q", result)
	}
}

func TestExecuteDel(t *testing.T) {
	s := NewStore()
	s.Set("x", "1")
	result := Execute(s, "DEL x")
	if result != "OK" {
		t.Fatalf("DEL existing should return OK, got %q", result)
	}
	result = Execute(s, "DEL x")
	if result != "ERROR: key not found" {
		t.Fatalf("DEL missing should return error, got %q", result)
	}
}

func TestExecuteLen(t *testing.T) {
	s := NewStore()
	s.Set("a", "1")
	s.Set("b", "2")
	result := Execute(s, "LEN")
	if result != "2" {
		t.Fatalf("LEN should return 2, got %q", result)
	}
}

func TestExecuteUnknown(t *testing.T) {
	s := NewStore()
	result := Execute(s, "PING")
	if result != "ERROR: unknown command" {
		t.Fatalf("unknown command should return error, got %q", result)
	}
}

func TestExecuteWrongArgs(t *testing.T) {
	s := NewStore()
	tests := []string{
		"SET key",
		"SET",
		"GET",
		"DEL",
		"SET a b c",
		"GET a b",
		"DEL a b",
		"LEN extra",
	}
	for _, cmd := range tests {
		result := Execute(s, cmd)
		if result != "ERROR: wrong number of arguments" {
			t.Fatalf("command %q should return wrong args error, got %q", cmd, result)
		}
	}
}

func TestExecuteOverwrite(t *testing.T) {
	s := NewStore()
	Execute(s, "SET k v1")
	Execute(s, "SET k v2")
	result := Execute(s, "GET k")
	if result != "v2" {
		t.Fatalf("SET should overwrite, expected v2, got %q", result)
	}
}
`,
        },
      ],
      hints: [
        'Use strings.Fields(command) to split on whitespace.',
        'Switch on parts[0] to dispatch to the right operation.',
        'Check len(parts) for each command to validate argument count before proceeding.',
        'Use fmt.Sprintf("%d", n) to convert Len() result to string.',
      ],
      solution: `package main

import (
	"fmt"
	"strings"
)

type Store struct {
	data map[string]string
}

func NewStore() *Store {
	return &Store{data: make(map[string]string)}
}

func (s *Store) Set(key, value string) {
	s.data[key] = value
}

func (s *Store) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

func (s *Store) Delete(key string) bool {
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *Store) Len() int {
	return len(s.data)
}

func Execute(store *Store, command string) string {
	parts := strings.Fields(command)
	if len(parts) == 0 {
		return "ERROR: unknown command"
	}

	switch parts[0] {
	case "SET":
		if len(parts) != 3 {
			return "ERROR: wrong number of arguments"
		}
		store.Set(parts[1], parts[2])
		return "OK"
	case "GET":
		if len(parts) != 2 {
			return "ERROR: wrong number of arguments"
		}
		val, ok := store.Get(parts[1])
		if !ok {
			return "ERROR: key not found"
		}
		return val
	case "DEL":
		if len(parts) != 2 {
			return "ERROR: wrong number of arguments"
		}
		if !store.Delete(parts[1]) {
			return "ERROR: key not found"
		}
		return "OK"
	case "LEN":
		if len(parts) != 1 {
			return "ERROR: wrong number of arguments"
		}
		return fmt.Sprintf("%d", store.Len())
	default:
		return "ERROR: unknown command"
	}
}

func main() {}
`,
      requires: ['proj-kv-01'],
    },
    {
      id: 'proj-kv-03',
      title: 'Thread-Safe with RWMutex',
      difficulty: 'intermediate',
      description: `Make the store safe for concurrent access using sync.RWMutex.

Implement a SafeStore struct with the same API as Store:
- NewSafeStore() *SafeStore
- Set(key, value string)
- Get(key string) (string, bool)
- Delete(key string) bool
- Len() int

Use a read-write mutex so multiple goroutines can read simultaneously, but writes are exclusive. Get and Len take a read lock; Set and Delete take a write lock.

The tests will hammer the store from multiple goroutines concurrently.`,
      testFiles: [
        {
          name: 'step03_test.go',
          content: `package main

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
        },
      ],
      hints: [
        'Embed a sync.RWMutex as a field in your struct (not a pointer).',
        'Use mu.Lock()/mu.Unlock() for writes (Set, Delete) and mu.RLock()/mu.RUnlock() for reads (Get, Len).',
        'Always defer the unlock immediately after locking to prevent deadlocks on early returns.',
        'RWMutex allows multiple concurrent readers but only one writer — this is ideal for read-heavy workloads.',
      ],
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
      requires: ['proj-kv-01'],
    },
    {
      id: 'proj-kv-04',
      title: 'TTL & Expiration',
      difficulty: 'advanced',
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
      testFiles: [
        {
          name: 'step04_test.go',
          content: `package main

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
        },
      ],
      hints: [
        'Define an entry struct with value string and expireAt *time.Time (nil means no expiry).',
        'In Get, check if expireAt is non-nil and time.Now().After(*expireAt) — if so, delete the key and return false.',
        'For SetWithTTL, compute exp := time.Now().Add(ttl) and store &exp.',
        'Len must iterate and count only non-expired entries. CleanUp iterates and deletes expired ones.',
        'Use a full Lock (not RLock) in Get since lazy deletion mutates the map.',
      ],
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
      requires: ['proj-kv-01'],
    },
    {
      id: 'proj-kv-05',
      title: 'LRU Eviction',
      difficulty: 'advanced',
      description: `Implement a least-recently-used (LRU) cache with a fixed maximum capacity.

Build an LRUCache struct with:
- NewLRUCache(capacity int) *LRUCache
- Set(key, value string) — add or update; evicts the least-recently-used entry if at capacity
- Get(key string) (string, bool) — returns the value and marks it as recently used
- Len() int — current number of entries
- Evictions() int — total number of evictions that have occurred

Use container/list (a doubly-linked list) plus a map for O(1) lookups and eviction. Each list element holds the key-value pair. The most-recently-used item is at the front; the least-recently-used is at the back.

On Get: move the accessed element to the front.
On Set: if the key exists, update and move to front. If new and at capacity, remove the back element before inserting at front.`,
      testFiles: [
        {
          name: 'step05_test.go',
          content: `package main

import (
	"fmt"
	"testing"
)

func TestLRUCacheBasic(t *testing.T) {
	c := NewLRUCache(3)
	c.Set("a", "1")
	c.Set("b", "2")
	c.Set("c", "3")

	val, ok := c.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected (1, true), got (%s, %v)", val, ok)
	}
	if c.Len() != 3 {
		t.Fatalf("expected len 3, got %d", c.Len())
	}
}

func TestLRUCacheEviction(t *testing.T) {
	c := NewLRUCache(2)
	c.Set("a", "1")
	c.Set("b", "2")
	c.Set("c", "3") // should evict "a"

	_, ok := c.Get("a")
	if ok {
		t.Fatal("expected 'a' to be evicted")
	}
	val, ok := c.Get("c")
	if !ok || val != "3" {
		t.Fatalf("expected (3, true), got (%s, %v)", val, ok)
	}
	if c.Evictions() != 1 {
		t.Fatalf("expected 1 eviction, got %d", c.Evictions())
	}
}

func TestLRUCacheGetRefreshesRecency(t *testing.T) {
	c := NewLRUCache(2)
	c.Set("a", "1")
	c.Set("b", "2")
	c.Get("a")          // "a" is now most recent
	c.Set("c", "3")     // should evict "b", not "a"

	_, ok := c.Get("b")
	if ok {
		t.Fatal("expected 'b' to be evicted after 'a' was accessed")
	}
	val, ok := c.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected 'a' to survive, got (%s, %v)", val, ok)
	}
}

func TestLRUCacheUpdateExisting(t *testing.T) {
	c := NewLRUCache(2)
	c.Set("a", "1")
	c.Set("b", "2")
	c.Set("a", "updated") // update, should not evict

	if c.Len() != 2 {
		t.Fatalf("expected len 2 after update, got %d", c.Len())
	}
	val, ok := c.Get("a")
	if !ok || val != "updated" {
		t.Fatalf("expected updated value, got (%s, %v)", val, ok)
	}
	if c.Evictions() != 0 {
		t.Fatalf("update should not cause eviction, got %d", c.Evictions())
	}
}

func TestLRUCacheEvictionOrder(t *testing.T) {
	c := NewLRUCache(3)
	c.Set("a", "1")
	c.Set("b", "2")
	c.Set("c", "3")
	c.Set("d", "4") // evicts "a"
	c.Set("e", "5") // evicts "b"

	if c.Evictions() != 2 {
		t.Fatalf("expected 2 evictions, got %d", c.Evictions())
	}

	for _, key := range []string{"a", "b"} {
		if _, ok := c.Get(key); ok {
			t.Fatalf("expected %q to be evicted", key)
		}
	}
	for _, key := range []string{"c", "d", "e"} {
		if _, ok := c.Get(key); !ok {
			t.Fatalf("expected %q to still exist", key)
		}
	}
}

func TestLRUCacheCapacityOne(t *testing.T) {
	c := NewLRUCache(1)
	c.Set("a", "1")
	c.Set("b", "2")

	if _, ok := c.Get("a"); ok {
		t.Fatal("expected 'a' to be evicted in capacity-1 cache")
	}
	val, ok := c.Get("b")
	if !ok || val != "2" {
		t.Fatalf("expected (2, true), got (%s, %v)", val, ok)
	}
}

func TestLRUCacheGetMissing(t *testing.T) {
	c := NewLRUCache(5)
	_, ok := c.Get("nope")
	if ok {
		t.Fatal("Get on missing key should return false")
	}
}

func TestLRUCacheManyEvictions(t *testing.T) {
	c := NewLRUCache(10)
	for i := 0; i < 100; i++ {
		c.Set(fmt.Sprintf("k%d", i), fmt.Sprintf("v%d", i))
	}
	if c.Len() != 10 {
		t.Fatalf("expected len 10, got %d", c.Len())
	}
	if c.Evictions() != 90 {
		t.Fatalf("expected 90 evictions, got %d", c.Evictions())
	}
}
`,
        },
      ],
      hints: [
        'Use container/list.New() for a doubly-linked list and a map[string]*list.Element for O(1) lookup.',
        'Store a struct with both key and value in each list element — you need the key when evicting from the back.',
        'On Set with existing key: update the value and call list.MoveToFront(elem).',
        'On Set at capacity: remove list.Back(), delete its key from the map, then insert the new entry at front.',
        'On Get: move the element to front with MoveToFront to mark it as recently used.',
      ],
      solution: `package main

import (
	"container/list"
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

// --- TTLStore from Step 4 ---

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

// --- LRU Cache ---

type cacheEntry struct {
	key   string
	value string
}

type LRUCache struct {
	capacity  int
	evictions int
	order     *list.List
	items     map[string]*list.Element
}

func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{
		capacity: capacity,
		order:    list.New(),
		items:    make(map[string]*list.Element),
	}
}

func (c *LRUCache) Set(key, value string) {
	if elem, ok := c.items[key]; ok {
		c.order.MoveToFront(elem)
		elem.Value.(*cacheEntry).value = value
		return
	}
	if c.order.Len() >= c.capacity {
		back := c.order.Back()
		c.order.Remove(back)
		delete(c.items, back.Value.(*cacheEntry).key)
		c.evictions++
	}
	elem := c.order.PushFront(&cacheEntry{key: key, value: value})
	c.items[key] = elem
}

func (c *LRUCache) Get(key string) (string, bool) {
	elem, ok := c.items[key]
	if !ok {
		return "", false
	}
	c.order.MoveToFront(elem)
	return elem.Value.(*cacheEntry).value, true
}

func (c *LRUCache) Len() int {
	return c.order.Len()
}

func (c *LRUCache) Evictions() int {
	return c.evictions
}

func main() {}
`,
      requires: ['proj-kv-04'],
    },
    {
      id: 'proj-kv-06',
      title: 'Persistence (Save/Load)',
      difficulty: 'advanced',
      description: `Add file-based persistence so the store survives restarts.

Implement a FileStore struct with:
- NewFileStore(path string) (*FileStore, error) — creates a store backed by a file; loads existing data if the file exists
- Set(key, value string) error — stores a key-value pair (returns error if save fails)
- Get(key string) (string, bool) — retrieves a value by key
- Delete(key string) bool — removes a key
- Len() int — number of stored keys
- Save() error — writes the full store to disk as a JSON snapshot
- Close() error — saves and releases resources

The JSON format on disk is: {"data":{"key":"value",...}}

On construction, if the file exists and is non-empty, load data from it. If the file doesn't exist, start with an empty store. Save writes the entire map atomically.

Use encoding/json and os for file I/O. Tests use t.TempDir() for isolated file paths.`,
      testFiles: [
        {
          name: 'step06_test.go',
          content: `package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFileStoreNewEmpty(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	fs, err := NewFileStore(path)
	if err != nil {
		t.Fatalf("NewFileStore failed: %v", err)
	}
	if fs.Len() != 0 {
		t.Fatalf("new store should be empty, got %d", fs.Len())
	}
}

func TestFileStoreSetAndGet(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	fs, err := NewFileStore(path)
	if err != nil {
		t.Fatalf("NewFileStore failed: %v", err)
	}

	if err := fs.Set("lang", "Go"); err != nil {
		t.Fatalf("Set failed: %v", err)
	}
	val, ok := fs.Get("lang")
	if !ok || val != "Go" {
		t.Fatalf("expected (Go, true), got (%s, %v)", val, ok)
	}
}

func TestFileStoreSaveAndReload(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	fs1, _ := NewFileStore(path)
	fs1.Set("a", "1")
	fs1.Set("b", "2")
	if err := fs1.Save(); err != nil {
		t.Fatalf("Save failed: %v", err)
	}

	// Open a second store from the same file
	fs2, err := NewFileStore(path)
	if err != nil {
		t.Fatalf("reload failed: %v", err)
	}
	if fs2.Len() != 2 {
		t.Fatalf("expected 2 keys after reload, got %d", fs2.Len())
	}
	val, ok := fs2.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected (1, true) after reload, got (%s, %v)", val, ok)
	}
}

func TestFileStoreClose(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	fs1, _ := NewFileStore(path)
	fs1.Set("key", "value")
	if err := fs1.Close(); err != nil {
		t.Fatalf("Close failed: %v", err)
	}

	// Verify data was persisted
	fs2, _ := NewFileStore(path)
	val, ok := fs2.Get("key")
	if !ok || val != "value" {
		t.Fatalf("expected data to persist after Close, got (%s, %v)", val, ok)
	}
}

func TestFileStoreDelete(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	fs, _ := NewFileStore(path)
	fs.Set("x", "1")
	if !fs.Delete("x") {
		t.Fatal("Delete existing should return true")
	}
	if fs.Delete("x") {
		t.Fatal("Delete missing should return false")
	}
}

func TestFileStoreEmptyFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	// Create an empty file
	os.WriteFile(path, []byte{}, 0644)

	fs, err := NewFileStore(path)
	if err != nil {
		t.Fatalf("should handle empty file gracefully: %v", err)
	}
	if fs.Len() != 0 {
		t.Fatalf("empty file should yield empty store, got %d", fs.Len())
	}
}

func TestFileStoreSaveCreatesFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "new.json")

	fs, _ := NewFileStore(path)
	fs.Set("k", "v")
	fs.Save()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Fatal("Save should create the file")
	}
}

func TestFileStoreOverwrite(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "store.json")

	fs, _ := NewFileStore(path)
	fs.Set("k", "v1")
	fs.Set("k", "v2")
	val, ok := fs.Get("k")
	if !ok || val != "v2" {
		t.Fatalf("expected overwritten value v2, got %s", val)
	}
}
`,
        },
      ],
      hints: [
        'Define a snapshot struct with a Data field and a json:"data" struct tag for serialization.',
        'In NewFileStore, use os.ReadFile — if os.IsNotExist(err), start with an empty map.',
        'For Save, use json.Marshal on the snapshot struct, then os.WriteFile to write it.',
        'Close simply calls Save — this ensures data is persisted when the store is done.',
        'Handle the empty file case: if len(raw) == 0, skip unmarshaling and return an empty store.',
      ],
      solution: `package main

import (
	"container/list"
	"encoding/json"
	"os"
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

// --- TTLStore from Step 4 ---

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

// --- LRUCache from Step 5 ---

type cacheEntry struct {
	key   string
	value string
}

type LRUCache struct {
	capacity  int
	evictions int
	order     *list.List
	items     map[string]*list.Element
}

func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{
		capacity: capacity,
		order:    list.New(),
		items:    make(map[string]*list.Element),
	}
}

func (c *LRUCache) Set(key, value string) {
	if elem, ok := c.items[key]; ok {
		c.order.MoveToFront(elem)
		elem.Value.(*cacheEntry).value = value
		return
	}
	if c.order.Len() >= c.capacity {
		back := c.order.Back()
		c.order.Remove(back)
		delete(c.items, back.Value.(*cacheEntry).key)
		c.evictions++
	}
	elem := c.order.PushFront(&cacheEntry{key: key, value: value})
	c.items[key] = elem
}

func (c *LRUCache) Get(key string) (string, bool) {
	elem, ok := c.items[key]
	if !ok {
		return "", false
	}
	c.order.MoveToFront(elem)
	return elem.Value.(*cacheEntry).value, true
}

func (c *LRUCache) Len() int {
	return c.order.Len()
}

func (c *LRUCache) Evictions() int {
	return c.evictions
}

// --- File Store ---

type snapshot struct {
	Data map[string]string \`json:"data"\`
}

type FileStore struct {
	path string
	data map[string]string
}

func NewFileStore(path string) (*FileStore, error) {
	fs := &FileStore{
		path: path,
		data: make(map[string]string),
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return fs, nil
		}
		return nil, err
	}

	if len(raw) == 0 {
		return fs, nil
	}

	var snap snapshot
	if err := json.Unmarshal(raw, &snap); err != nil {
		return nil, err
	}
	if snap.Data != nil {
		fs.data = snap.Data
	}
	return fs, nil
}

func (fs *FileStore) Set(key, value string) error {
	fs.data[key] = value
	return nil
}

func (fs *FileStore) Get(key string) (string, bool) {
	val, ok := fs.data[key]
	return val, ok
}

func (fs *FileStore) Delete(key string) bool {
	if _, ok := fs.data[key]; !ok {
		return false
	}
	delete(fs.data, key)
	return true
}

func (fs *FileStore) Len() int {
	return len(fs.data)
}

func (fs *FileStore) Save() error {
	snap := snapshot{Data: fs.data}
	raw, err := json.Marshal(snap)
	if err != nil {
		return err
	}
	return os.WriteFile(fs.path, raw, 0644)
}

func (fs *FileStore) Close() error {
	return fs.Save()
}

func main() {}
`,
      requires: ['proj-kv-01'],
    },
    {
      id: 'proj-kv-07',
      title: 'Transaction Batching',
      difficulty: 'advanced',
      description: `Add atomic multi-key transactions to the store.

Implement a TxStore struct with:
- NewTxStore() *TxStore
- Set(key, value string) — direct write (outside any transaction)
- Get(key string) (string, bool) — read from the store
- Delete(key string) bool — direct delete
- Len() int — number of keys
- Begin() *Tx — start a new transaction

And a Tx struct with:
- Tx.Set(key, value string) — stage a write
- Tx.Delete(key string) — stage a delete
- Tx.Commit() — apply all staged operations atomically to the store
- Tx.Rollback() — discard all staged operations

Transactions buffer writes and deletes. Nothing is visible to Get until Commit is called. After Rollback, all pending changes are discarded. The store must be thread-safe.`,
      testFiles: [
        {
          name: 'step07_test.go',
          content: `package main

import (
	"sync"
	"testing"
)

func TestTxStoreBasic(t *testing.T) {
	s := NewTxStore()
	s.Set("a", "1")
	val, ok := s.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected (1, true), got (%s, %v)", val, ok)
	}
}

func TestTxStoreCommit(t *testing.T) {
	s := NewTxStore()
	s.Set("existing", "before")

	tx := s.Begin()
	tx.Set("a", "1")
	tx.Set("b", "2")
	tx.Set("existing", "after")
	tx.Commit()

	val, ok := s.Get("a")
	if !ok || val != "1" {
		t.Fatalf("after commit expected (1, true), got (%s, %v)", val, ok)
	}
	val, ok = s.Get("b")
	if !ok || val != "2" {
		t.Fatalf("after commit expected (2, true), got (%s, %v)", val, ok)
	}
	val, ok = s.Get("existing")
	if !ok || val != "after" {
		t.Fatalf("commit should overwrite, got (%s, %v)", val, ok)
	}
}

func TestTxStoreRollback(t *testing.T) {
	s := NewTxStore()
	s.Set("keep", "value")

	tx := s.Begin()
	tx.Set("a", "1")
	tx.Set("b", "2")
	tx.Delete("keep")
	tx.Rollback()

	if _, ok := s.Get("a"); ok {
		t.Fatal("after rollback, 'a' should not exist")
	}
	if _, ok := s.Get("b"); ok {
		t.Fatal("after rollback, 'b' should not exist")
	}
	val, ok := s.Get("keep")
	if !ok || val != "value" {
		t.Fatalf("rollback should preserve existing data, got (%s, %v)", val, ok)
	}
}

func TestTxStoreDeleteInTx(t *testing.T) {
	s := NewTxStore()
	s.Set("x", "1")
	s.Set("y", "2")

	tx := s.Begin()
	tx.Delete("x")
	tx.Set("z", "3")
	tx.Commit()

	if _, ok := s.Get("x"); ok {
		t.Fatal("'x' should be deleted after commit")
	}
	val, ok := s.Get("z")
	if !ok || val != "3" {
		t.Fatalf("expected (3, true), got (%s, %v)", val, ok)
	}
	if s.Len() != 2 {
		t.Fatalf("expected len 2, got %d", s.Len())
	}
}

func TestTxStoreIsolation(t *testing.T) {
	s := NewTxStore()
	s.Set("visible", "yes")

	tx := s.Begin()
	tx.Set("pending", "not-yet")

	// Before commit, pending should not be visible
	if _, ok := s.Get("pending"); ok {
		t.Fatal("uncommitted writes should not be visible")
	}
}

func TestTxStoreConcurrentTransactions(t *testing.T) {
	s := NewTxStore()

	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			tx := s.Begin()
			key := "k" + string(rune('0'+n))
			tx.Set(key, "v")
			tx.Commit()
		}(i)
	}
	wg.Wait()

	if s.Len() != 10 {
		t.Fatalf("expected 10 keys after concurrent txns, got %d", s.Len())
	}
}

func TestTxStoreMultipleOpsOnSameKey(t *testing.T) {
	s := NewTxStore()

	tx := s.Begin()
	tx.Set("k", "v1")
	tx.Set("k", "v2")
	tx.Set("k", "v3")
	tx.Commit()

	val, ok := s.Get("k")
	if !ok || val != "v3" {
		t.Fatalf("expected last Set to win, got (%s, %v)", val, ok)
	}
}

func TestTxStoreDeleteNonExistent(t *testing.T) {
	s := NewTxStore()

	if s.Delete("nope") {
		t.Fatal("Delete non-existent should return false")
	}
}
`,
        },
      ],
      hints: [
        'Define a txOp struct with opType ("set" or "delete"), key, and value fields.',
        'Tx.Set and Tx.Delete just append to the ops slice - no lock needed yet.',
        'Tx.Commit acquires the store write lock and applies all ops in order, then clears the slice.',
        'Tx.Rollback simply sets ops to nil - nothing was written to the store.',
        'The TxStore itself uses sync.RWMutex just like SafeStore for its direct Set/Get/Delete/Len methods.',
      ],
      solution: `package main

import (
	"container/list"
	"encoding/json"
	"os"
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

// --- TTLStore from Step 4 ---

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

// --- LRUCache from Step 5 ---

type cacheEntry struct {
	key   string
	value string
}

type LRUCache struct {
	capacity  int
	evictions int
	order     *list.List
	items     map[string]*list.Element
}

func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{
		capacity: capacity,
		order:    list.New(),
		items:    make(map[string]*list.Element),
	}
}

func (c *LRUCache) Set(key, value string) {
	if elem, ok := c.items[key]; ok {
		c.order.MoveToFront(elem)
		elem.Value.(*cacheEntry).value = value
		return
	}
	if c.order.Len() >= c.capacity {
		back := c.order.Back()
		c.order.Remove(back)
		delete(c.items, back.Value.(*cacheEntry).key)
		c.evictions++
	}
	elem := c.order.PushFront(&cacheEntry{key: key, value: value})
	c.items[key] = elem
}

func (c *LRUCache) Get(key string) (string, bool) {
	elem, ok := c.items[key]
	if !ok {
		return "", false
	}
	c.order.MoveToFront(elem)
	return elem.Value.(*cacheEntry).value, true
}

func (c *LRUCache) Len() int {
	return c.order.Len()
}

func (c *LRUCache) Evictions() int {
	return c.evictions
}

// --- FileStore from Step 6 ---

type snapshot struct {
	Data map[string]string \`json:"data"\`
}

type FileStore struct {
	path string
	data map[string]string
}

func NewFileStore(path string) (*FileStore, error) {
	fs := &FileStore{path: path, data: make(map[string]string)}
	raw, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return fs, nil
		}
		return nil, err
	}
	if len(raw) == 0 {
		return fs, nil
	}
	var snap snapshot
	if err := json.Unmarshal(raw, &snap); err != nil {
		return nil, err
	}
	if snap.Data != nil {
		fs.data = snap.Data
	}
	return fs, nil
}

func (fs *FileStore) Set(key, value string) error {
	fs.data[key] = value
	return nil
}

func (fs *FileStore) Get(key string) (string, bool) {
	val, ok := fs.data[key]
	return val, ok
}

func (fs *FileStore) Delete(key string) bool {
	if _, ok := fs.data[key]; !ok {
		return false
	}
	delete(fs.data, key)
	return true
}

func (fs *FileStore) Len() int {
	return len(fs.data)
}

func (fs *FileStore) Save() error {
	snap := snapshot{Data: fs.data}
	raw, err := json.Marshal(snap)
	if err != nil {
		return err
	}
	return os.WriteFile(fs.path, raw, 0644)
}

func (fs *FileStore) Close() error {
	return fs.Save()
}

// --- Transaction Store ---

type txOp struct {
	opType string
	key    string
	value  string
}

type TxStore struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewTxStore() *TxStore {
	return &TxStore{data: make(map[string]string)}
}

func (s *TxStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = value
}

func (s *TxStore) Get(key string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, ok := s.data[key]
	return val, ok
}

func (s *TxStore) Delete(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.data[key]; !ok {
		return false
	}
	delete(s.data, key)
	return true
}

func (s *TxStore) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}

func (s *TxStore) Begin() *Tx {
	return &Tx{store: s}
}

type Tx struct {
	store *TxStore
	ops   []txOp
}

func (tx *Tx) Set(key, value string) {
	tx.ops = append(tx.ops, txOp{opType: "set", key: key, value: value})
}

func (tx *Tx) Delete(key string) {
	tx.ops = append(tx.ops, txOp{opType: "delete", key: key})
}

func (tx *Tx) Commit() {
	tx.store.mu.Lock()
	defer tx.store.mu.Unlock()
	for _, op := range tx.ops {
		switch op.opType {
		case "set":
			tx.store.data[op.key] = op.value
		case "delete":
			delete(tx.store.data, op.key)
		}
	}
	tx.ops = nil
}

func (tx *Tx) Rollback() {
	tx.ops = nil
}

func main() {}
`,
      requires: ['proj-kv-03'],
    },
    {
      id: 'proj-kv-08',
      title: 'Benchmarking & Metrics',
      difficulty: 'expert',
      description: `Add benchmarking and operation metrics to the store.

Implement a BenchStore that wraps a SafeStore and counts operations:
- NewBenchStore() *BenchStore
- Set(key, value string) — delegate to inner store, count the set
- Get(key string) (string, bool) — delegate to inner store, count the get (and track hit vs miss)
- Delete(key string) bool — delegate to inner store, count the delete
- Stats() StoreStats — returns current counters
- Reset() — zero all counters

StoreStats has fields: Sets, Gets, Deletes, Hits, Misses int

A "hit" is a Get that found the key; a "miss" is a Get that did not.

Also implement:
- RunBenchmark(store *BenchStore, numOps int) BenchResult
  - BenchResult has: TotalOps int; Duration time.Duration; OpsPerSec float64
  - Runs numOps iterations: even-indexed iterations call Set("bench-N", "val"), odd call Get("bench-N") where N is the iteration index
  - Measures total wall time, calculates ops/sec as float64(numOps) / duration.Seconds()

Use sync/atomic (int64 fields + atomic.AddInt64) for thread-safe counters.`,
      testFiles: [
        {
          name: 'step08_test.go',
          content: `package main

import (
	"sync"
	"testing"
	"fmt"
)

func TestBenchStoreBasicOps(t *testing.T) {
	b := NewBenchStore()
	b.Set("a", "1")
	b.Set("b", "2")
	val, ok := b.Get("a")
	if !ok || val != "1" {
		t.Fatalf("expected (1, true), got (%s, %v)", val, ok)
	}
	ok2 := b.Delete("b")
	if !ok2 {
		t.Fatal("expected Delete to return true")
	}
}

func TestBenchStoreStatsCounters(t *testing.T) {
	b := NewBenchStore()
	b.Set("a", "1")
	b.Set("b", "2")
	b.Set("c", "3")
	b.Get("a")
	b.Get("b")
	b.Delete("c")

	stats := b.Stats()
	if stats.Sets != 3 {
		t.Fatalf("expected Sets=3, got %d", stats.Sets)
	}
	if stats.Gets != 2 {
		t.Fatalf("expected Gets=2, got %d", stats.Gets)
	}
	if stats.Deletes != 1 {
		t.Fatalf("expected Deletes=1, got %d", stats.Deletes)
	}
}

func TestBenchStoreHitsMisses(t *testing.T) {
	b := NewBenchStore()
	b.Set("exists", "val")

	b.Get("exists")
	b.Get("nope")
	b.Get("also-nope")
	b.Get("exists")

	stats := b.Stats()
	if stats.Hits != 2 {
		t.Fatalf("expected Hits=2, got %d", stats.Hits)
	}
	if stats.Misses != 2 {
		t.Fatalf("expected Misses=2, got %d", stats.Misses)
	}
	if stats.Gets != 4 {
		t.Fatalf("expected Gets=4, got %d", stats.Gets)
	}
}

func TestBenchStoreReset(t *testing.T) {
	b := NewBenchStore()
	b.Set("a", "1")
	b.Get("a")
	b.Get("missing")
	b.Delete("a")

	b.Reset()
	stats := b.Stats()
	if stats.Sets != 0 || stats.Gets != 0 || stats.Deletes != 0 || stats.Hits != 0 || stats.Misses != 0 {
		t.Fatalf("expected all zeros after Reset, got %+v", stats)
	}
}

func TestRunBenchmark(t *testing.T) {
	b := NewBenchStore()
	result := RunBenchmark(b, 1000)

	if result.TotalOps != 1000 {
		t.Fatalf("expected TotalOps=1000, got %d", result.TotalOps)
	}
	if result.Duration <= 0 {
		t.Fatal("expected Duration > 0")
	}
	if result.OpsPerSec <= 0 {
		t.Fatal("expected OpsPerSec > 0")
	}
}

func TestRunBenchmarkOpsMatch(t *testing.T) {
	b := NewBenchStore()
	numOps := 100
	RunBenchmark(b, numOps)

	stats := b.Stats()
	expectedSets := 0
	expectedGets := 0
	for i := 0; i < numOps; i++ {
		if i%2 == 0 {
			expectedSets++
		} else {
			expectedGets++
		}
	}
	if stats.Sets != expectedSets {
		t.Fatalf("expected Sets=%d, got %d", expectedSets, stats.Sets)
	}
	if stats.Gets != expectedGets {
		t.Fatalf("expected Gets=%d, got %d", expectedGets, stats.Gets)
	}
}

func TestBenchStoreConcurrent(t *testing.T) {
	b := NewBenchStore()
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			key := fmt.Sprintf("key-%d", n)
			b.Set(key, "val")
			b.Get(key)
			b.Delete(key)
		}(i)
	}
	wg.Wait()

	stats := b.Stats()
	if stats.Sets != 100 {
		t.Fatalf("expected Sets=100, got %d", stats.Sets)
	}
	if stats.Gets != 100 {
		t.Fatalf("expected Gets=100, got %d", stats.Gets)
	}
	if stats.Deletes != 100 {
		t.Fatalf("expected Deletes=100, got %d", stats.Deletes)
	}
}
`,
        },
      ],
      hints: [
        'Use int64 fields on BenchStore and sync/atomic.AddInt64(&field, 1) for thread-safe counting.',
        'In Get, call the inner store first, then increment gets. Check the bool to decide hits vs misses.',
        'Stats() reads all counters with atomic.LoadInt64 and returns them as plain ints in the StoreStats struct.',
        'Reset() uses atomic.StoreInt64(&field, 0) for each counter.',
        'RunBenchmark records time.Now() before the loop, time.Since(start) after, and divides numOps by duration.Seconds().',
      ],
      solution: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
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

// --- Benchmarking & Metrics ---

type StoreStats struct {
	Sets    int
	Gets    int
	Deletes int
	Hits    int
	Misses  int
}

type BenchStore struct {
	store   *SafeStore
	sets    int64
	gets    int64
	deletes int64
	hits    int64
	misses  int64
}

func NewBenchStore() *BenchStore {
	return &BenchStore{store: NewSafeStore()}
}

func (b *BenchStore) Set(key, value string) {
	b.store.Set(key, value)
	atomic.AddInt64(&b.sets, 1)
}

func (b *BenchStore) Get(key string) (string, bool) {
	val, ok := b.store.Get(key)
	atomic.AddInt64(&b.gets, 1)
	if ok {
		atomic.AddInt64(&b.hits, 1)
	} else {
		atomic.AddInt64(&b.misses, 1)
	}
	return val, ok
}

func (b *BenchStore) Delete(key string) bool {
	result := b.store.Delete(key)
	atomic.AddInt64(&b.deletes, 1)
	return result
}

func (b *BenchStore) Stats() StoreStats {
	return StoreStats{
		Sets:    int(atomic.LoadInt64(&b.sets)),
		Gets:    int(atomic.LoadInt64(&b.gets)),
		Deletes: int(atomic.LoadInt64(&b.deletes)),
		Hits:    int(atomic.LoadInt64(&b.hits)),
		Misses:  int(atomic.LoadInt64(&b.misses)),
	}
}

func (b *BenchStore) Reset() {
	atomic.StoreInt64(&b.sets, 0)
	atomic.StoreInt64(&b.gets, 0)
	atomic.StoreInt64(&b.deletes, 0)
	atomic.StoreInt64(&b.hits, 0)
	atomic.StoreInt64(&b.misses, 0)
}

type BenchResult struct {
	TotalOps  int
	Duration  time.Duration
	OpsPerSec float64
}

func RunBenchmark(store *BenchStore, numOps int) BenchResult {
	start := time.Now()
	for i := 0; i < numOps; i++ {
		key := fmt.Sprintf("bench-%d", i)
		if i%2 == 0 {
			store.Set(key, "val")
		} else {
			store.Get(key)
		}
	}
	dur := time.Since(start)
	return BenchResult{
		TotalOps:  numOps,
		Duration:  dur,
		OpsPerSec: float64(numOps) / dur.Seconds(),
	}
}

func main() {
	b := NewBenchStore()
	b.Set("hello", "world")
	val, _ := b.Get("hello")
	fmt.Println(val)
	stats := b.Stats()
	fmt.Printf("Sets: %d, Gets: %d, Hits: %d\\n", stats.Sets, stats.Gets, stats.Hits)
}
`,
      requires: ['proj-kv-03'],
    },
  ],
}

export default project

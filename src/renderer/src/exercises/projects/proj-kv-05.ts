import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-05',
  title: 'KV Store — LRU Eviction',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'advanced',
  order: 127,
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

// --- TTLStore from Step 4 (provided) ---

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

// TODO: Import "container/list"

// TODO: Define a cacheEntry struct with key and value strings.

// TODO: Define LRUCache with capacity, evictions counter,
//   a *list.List for ordering, and a map[string]*list.Element for lookup.

// TODO: Implement NewLRUCache(capacity int) *LRUCache.

// TODO: Implement Set(key, value string).
//   If key exists, update value and move to front.
//   If at capacity, remove the back element (least recently used) and increment evictions.
//   Insert new entry at front.

// TODO: Implement Get(key string) (string, bool).
//   If found, move to front and return value.

// TODO: Implement Len() int.

// TODO: Implement Evictions() int.

func main() {}
`,
  testCode: `package main

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
  hints: [
    'Use container/list.New() for a doubly-linked list and a map[string]*list.Element for O(1) lookup.',
    'Store a struct with both key and value in each list element — you need the key when evicting from the back.',
    'On Set with existing key: update the value and call list.MoveToFront(elem).',
    'On Set at capacity: remove list.Back(), delete its key from the map, then insert the new entry at front.',
    'On Get: move the element to front with MoveToFront to mark it as recently used.',
  ],
  projectId: 'proj-kv',
  step: 5,
  totalSteps: 8,
}

export default exercise

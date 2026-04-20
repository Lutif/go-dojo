import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_03_lru_cache',
  title: 'LRU Cache',
  category: 'Data & Storage',
  subcategory: 'Caching',
  difficulty: 'advanced',
  order: 3,
  description: `Implement an LRU (Least Recently Used) cache with a fixed capacity. When the cache is full, the least recently accessed entry is evicted.

The classic approach combines a hash map for O(1) lookups with a doubly-linked list for O(1) ordering:

\`\`\`
type node struct {
    key        string
    value      string
    prev, next *node
}

type LRUCache struct {
    capacity   int
    items      map[string]*node
    head, tail *node   // dummy sentinels
}
\`\`\`

On \`Get\` or \`Put\`, the accessed node moves to the front. When capacity is exceeded, the node at the back (just before the tail sentinel) is evicted.

Implement:
- \`NewLRUCache(capacity int)\` - creates a cache with the given capacity
- \`Get(key string) (string, bool)\` - retrieves a value and marks it as recently used
- \`Put(key, value string)\` - adds or updates; evicts LRU entry if at capacity
- \`Len() int\` - returns the current number of entries`,
  code: `package main

// node is a doubly-linked list node.
type node struct {
	key        string
	value      string
	prev, next *node
}

// LRUCache is a least-recently-used cache with fixed capacity.
type LRUCache struct {
	capacity   int
	items      map[string]*node
	head, tail *node // sentinel nodes
}

// NewLRUCache creates a new LRU cache with the given capacity.
func NewLRUCache(capacity int) *LRUCache {
	// TODO: Initialize with sentinel head and tail nodes
	// head <-> tail (empty list)
	return nil
}

// Get retrieves a value and moves the entry to the front (most recent).
func (c *LRUCache) Get(key string) (string, bool) {
	// TODO: Look up in map, move to front, return value
	return "", false
}

// Put adds or updates an entry. If at capacity, evict the least recently used.
func (c *LRUCache) Put(key, value string) {
	// TODO: If key exists, update and move to front.
	// If at capacity, evict the node just before tail.
	// Insert new node at front.
}

// Len returns the number of entries in the cache.
func (c *LRUCache) Len() int {
	// TODO
	return 0
}

// moveToFront removes a node from its current position and inserts it
// right after head.
func (c *LRUCache) moveToFront(n *node) {
	// TODO: Remove from current position, insert after head
}

// removeLast removes the node just before tail (the LRU entry).
func (c *LRUCache) removeLast() *node {
	// TODO: Remove and return the node before tail
	return nil
}

func main() {}`,
  testCode: `package main

import "testing"

func TestLRUBasic(t *testing.T) {
	cache := NewLRUCache(2)
	cache.Put("a", "1")
	cache.Put("b", "2")

	val, ok := cache.Get("a")
	if !ok || val != "1" {
		t.Errorf("Get(a) = (%q, %v), want (1, true)", val, ok)
	}
	val, ok = cache.Get("b")
	if !ok || val != "2" {
		t.Errorf("Get(b) = (%q, %v), want (2, true)", val, ok)
	}
}

func TestLRUMiss(t *testing.T) {
	cache := NewLRUCache(2)
	_, ok := cache.Get("missing")
	if ok {
		t.Error("Get(missing) should return false")
	}
}

func TestLRUEviction(t *testing.T) {
	cache := NewLRUCache(2)
	cache.Put("a", "1")
	cache.Put("b", "2")
	cache.Put("c", "3") // evicts "a"

	_, ok := cache.Get("a")
	if ok {
		t.Error("a should have been evicted")
	}
	val, ok := cache.Get("b")
	if !ok || val != "2" {
		t.Errorf("Get(b) = (%q, %v), want (2, true)", val, ok)
	}
	val, ok = cache.Get("c")
	if !ok || val != "3" {
		t.Errorf("Get(c) = (%q, %v), want (3, true)", val, ok)
	}
}

func TestLRUAccessUpdatesOrder(t *testing.T) {
	cache := NewLRUCache(2)
	cache.Put("a", "1")
	cache.Put("b", "2")
	cache.Get("a")       // "a" is now most recent
	cache.Put("c", "3")  // evicts "b" (least recent)

	_, ok := cache.Get("b")
	if ok {
		t.Error("b should have been evicted after accessing a")
	}
	val, ok := cache.Get("a")
	if !ok || val != "1" {
		t.Errorf("Get(a) = (%q, %v), want (1, true)", val, ok)
	}
}

func TestLRUUpdate(t *testing.T) {
	cache := NewLRUCache(2)
	cache.Put("a", "1")
	cache.Put("b", "2")
	cache.Put("a", "updated") // update, not new entry
	cache.Put("c", "3")       // evicts "b" (a was recently touched)

	val, ok := cache.Get("a")
	if !ok || val != "updated" {
		t.Errorf("Get(a) = (%q, %v), want (updated, true)", val, ok)
	}
	_, ok = cache.Get("b")
	if ok {
		t.Error("b should have been evicted")
	}
}

func TestLRULen(t *testing.T) {
	cache := NewLRUCache(3)
	cache.Put("a", "1")
	cache.Put("b", "2")
	if cache.Len() != 2 {
		t.Errorf("Len() = %d, want 2", cache.Len())
	}
	cache.Put("c", "3")
	cache.Put("d", "4") // evicts "a"
	if cache.Len() != 3 {
		t.Errorf("Len() = %d, want 3", cache.Len())
	}
}

func TestLRUCapacityOne(t *testing.T) {
	cache := NewLRUCache(1)
	cache.Put("a", "1")
	cache.Put("b", "2") // evicts "a"

	_, ok := cache.Get("a")
	if ok {
		t.Error("a should be evicted with capacity 1")
	}
	val, ok := cache.Get("b")
	if !ok || val != "2" {
		t.Errorf("Get(b) = (%q, %v), want (2, true)", val, ok)
	}
}`,
  solution: `package main

type node struct {
	key        string
	value      string
	prev, next *node
}

type LRUCache struct {
	capacity   int
	items      map[string]*node
	head, tail *node
}

func NewLRUCache(capacity int) *LRUCache {
	head := &node{}
	tail := &node{}
	head.next = tail
	tail.prev = head
	return &LRUCache{
		capacity: capacity,
		items:    make(map[string]*node),
		head:     head,
		tail:     tail,
	}
}

func (c *LRUCache) Get(key string) (string, bool) {
	n, ok := c.items[key]
	if !ok {
		return "", false
	}
	c.moveToFront(n)
	return n.value, true
}

func (c *LRUCache) Put(key, value string) {
	if n, ok := c.items[key]; ok {
		n.value = value
		c.moveToFront(n)
		return
	}
	if len(c.items) >= c.capacity {
		removed := c.removeLast()
		delete(c.items, removed.key)
	}
	n := &node{key: key, value: value}
	c.items[key] = n
	// insert after head
	n.prev = c.head
	n.next = c.head.next
	c.head.next.prev = n
	c.head.next = n
}

func (c *LRUCache) Len() int {
	return len(c.items)
}

func (c *LRUCache) moveToFront(n *node) {
	// remove from current position
	n.prev.next = n.next
	n.next.prev = n.prev
	// insert after head
	n.prev = c.head
	n.next = c.head.next
	c.head.next.prev = n
	c.head.next = n
}

func (c *LRUCache) removeLast() *node {
	n := c.tail.prev
	n.prev.next = c.tail
	c.tail.prev = n.prev
	return n
}

func main() {}`,
  hints: [
    'Use sentinel head and tail nodes to simplify insertion and removal (no nil checks needed).',
    'moveToFront: first remove the node (n.prev.next = n.next, n.next.prev = n.prev), then insert after head.',
    'On Put, if the key already exists, update the value and move to front instead of inserting a new node.',
  ],
}

export default exercise

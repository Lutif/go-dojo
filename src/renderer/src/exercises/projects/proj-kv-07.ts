import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-07',
  title: 'KV Store — Transaction Batching',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'advanced',
  order: 129,
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
  code: `package main

import (
	"container/list"
	"encoding/json"
	"os"
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

// --- LRUCache from Step 5 (provided) ---

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

// --- FileStore from Step 6 (provided) ---

type snapshot struct {
	Data map[string]string ` + '`' + `json:"data"` + '`' + `
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

// TODO: Define a txOp struct to represent a staged operation:
//   type txOp struct { opType string; key string; value string }
//   opType is "set" or "delete"

// TODO: Define TxStore with sync.RWMutex and data map.

// TODO: Define Tx with a pointer to the parent TxStore and a slice of txOp.

// TODO: Implement NewTxStore() *TxStore.

// TODO: Implement TxStore.Set, Get, Delete, Len (thread-safe).

// TODO: Implement TxStore.Begin() *Tx — create a new Tx linked to the store.

// TODO: Implement Tx.Set(key, value string) — append a set op.

// TODO: Implement Tx.Delete(key string) — append a delete op.

// TODO: Implement Tx.Commit() — acquire write lock, apply all ops, release lock.

// TODO: Implement Tx.Rollback() — clear the ops slice.

func main() {}
`,
  testCode: `package main

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
	Data map[string]string ` + '`' + `json:"data"` + '`' + `
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
  hints: [
    'Define a txOp struct with opType ("set" or "delete"), key, and value fields.',
    'Tx.Set and Tx.Delete just append to the ops slice - no lock needed yet.',
    'Tx.Commit acquires the store write lock and applies all ops in order, then clears the slice.',
    'Tx.Rollback simply sets ops to nil - nothing was written to the store.',
    'The TxStore itself uses sync.RWMutex just like SafeStore for its direct Set/Get/Delete/Len methods.',
  ],
  projectId: 'proj-kv',
  step: 7,
  totalSteps: 8,
}

export default exercise

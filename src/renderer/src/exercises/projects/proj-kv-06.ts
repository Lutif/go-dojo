import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-06',
  title: 'KV Store — Persistence (Save/Load)',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'advanced',
  order: 128,
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
  code: `package main

import (
	"container/list"
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

// --- File Store ---

// TODO: Import "encoding/json", "os"

// TODO: Define a snapshot struct for JSON serialization:
//   type snapshot struct { Data map[string]string ` + '`' + `json:"data"` + '`' + ` }

// TODO: Define FileStore with path string and data map[string]string.

// TODO: Implement NewFileStore(path string) (*FileStore, error).
//   If the file exists, read and unmarshal JSON. Otherwise start empty.

// TODO: Implement Set(key, value string) error.

// TODO: Implement Get(key string) (string, bool).

// TODO: Implement Delete(key string) bool.

// TODO: Implement Len() int.

// TODO: Implement Save() error — marshal data and write to file.

// TODO: Implement Close() error — call Save().

func main() {}
`,
  testCode: `package main

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
	Data map[string]string ` + '`' + `json:"data"` + '`' + `
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
  hints: [
    'Define a snapshot struct with a Data field and a json:"data" struct tag for serialization.',
    'In NewFileStore, use os.ReadFile — if os.IsNotExist(err), start with an empty map.',
    'For Save, use json.Marshal on the snapshot struct, then os.WriteFile to write it.',
    'Close simply calls Save — this ensures data is persisted when the store is done.',
    'Handle the empty file case: if len(raw) == 0, skip unmarshaling and return an empty store.',
  ],
  projectId: 'proj-kv',
  step: 6,
  totalSteps: 8,
}

export default exercise

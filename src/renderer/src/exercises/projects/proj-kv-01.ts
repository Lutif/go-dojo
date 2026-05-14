import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-kv-01',
  title: 'KV Store — In-Memory Store',
  category: 'Projects',
  subcategory: 'Key-Value Store',
  difficulty: 'intermediate',
  order: 123,
  description: `Build the core of an in-memory key-value store.

Implement a Store struct with:
- NewStore() *Store: create a new empty store
- Set(key, value string): store a key-value pair (overwrite if exists)
- Get(key string) (string, bool): retrieve a value by key
- Delete(key string) bool: remove a key, return true if it existed
- Len() int: return the number of stored keys

This is the foundation — later steps add thread safety, TTL, eviction, and persistence.`,
  code: `package main

// TODO: Define a Store struct backed by a map.

// TODO: Implement NewStore() *Store.

// TODO: Implement Set(key, value string).

// TODO: Implement Get(key string) (string, bool).

// TODO: Implement Delete(key string) bool.

// TODO: Implement Len() int.

func main() {}
`,
  testCode: `package main

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
  hints: [
    'Use a map[string]string as the backing data structure.',
    'Get can use the two-value map lookup: val, ok := m[key].',
    'Delete should check existence before calling delete() to return the correct bool.',
    'Len just returns len(s.data).',
  ],
  projectId: 'proj-kv',
  projectTitle: 'Key-Value Store',
  step: 1,
  totalSteps: 8,
}

export default exercise

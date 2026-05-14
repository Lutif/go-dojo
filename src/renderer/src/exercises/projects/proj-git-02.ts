import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-02',
  title: 'Git Internals — In-Memory Object Store',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'intermediate',
  order: 155,
  description: `Build a content-addressed in-memory object store — the heart of Git's storage model.

Every object is stored by the SHA-1 hash of its content. Writing the same content
twice returns the same hash and stores only one copy (deduplication).

Implement an ObjectStore with:
- NewObjectStore() *ObjectStore
- WriteObject(content string) string — stores content, returns its SHA-1 hex hash
- ReadObject(hash string) (string, error) — retrieves content by hash
- HasObject(hash string) bool — checks if a hash exists
- Objects() int — returns the number of stored objects`,
  code: `package main

import (
	"crypto/sha1"
	"fmt"
)

func HashObject(content string) string {
	h := sha1.Sum([]byte(content))
	return fmt.Sprintf("%x", h)
}

// TODO: Define ObjectStore struct.

// TODO: Implement NewObjectStore() *ObjectStore.

// TODO: Implement WriteObject(content string) string.

// TODO: Implement ReadObject(hash string) (string, error).

// TODO: Implement HasObject(hash string) bool.

// TODO: Implement Objects() int.

func main() {}
`,
  testCode: `package main

import "testing"

func TestWriteAndRead(t *testing.T) {
	store := NewObjectStore()
	hash := store.WriteObject("hello world")
	content, err := store.ReadObject(hash)
	if err != nil {
		t.Fatalf("ReadObject returned error: %v", err)
	}
	if content != "hello world" {
		t.Fatalf("expected \\"hello world\\", got %q", content)
	}
}

func TestDeduplication(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("same")
	h2 := store.WriteObject("same")
	if h1 != h2 {
		t.Fatal("same content should produce same hash")
	}
	if store.Objects() != 1 {
		t.Fatalf("dedup failed: expected 1 object, got %d", store.Objects())
	}
}

func TestHasObject(t *testing.T) {
	store := NewObjectStore()
	hash := store.WriteObject("data")
	if !store.HasObject(hash) {
		t.Fatal("HasObject should return true for stored object")
	}
	if store.HasObject("0000000000000000000000000000000000000000") {
		t.Fatal("HasObject should return false for missing object")
	}
}

func TestReadMissing(t *testing.T) {
	store := NewObjectStore()
	_, err := store.ReadObject("nonexistent")
	if err == nil {
		t.Fatal("ReadObject should return error for missing hash")
	}
}

func TestObjectsCount(t *testing.T) {
	store := NewObjectStore()
	if store.Objects() != 0 {
		t.Fatalf("empty store should have 0 objects, got %d", store.Objects())
	}
	store.WriteObject("a")
	store.WriteObject("b")
	store.WriteObject("c")
	if store.Objects() != 3 {
		t.Fatalf("expected 3 objects, got %d", store.Objects())
	}
}

func TestDifferentContentDifferentHash(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("alpha")
	h2 := store.WriteObject("beta")
	if h1 == h2 {
		t.Fatal("different content should produce different hashes")
	}
}
`,
  solution: `package main

import (
	"crypto/sha1"
	"fmt"
)

func HashObject(content string) string {
	h := sha1.Sum([]byte(content))
	return fmt.Sprintf("%x", h)
}

type ObjectStore struct {
	objects map[string]string
}

func NewObjectStore() *ObjectStore {
	return &ObjectStore{objects: make(map[string]string)}
}

func (s *ObjectStore) WriteObject(content string) string {
	hash := HashObject(content)
	s.objects[hash] = content
	return hash
}

func (s *ObjectStore) ReadObject(hash string) (string, error) {
	content, ok := s.objects[hash]
	if !ok {
		return "", fmt.Errorf("object not found: %s", hash)
	}
	return content, nil
}

func (s *ObjectStore) HasObject(hash string) bool {
	_, ok := s.objects[hash]
	return ok
}

func (s *ObjectStore) Objects() int {
	return len(s.objects)
}

func main() {}
`,
  hints: [
    'Use a map[string]string where keys are SHA-1 hashes and values are the content.',
    'WriteObject should hash the content, store it, and return the hash.',
    'Deduplication is automatic — writing the same content produces the same hash key.',
    'ReadObject should return an error when the hash is not found in the map.',
  ],
  projectId: 'proj-git',
  step: 2,
  totalSteps: 8,
}

export default exercise

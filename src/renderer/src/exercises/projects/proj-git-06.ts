import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-06',
  title: 'Git Internals — References',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'advanced',
  order: 159,
  description: `Implement Git references — named pointers to commit hashes.

Branches and tags in Git are just files containing a commit hash. HEAD is a special
reference that points to the current branch name.

Implement a RefStore:
- NewRefStore() *RefStore
- SetRef(name, hash string) — create or update a reference
- GetRef(name string) (string, bool) — look up a reference
- DeleteRef(name string) bool — remove a reference, return true if it existed
- ListRefs() map[string]string — return all references
- SetHead(ref string) — set HEAD to point to a ref name (e.g. "main")
- GetHead() string — return the ref name HEAD points to
- ResolveHead(store *ObjectStore) (string, bool) — follow HEAD to its ref,
  then return the commit hash that ref points to`,
  code: `package main

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

// TODO: Define RefStore struct with refs map and head string.

// TODO: Implement NewRefStore() *RefStore.

// TODO: Implement SetRef(name, hash string).

// TODO: Implement GetRef(name string) (string, bool).

// TODO: Implement DeleteRef(name string) bool.

// TODO: Implement ListRefs() map[string]string.

// TODO: Implement SetHead(ref string).

// TODO: Implement GetHead() string.

// TODO: Implement ResolveHead(store *ObjectStore) (string, bool).
// Follow HEAD -> ref name -> commit hash.

func main() {}
`,
  testCode: `package main

import "testing"

func TestSetAndGetRef(t *testing.T) {
	rs := NewRefStore()
	rs.SetRef("main", "abc123")
	hash, ok := rs.GetRef("main")
	if !ok || hash != "abc123" {
		t.Fatalf("expected (abc123, true), got (%s, %v)", hash, ok)
	}
}

func TestGetRefMissing(t *testing.T) {
	rs := NewRefStore()
	_, ok := rs.GetRef("nope")
	if ok {
		t.Fatal("GetRef should return false for missing ref")
	}
}

func TestSetRefOverwrite(t *testing.T) {
	rs := NewRefStore()
	rs.SetRef("main", "hash1")
	rs.SetRef("main", "hash2")
	hash, _ := rs.GetRef("main")
	if hash != "hash2" {
		t.Fatalf("expected hash2, got %s", hash)
	}
}

func TestDeleteRef(t *testing.T) {
	rs := NewRefStore()
	rs.SetRef("feature", "aaa")
	if !rs.DeleteRef("feature") {
		t.Fatal("DeleteRef should return true for existing ref")
	}
	if rs.DeleteRef("feature") {
		t.Fatal("DeleteRef should return false for missing ref")
	}
	_, ok := rs.GetRef("feature")
	if ok {
		t.Fatal("GetRef should return false after delete")
	}
}

func TestListRefs(t *testing.T) {
	rs := NewRefStore()
	rs.SetRef("main", "h1")
	rs.SetRef("dev", "h2")
	refs := rs.ListRefs()
	if len(refs) != 2 {
		t.Fatalf("expected 2 refs, got %d", len(refs))
	}
	if refs["main"] != "h1" || refs["dev"] != "h2" {
		t.Fatalf("unexpected refs: %v", refs)
	}
}

func TestHeadSetAndGet(t *testing.T) {
	rs := NewRefStore()
	rs.SetHead("main")
	if rs.GetHead() != "main" {
		t.Fatalf("expected HEAD=main, got %s", rs.GetHead())
	}
}

func TestResolveHead(t *testing.T) {
	store := NewObjectStore()
	commitHash := store.WriteObject("commit data")

	rs := NewRefStore()
	rs.SetRef("main", commitHash)
	rs.SetHead("main")

	resolved, ok := rs.ResolveHead(store)
	if !ok {
		t.Fatal("ResolveHead should return true")
	}
	if resolved != commitHash {
		t.Fatalf("expected %s, got %s", commitHash, resolved)
	}
}

func TestResolveHeadMissingRef(t *testing.T) {
	store := NewObjectStore()
	rs := NewRefStore()
	rs.SetHead("main")
	_, ok := rs.ResolveHead(store)
	if ok {
		t.Fatal("ResolveHead should return false when ref doesn't exist")
	}
}

func TestResolveHeadNoHead(t *testing.T) {
	store := NewObjectStore()
	rs := NewRefStore()
	_, ok := rs.ResolveHead(store)
	if ok {
		t.Fatal("ResolveHead should return false when HEAD is empty")
	}
}

func TestListRefsIsCopy(t *testing.T) {
	rs := NewRefStore()
	rs.SetRef("main", "h1")
	refs := rs.ListRefs()
	refs["main"] = "tampered"
	hash, _ := rs.GetRef("main")
	if hash != "h1" {
		t.Fatal("ListRefs should return a copy, not the internal map")
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

type RefStore struct {
	refs map[string]string
	head string
}

func NewRefStore() *RefStore {
	return &RefStore{refs: make(map[string]string)}
}

func (r *RefStore) SetRef(name, hash string) {
	r.refs[name] = hash
}

func (r *RefStore) GetRef(name string) (string, bool) {
	hash, ok := r.refs[name]
	return hash, ok
}

func (r *RefStore) DeleteRef(name string) bool {
	if _, ok := r.refs[name]; !ok {
		return false
	}
	delete(r.refs, name)
	return true
}

func (r *RefStore) ListRefs() map[string]string {
	result := make(map[string]string, len(r.refs))
	for k, v := range r.refs {
		result[k] = v
	}
	return result
}

func (r *RefStore) SetHead(ref string) {
	r.head = ref
}

func (r *RefStore) GetHead() string {
	return r.head
}

func (r *RefStore) ResolveHead(store *ObjectStore) (string, bool) {
	if r.head == "" {
		return "", false
	}
	hash, ok := r.GetRef(r.head)
	if !ok {
		return "", false
	}
	return hash, true
}

func main() {}
`,
  hints: [
    'Use a map[string]string for refs and a plain string for HEAD.',
    'HEAD stores a ref name (like "main"), not a commit hash directly.',
    'ResolveHead: get HEAD ref name, then look up that ref to get the hash.',
    'ListRefs should return a copy of the map so callers cannot modify internal state.',
  ],
  projectId: 'proj-git',
  step: 6,
  totalSteps: 8,
}

export default exercise

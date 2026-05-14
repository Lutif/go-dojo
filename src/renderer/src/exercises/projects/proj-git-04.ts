import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-04',
  title: 'Git Internals — Tree Objects',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'advanced',
  order: 157,
  description: `Implement Git tree objects — the directory listings of Git's object model.

A tree holds a sorted list of entries, each pointing to either a blob (file) or
another tree (subdirectory).

Define:
- TreeEntry{Name string; Hash string; IsTree bool}
- Tree{Entries []TreeEntry}

Implement:
- WriteTree(store *ObjectStore, tree Tree) string — serializes the tree as sorted lines
  of "blob <hash> <name>\\n" or "tree <hash> <name>\\n", stores the result, returns its hash.
- ReadTree(store *ObjectStore, hash string) (Tree, error) — parses a stored tree back.

Entries must be sorted by Name before serializing.`,
  code: `package main

import (
	"crypto/sha1"
	"fmt"
	"sort"
	"strings"
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

// TODO: Define TreeEntry struct with Name, Hash string and IsTree bool.

// TODO: Define Tree struct with Entries []TreeEntry.

// TODO: Implement WriteTree(store *ObjectStore, tree Tree) string.
// Sort entries by Name. Serialize each as "blob <hash> <name>\\n"
// or "tree <hash> <name>\\n". Store the result and return its hash.

// TODO: Implement ReadTree(store *ObjectStore, hash string) (Tree, error).
// Parse the stored format back into a Tree.

func main() {
	_ = sort.Slice
	_ = strings.Split
}
`,
  testCode: `package main

import "testing"

func TestWriteTreeEmpty(t *testing.T) {
	store := NewObjectStore()
	tree := Tree{Entries: []TreeEntry{}}
	hash := WriteTree(store, tree)
	if hash == "" {
		t.Fatal("WriteTree should return a hash")
	}
	if !store.HasObject(hash) {
		t.Fatal("tree object should be stored")
	}
}

func TestWriteTreeSingleBlob(t *testing.T) {
	store := NewObjectStore()
	blobHash := store.WriteObject("file content")
	tree := Tree{Entries: []TreeEntry{
		{Name: "readme.txt", Hash: blobHash, IsTree: false},
	}}
	hash := WriteTree(store, tree)
	content, _ := store.ReadObject(hash)
	expected := "blob " + blobHash + " readme.txt\\n"
	if content != expected {
		t.Fatalf("expected %q, got %q", expected, content)
	}
}

func TestWriteTreeSortsEntries(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("aaa")
	h2 := store.WriteObject("bbb")
	tree := Tree{Entries: []TreeEntry{
		{Name: "zebra.go", Hash: h1, IsTree: false},
		{Name: "alpha.go", Hash: h2, IsTree: false},
	}}
	hash := WriteTree(store, tree)
	content, _ := store.ReadObject(hash)
	lines := "blob " + h2 + " alpha.go\\n" + "blob " + h1 + " zebra.go\\n"
	if content != lines {
		t.Fatalf("entries not sorted:\\nexpected: %q\\ngot:      %q", lines, content)
	}
}

func TestWriteTreeWithSubtree(t *testing.T) {
	store := NewObjectStore()
	subHash := store.WriteObject("sub content")
	tree := Tree{Entries: []TreeEntry{
		{Name: "subdir", Hash: subHash, IsTree: true},
	}}
	hash := WriteTree(store, tree)
	content, _ := store.ReadObject(hash)
	expected := "tree " + subHash + " subdir\\n"
	if content != expected {
		t.Fatalf("expected %q, got %q", expected, content)
	}
}

func TestReadTree(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("content1")
	h2 := store.WriteObject("content2")
	original := Tree{Entries: []TreeEntry{
		{Name: "file.go", Hash: h1, IsTree: false},
		{Name: "lib", Hash: h2, IsTree: true},
	}}
	hash := WriteTree(store, original)
	parsed, err := ReadTree(store, hash)
	if err != nil {
		t.Fatalf("ReadTree error: %v", err)
	}
	if len(parsed.Entries) != 2 {
		t.Fatalf("expected 2 entries, got %d", len(parsed.Entries))
	}
	if parsed.Entries[0].Name != "file.go" || parsed.Entries[0].IsTree {
		t.Fatalf("first entry wrong: %+v", parsed.Entries[0])
	}
	if parsed.Entries[1].Name != "lib" || !parsed.Entries[1].IsTree {
		t.Fatalf("second entry wrong: %+v", parsed.Entries[1])
	}
}

func TestReadTreeRoundTrip(t *testing.T) {
	store := NewObjectStore()
	h := store.WriteObject("data")
	original := Tree{Entries: []TreeEntry{
		{Name: "a.txt", Hash: h, IsTree: false},
		{Name: "b.txt", Hash: h, IsTree: false},
	}}
	hash := WriteTree(store, original)
	parsed, _ := ReadTree(store, hash)
	rehash := WriteTree(store, parsed)
	if hash != rehash {
		t.Fatal("round-trip should produce same hash")
	}
}

func TestReadTreeMissing(t *testing.T) {
	store := NewObjectStore()
	_, err := ReadTree(store, "nonexistent")
	if err == nil {
		t.Fatal("ReadTree should error for missing hash")
	}
}
`,
  solution: `package main

import (
	"crypto/sha1"
	"fmt"
	"sort"
	"strings"
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

type TreeEntry struct {
	Name   string
	Hash   string
	IsTree bool
}

type Tree struct {
	Entries []TreeEntry
}

func WriteTree(store *ObjectStore, tree Tree) string {
	entries := make([]TreeEntry, len(tree.Entries))
	copy(entries, tree.Entries)
	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Name < entries[j].Name
	})
	var sb strings.Builder
	for _, e := range entries {
		kind := "blob"
		if e.IsTree {
			kind = "tree"
		}
		fmt.Fprintf(&sb, "%s %s %s\\n", kind, e.Hash, e.Name)
	}
	return store.WriteObject(sb.String())
}

func ReadTree(store *ObjectStore, hash string) (Tree, error) {
	content, err := store.ReadObject(hash)
	if err != nil {
		return Tree{}, err
	}
	var entries []TreeEntry
	if content == "" {
		return Tree{Entries: entries}, nil
	}
	lines := strings.Split(strings.TrimRight(content, "\\n"), "\\n")
	for _, line := range lines {
		if line == "" {
			continue
		}
		parts := strings.SplitN(line, " ", 3)
		if len(parts) != 3 {
			return Tree{}, fmt.Errorf("invalid tree entry: %s", line)
		}
		entries = append(entries, TreeEntry{
			Name:   parts[2],
			Hash:   parts[1],
			IsTree: parts[0] == "tree",
		})
	}
	return Tree{Entries: entries}, nil
}

func main() {}
`,
  hints: [
    'Sort a copy of the entries slice by Name before serializing.',
    'Use strings.Builder to efficiently build the tree content string.',
    'Each line format: "<type> <hash> <name>\\n" where type is "blob" or "tree".',
    'To parse, split on "\\n", then split each line into 3 parts with SplitN.',
  ],
  projectId: 'proj-git',
  step: 4,
  totalSteps: 8,
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-08',
  title: 'Git Internals — Diff',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'expert',
  order: 161,
  description: `Implement tree diffing — compare two tree snapshots to see what changed.

Define:
- DiffType as a string type with constants Added, Deleted, Modified
- DiffEntry{Path string; Type DiffType}

Implement:
- DiffTrees(store *ObjectStore, oldTreeHash, newTreeHash string) []DiffEntry
  Compares entries of two trees (by name). Files only in the new tree are Added,
  only in the old tree are Deleted, in both but with different hashes are Modified.
  Sort results by Path.
- FormatDiff(entries []DiffEntry) string
  Formats each entry as a line: "+ <path>" for Added, "- <path>" for Deleted,
  "M <path>" for Modified. Join with newlines.

Use the ObjectStore and tree types from previous steps.`,
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

// TODO: Define DiffType as a string type.
// TODO: Define constants Added, Deleted, Modified of type DiffType.

// TODO: Define DiffEntry struct with Path string and Type DiffType.

// TODO: Implement DiffTrees(store *ObjectStore, oldTreeHash, newTreeHash string) []DiffEntry.
// Compare entries by name. Sort result by Path.

// TODO: Implement FormatDiff(entries []DiffEntry) string.
// "+ <path>" for Added, "- <path>" for Deleted, "M <path>" for Modified.

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestDiffTreesAdded(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("file1")
	h2 := store.WriteObject("file2")

	oldTree := Tree{Entries: []TreeEntry{
		{Name: "a.txt", Hash: h1, IsTree: false},
	}}
	newTree := Tree{Entries: []TreeEntry{
		{Name: "a.txt", Hash: h1, IsTree: false},
		{Name: "b.txt", Hash: h2, IsTree: false},
	}}

	oldHash := WriteTree(store, oldTree)
	newHash := WriteTree(store, newTree)

	diff := DiffTrees(store, oldHash, newHash)
	if len(diff) != 1 {
		t.Fatalf("expected 1 diff entry, got %d", len(diff))
	}
	if diff[0].Path != "b.txt" || diff[0].Type != Added {
		t.Fatalf("expected b.txt Added, got %+v", diff[0])
	}
}

func TestDiffTreesDeleted(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("file1")
	h2 := store.WriteObject("file2")

	oldTree := Tree{Entries: []TreeEntry{
		{Name: "a.txt", Hash: h1, IsTree: false},
		{Name: "b.txt", Hash: h2, IsTree: false},
	}}
	newTree := Tree{Entries: []TreeEntry{
		{Name: "a.txt", Hash: h1, IsTree: false},
	}}

	oldHash := WriteTree(store, oldTree)
	newHash := WriteTree(store, newTree)

	diff := DiffTrees(store, oldHash, newHash)
	if len(diff) != 1 {
		t.Fatalf("expected 1 diff entry, got %d", len(diff))
	}
	if diff[0].Path != "b.txt" || diff[0].Type != Deleted {
		t.Fatalf("expected b.txt Deleted, got %+v", diff[0])
	}
}

func TestDiffTreesModified(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("version1")
	h2 := store.WriteObject("version2")

	oldTree := Tree{Entries: []TreeEntry{
		{Name: "file.go", Hash: h1, IsTree: false},
	}}
	newTree := Tree{Entries: []TreeEntry{
		{Name: "file.go", Hash: h2, IsTree: false},
	}}

	oldHash := WriteTree(store, oldTree)
	newHash := WriteTree(store, newTree)

	diff := DiffTrees(store, oldHash, newHash)
	if len(diff) != 1 {
		t.Fatalf("expected 1 diff entry, got %d", len(diff))
	}
	if diff[0].Path != "file.go" || diff[0].Type != Modified {
		t.Fatalf("expected file.go Modified, got %+v", diff[0])
	}
}

func TestDiffTreesEmpty(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("same")
	tree := Tree{Entries: []TreeEntry{
		{Name: "unchanged.txt", Hash: h1, IsTree: false},
	}}
	hash := WriteTree(store, tree)
	diff := DiffTrees(store, hash, hash)
	if len(diff) != 0 {
		t.Fatalf("identical trees should produce empty diff, got %d entries", len(diff))
	}
}

func TestDiffTreesSorted(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("a")
	h2 := store.WriteObject("b")
	h3 := store.WriteObject("c")

	oldTree := Tree{Entries: []TreeEntry{}}
	newTree := Tree{Entries: []TreeEntry{
		{Name: "zebra.txt", Hash: h1, IsTree: false},
		{Name: "alpha.txt", Hash: h2, IsTree: false},
		{Name: "mid.txt", Hash: h3, IsTree: false},
	}}

	oldHash := WriteTree(store, oldTree)
	newHash := WriteTree(store, newTree)

	diff := DiffTrees(store, oldHash, newHash)
	if len(diff) != 3 {
		t.Fatalf("expected 3 entries, got %d", len(diff))
	}
	if diff[0].Path != "alpha.txt" || diff[1].Path != "mid.txt" || diff[2].Path != "zebra.txt" {
		t.Fatalf("diff not sorted by path: %v", diff)
	}
}

func TestDiffTreesAllChanges(t *testing.T) {
	store := NewObjectStore()
	h1 := store.WriteObject("old")
	h2 := store.WriteObject("new")
	h3 := store.WriteObject("removed")
	h4 := store.WriteObject("added")

	oldTree := Tree{Entries: []TreeEntry{
		{Name: "changed.go", Hash: h1, IsTree: false},
		{Name: "removed.go", Hash: h3, IsTree: false},
	}}
	newTree := Tree{Entries: []TreeEntry{
		{Name: "added.go", Hash: h4, IsTree: false},
		{Name: "changed.go", Hash: h2, IsTree: false},
	}}

	oldHash := WriteTree(store, oldTree)
	newHash := WriteTree(store, newTree)

	diff := DiffTrees(store, oldHash, newHash)
	if len(diff) != 3 {
		t.Fatalf("expected 3 entries, got %d", len(diff))
	}
	// sorted: added.go, changed.go, removed.go
	if diff[0].Path != "added.go" || diff[0].Type != Added {
		t.Fatalf("entry 0: expected added.go Added, got %+v", diff[0])
	}
	if diff[1].Path != "changed.go" || diff[1].Type != Modified {
		t.Fatalf("entry 1: expected changed.go Modified, got %+v", diff[1])
	}
	if diff[2].Path != "removed.go" || diff[2].Type != Deleted {
		t.Fatalf("entry 2: expected removed.go Deleted, got %+v", diff[2])
	}
}

func TestFormatDiff(t *testing.T) {
	entries := []DiffEntry{
		{Path: "added.txt", Type: Added},
		{Path: "modified.txt", Type: Modified},
		{Path: "removed.txt", Type: Deleted},
	}
	got := FormatDiff(entries)
	lines := strings.Split(got, "\\n")
	if len(lines) != 3 {
		t.Fatalf("expected 3 lines, got %d: %q", len(lines), got)
	}
	if lines[0] != "+ added.txt" {
		t.Fatalf("line 0: expected \\"+ added.txt\\", got %q", lines[0])
	}
	if lines[1] != "M modified.txt" {
		t.Fatalf("line 1: expected \\"M modified.txt\\", got %q", lines[1])
	}
	if lines[2] != "- removed.txt" {
		t.Fatalf("line 2: expected \\"- removed.txt\\", got %q", lines[2])
	}
}

func TestFormatDiffEmpty(t *testing.T) {
	got := FormatDiff(nil)
	if got != "" {
		t.Fatalf("empty diff should format as empty string, got %q", got)
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

type DiffType string

const (
	Added    DiffType = "added"
	Deleted  DiffType = "deleted"
	Modified DiffType = "modified"
)

type DiffEntry struct {
	Path string
	Type DiffType
}

func DiffTrees(store *ObjectStore, oldTreeHash, newTreeHash string) []DiffEntry {
	oldTree, _ := ReadTree(store, oldTreeHash)
	newTree, _ := ReadTree(store, newTreeHash)

	oldMap := make(map[string]string)
	for _, e := range oldTree.Entries {
		oldMap[e.Name] = e.Hash
	}
	newMap := make(map[string]string)
	for _, e := range newTree.Entries {
		newMap[e.Name] = e.Hash
	}

	var entries []DiffEntry
	for name, newHash := range newMap {
		if oldHash, ok := oldMap[name]; !ok {
			entries = append(entries, DiffEntry{Path: name, Type: Added})
		} else if oldHash != newHash {
			entries = append(entries, DiffEntry{Path: name, Type: Modified})
		}
	}
	for name := range oldMap {
		if _, ok := newMap[name]; !ok {
			entries = append(entries, DiffEntry{Path: name, Type: Deleted})
		}
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Path < entries[j].Path
	})
	return entries
}

func FormatDiff(entries []DiffEntry) string {
	if len(entries) == 0 {
		return ""
	}
	var lines []string
	for _, e := range entries {
		switch e.Type {
		case Added:
			lines = append(lines, "+ "+e.Path)
		case Deleted:
			lines = append(lines, "- "+e.Path)
		case Modified:
			lines = append(lines, "M "+e.Path)
		}
	}
	return strings.Join(lines, "\\n")
}

func main() {}
`,
  hints: [
    'Build maps from entry Name to Hash for both old and new trees.',
    'Iterate newMap: if name not in oldMap -> Added; if hash differs -> Modified.',
    'Iterate oldMap: if name not in newMap -> Deleted.',
    'Sort the result slice by Path before returning.',
    'FormatDiff maps Added->"+ ", Deleted->"- ", Modified->"M ".',
  ],
  projectId: 'proj-git',
  step: 8,
  totalSteps: 8,
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-05',
  title: 'Git Internals — Commit Objects',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'advanced',
  order: 158,
  description: `Implement Git commit objects — the snapshots that form a project's history.

A commit records a tree hash, an optional parent commit hash, an author, a message,
and a timestamp.

Define:
- Commit{TreeHash, ParentHash, Author, Message string; Timestamp time.Time}

Implement:
- WriteCommit(store *ObjectStore, commit Commit) string — serializes the commit and stores it.
  Format: "tree <hash>\\nparent <hash>\\nauthor <author> <unix-timestamp>\\n\\n<message>"
  Omit the parent line if ParentHash is empty (root commit).
- ReadCommit(store *ObjectStore, hash string) (Commit, error) — parses a stored commit.

Use fixed timestamps in tests for deterministic hashes.`,
  code: `package main

import (
	"crypto/sha1"
	"fmt"
	"strconv"
	"strings"
	"time"
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

// TODO: Define Commit struct with TreeHash, ParentHash, Author, Message string
// and Timestamp time.Time.

// TODO: Implement WriteCommit(store *ObjectStore, commit Commit) string.
// Format: "tree <hash>\\nparent <hash>\\nauthor <author> <unix>\\n\\n<message>"
// Omit parent line when ParentHash is empty.

// TODO: Implement ReadCommit(store *ObjectStore, hash string) (Commit, error).

func main() {
	_ = strconv.ParseInt
	_ = strings.SplitN
	_ = time.Unix
}
`,
  testCode: `package main

import (
	"strings"
	"testing"
	"time"
)

func TestWriteCommitRoot(t *testing.T) {
	store := NewObjectStore()
	ts := time.Unix(1700000000, 0)
	c := Commit{
		TreeHash:  "aaaa",
		Author:    "Alice",
		Message:   "initial commit",
		Timestamp: ts,
	}
	hash := store.WriteObject("") // ensure store works
	_ = hash
	commitHash := WriteCommit(store, c)
	content, _ := store.ReadObject(commitHash)
	if strings.Contains(content, "parent") {
		t.Fatal("root commit should not have a parent line")
	}
	if !strings.Contains(content, "tree aaaa") {
		t.Fatal("commit should contain tree hash")
	}
	if !strings.Contains(content, "author Alice 1700000000") {
		t.Fatal("commit should contain author and timestamp")
	}
	if !strings.HasSuffix(content, "\\n\\ninitial commit") {
		t.Fatalf("commit should end with blank line + message, got %q", content)
	}
}

func TestWriteCommitWithParent(t *testing.T) {
	store := NewObjectStore()
	ts := time.Unix(1700000000, 0)
	c := Commit{
		TreeHash:   "bbbb",
		ParentHash: "cccc",
		Author:     "Bob",
		Message:    "second commit",
		Timestamp:  ts,
	}
	commitHash := WriteCommit(store, c)
	content, _ := store.ReadObject(commitHash)
	if !strings.Contains(content, "parent cccc") {
		t.Fatal("commit should contain parent line")
	}
}

func TestReadCommitRoundTrip(t *testing.T) {
	store := NewObjectStore()
	ts := time.Unix(1700000000, 0)
	original := Commit{
		TreeHash:   "dddd",
		ParentHash: "eeee",
		Author:     "Charlie",
		Message:    "test commit",
		Timestamp:  ts,
	}
	hash := WriteCommit(store, original)
	parsed, err := ReadCommit(store, hash)
	if err != nil {
		t.Fatalf("ReadCommit error: %v", err)
	}
	if parsed.TreeHash != "dddd" {
		t.Fatalf("TreeHash = %s, want dddd", parsed.TreeHash)
	}
	if parsed.ParentHash != "eeee" {
		t.Fatalf("ParentHash = %s, want eeee", parsed.ParentHash)
	}
	if parsed.Author != "Charlie" {
		t.Fatalf("Author = %s, want Charlie", parsed.Author)
	}
	if parsed.Message != "test commit" {
		t.Fatalf("Message = %s, want test commit", parsed.Message)
	}
	if parsed.Timestamp.Unix() != 1700000000 {
		t.Fatalf("Timestamp = %d, want 1700000000", parsed.Timestamp.Unix())
	}
}

func TestReadCommitRootRoundTrip(t *testing.T) {
	store := NewObjectStore()
	ts := time.Unix(1600000000, 0)
	original := Commit{
		TreeHash:  "ffff",
		Author:    "Dana",
		Message:   "root",
		Timestamp: ts,
	}
	hash := WriteCommit(store, original)
	parsed, err := ReadCommit(store, hash)
	if err != nil {
		t.Fatalf("ReadCommit error: %v", err)
	}
	if parsed.ParentHash != "" {
		t.Fatalf("root commit ParentHash should be empty, got %q", parsed.ParentHash)
	}
}

func TestWriteCommitDeterministic(t *testing.T) {
	store := NewObjectStore()
	ts := time.Unix(1700000000, 0)
	c := Commit{TreeHash: "abcd", Author: "Eve", Message: "same", Timestamp: ts}
	h1 := WriteCommit(store, c)
	h2 := WriteCommit(store, c)
	if h1 != h2 {
		t.Fatal("same commit should produce same hash")
	}
}

func TestReadCommitMissing(t *testing.T) {
	store := NewObjectStore()
	_, err := ReadCommit(store, "nonexistent")
	if err == nil {
		t.Fatal("ReadCommit should error for missing hash")
	}
}
`,
  solution: `package main

import (
	"crypto/sha1"
	"fmt"
	"strconv"
	"strings"
	"time"
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

type Commit struct {
	TreeHash   string
	ParentHash string
	Author     string
	Message    string
	Timestamp  time.Time
}

func WriteCommit(store *ObjectStore, commit Commit) string {
	var sb strings.Builder
	fmt.Fprintf(&sb, "tree %s\\n", commit.TreeHash)
	if commit.ParentHash != "" {
		fmt.Fprintf(&sb, "parent %s\\n", commit.ParentHash)
	}
	fmt.Fprintf(&sb, "author %s %d\\n", commit.Author, commit.Timestamp.Unix())
	fmt.Fprintf(&sb, "\\n%s", commit.Message)
	return store.WriteObject(sb.String())
}

func ReadCommit(store *ObjectStore, hash string) (Commit, error) {
	content, err := store.ReadObject(hash)
	if err != nil {
		return Commit{}, err
	}
	parts := strings.SplitN(content, "\\n\\n", 2)
	if len(parts) != 2 {
		return Commit{}, fmt.Errorf("invalid commit format")
	}
	header := parts[0]
	message := parts[1]

	var c Commit
	c.Message = message
	for _, line := range strings.Split(header, "\\n") {
		if strings.HasPrefix(line, "tree ") {
			c.TreeHash = strings.TrimPrefix(line, "tree ")
		} else if strings.HasPrefix(line, "parent ") {
			c.ParentHash = strings.TrimPrefix(line, "parent ")
		} else if strings.HasPrefix(line, "author ") {
			authorPart := strings.TrimPrefix(line, "author ")
			lastSpace := strings.LastIndex(authorPart, " ")
			if lastSpace == -1 {
				return Commit{}, fmt.Errorf("invalid author line")
			}
			c.Author = authorPart[:lastSpace]
			ts, err := strconv.ParseInt(authorPart[lastSpace+1:], 10, 64)
			if err != nil {
				return Commit{}, fmt.Errorf("invalid timestamp: %v", err)
			}
			c.Timestamp = time.Unix(ts, 0)
		}
	}
	return c, nil
}

func main() {}
`,
  hints: [
    'Use strings.Builder and fmt.Fprintf to construct the commit content.',
    'Only add the "parent <hash>" line if ParentHash is non-empty.',
    'The message is separated from the header by a blank line ("\\n\\n").',
    'To parse, split on "\\n\\n" first to separate header from message, then parse header lines.',
    'Use strings.LastIndex to separate author name from unix timestamp.',
  ],
  projectId: 'proj-git',
  step: 5,
  totalSteps: 8,
}

export default exercise

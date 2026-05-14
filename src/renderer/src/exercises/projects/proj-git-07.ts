import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-07',
  title: 'Git Internals — Log Traversal',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'expert',
  order: 160,
  description: `Implement git log — walking the commit history by following parent pointers.

Starting from a commit hash, follow the ParentHash chain back to the root commit
(where ParentHash is empty).

Implement:
- Log(store *ObjectStore, startHash string) []Commit — returns all commits from
  startHash to root, newest first.
- LogN(store *ObjectStore, startHash string, n int) []Commit — same but limited
  to at most n commits.

You will need the Commit struct, WriteCommit, and ReadCommit from step 5.`,
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
	var c Commit
	c.Message = parts[1]
	for _, line := range strings.Split(parts[0], "\\n") {
		if strings.HasPrefix(line, "tree ") {
			c.TreeHash = strings.TrimPrefix(line, "tree ")
		} else if strings.HasPrefix(line, "parent ") {
			c.ParentHash = strings.TrimPrefix(line, "parent ")
		} else if strings.HasPrefix(line, "author ") {
			authorPart := strings.TrimPrefix(line, "author ")
			lastSpace := strings.LastIndex(authorPart, " ")
			c.Author = authorPart[:lastSpace]
			ts, _ := strconv.ParseInt(authorPart[lastSpace+1:], 10, 64)
			c.Timestamp = time.Unix(ts, 0)
		}
	}
	return c, nil
}

// TODO: Implement Log(store *ObjectStore, startHash string) []Commit.
// Walk parent chain from startHash to root. Return newest first.

// TODO: Implement LogN(store *ObjectStore, startHash string, n int) []Commit.
// Same as Log but return at most n commits.

func main() {
	_ = strconv.ParseInt
}
`,
  testCode: `package main

import (
	"fmt"
	"testing"
	"time"
)

func buildHistory(store *ObjectStore, count int) []string {
	hashes := make([]string, count)
	parent := ""
	for i := 0; i < count; i++ {
		c := Commit{
			TreeHash:   "tree" + fmt.Sprintf("%d", i),
			ParentHash: parent,
			Author:     "Dev",
			Message:    fmt.Sprintf("commit %d", i),
			Timestamp:  time.Unix(int64(1700000000+i), 0),
		}
		hash := WriteCommit(store, c)
		hashes[i] = hash
		parent = hash
	}
	return hashes
}

func TestLogFullHistory(t *testing.T) {
	store := NewObjectStore()
	hashes := buildHistory(store, 5)
	tip := hashes[len(hashes)-1]
	log := Log(store, tip)
	if len(log) != 5 {
		t.Fatalf("expected 5 commits in log, got %d", len(log))
	}
	if log[0].Message != "commit 4" {
		t.Fatalf("first log entry should be newest: got %q", log[0].Message)
	}
	if log[4].Message != "commit 0" {
		t.Fatalf("last log entry should be oldest: got %q", log[4].Message)
	}
}

func TestLogFromMiddle(t *testing.T) {
	store := NewObjectStore()
	hashes := buildHistory(store, 5)
	log := Log(store, hashes[2])
	if len(log) != 3 {
		t.Fatalf("log from commit 2 should have 3 entries, got %d", len(log))
	}
	if log[0].Message != "commit 2" {
		t.Fatalf("expected \\"commit 2\\", got %q", log[0].Message)
	}
}

func TestLogSingleCommit(t *testing.T) {
	store := NewObjectStore()
	hashes := buildHistory(store, 1)
	log := Log(store, hashes[0])
	if len(log) != 1 {
		t.Fatalf("expected 1 commit, got %d", len(log))
	}
}

func TestLogNLimits(t *testing.T) {
	store := NewObjectStore()
	hashes := buildHistory(store, 5)
	tip := hashes[len(hashes)-1]
	log := LogN(store, tip, 3)
	if len(log) != 3 {
		t.Fatalf("LogN(3) should return 3 commits, got %d", len(log))
	}
	if log[0].Message != "commit 4" {
		t.Fatalf("first entry should be newest: got %q", log[0].Message)
	}
	if log[2].Message != "commit 2" {
		t.Fatalf("third entry should be commit 2: got %q", log[2].Message)
	}
}

func TestLogNExceedsHistory(t *testing.T) {
	store := NewObjectStore()
	hashes := buildHistory(store, 3)
	tip := hashes[len(hashes)-1]
	log := LogN(store, tip, 10)
	if len(log) != 3 {
		t.Fatalf("LogN(10) with 3 commits should return 3, got %d", len(log))
	}
}

func TestLogNZero(t *testing.T) {
	store := NewObjectStore()
	hashes := buildHistory(store, 3)
	tip := hashes[len(hashes)-1]
	log := LogN(store, tip, 0)
	if len(log) != 0 {
		t.Fatalf("LogN(0) should return 0 commits, got %d", len(log))
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
	var c Commit
	c.Message = parts[1]
	for _, line := range strings.Split(parts[0], "\\n") {
		if strings.HasPrefix(line, "tree ") {
			c.TreeHash = strings.TrimPrefix(line, "tree ")
		} else if strings.HasPrefix(line, "parent ") {
			c.ParentHash = strings.TrimPrefix(line, "parent ")
		} else if strings.HasPrefix(line, "author ") {
			authorPart := strings.TrimPrefix(line, "author ")
			lastSpace := strings.LastIndex(authorPart, " ")
			c.Author = authorPart[:lastSpace]
			ts, _ := strconv.ParseInt(authorPart[lastSpace+1:], 10, 64)
			c.Timestamp = time.Unix(ts, 0)
		}
	}
	return c, nil
}

func Log(store *ObjectStore, startHash string) []Commit {
	var commits []Commit
	current := startHash
	for current != "" {
		c, err := ReadCommit(store, current)
		if err != nil {
			break
		}
		commits = append(commits, c)
		current = c.ParentHash
	}
	return commits
}

func LogN(store *ObjectStore, startHash string, n int) []Commit {
	var commits []Commit
	current := startHash
	for current != "" && len(commits) < n {
		c, err := ReadCommit(store, current)
		if err != nil {
			break
		}
		commits = append(commits, c)
		current = c.ParentHash
	}
	return commits
}

func main() {}
`,
  hints: [
    'Start at startHash and keep following ParentHash until it is empty.',
    'Use ReadCommit to load each commit, then append to the result slice.',
    'The loop terminates when ParentHash is "" (root commit) or ReadCommit errors.',
    'LogN is the same loop but with an additional len(commits) < n check.',
  ],
  projectId: 'proj-git',
  step: 7,
  totalSteps: 8,
}

export default exercise

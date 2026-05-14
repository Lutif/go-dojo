import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-03',
  title: 'Git Internals — Disk Object Store',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'intermediate',
  order: 156,
  description: `Move from in-memory to on-disk storage — just like real Git.

Git stores objects at .git/objects/ab/cdef... where the first two hex characters of the
hash form the directory name and the remaining 38 characters are the filename.

Implement a DiskStore:
- NewDiskStore(rootDir string) (*DiskStore, error) — creates the rootDir/.minigit/objects/ directory
- WriteObject(content string) string — writes content to disk at the appropriate path, returns hash
- ReadObject(hash string) (string, error) — reads content from disk by hash
- HasObject(hash string) bool — checks if the object file exists

Use the HashObject function from step 1 to compute hashes.`,
  code: `package main

import (
	"crypto/sha1"
	"fmt"
	"os"
	"path/filepath"
)

func HashObject(content string) string {
	h := sha1.Sum([]byte(content))
	return fmt.Sprintf("%x", h)
}

// TODO: Define DiskStore struct with a root path.

// TODO: Implement NewDiskStore(rootDir string) (*DiskStore, error).
// Should create rootDir/.minigit/objects/ directory.

// TODO: Implement WriteObject(content string) string.
// Store at .minigit/objects/<first2>/<remaining38>.

// TODO: Implement ReadObject(hash string) (string, error).

// TODO: Implement HasObject(hash string) bool.

// objectPath is a helper: given a hash, return the full file path.
// e.g. hash "aabbcc..." -> rootDir/.minigit/objects/aa/bbcc...

func main() {
	_ = os.MkdirAll
	_ = filepath.Join
}
`,
  testCode: `package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDiskStoreCreatesDirs(t *testing.T) {
	dir := t.TempDir()
	_, err := NewDiskStore(dir)
	if err != nil {
		t.Fatalf("NewDiskStore failed: %v", err)
	}
	objDir := filepath.Join(dir, ".minigit", "objects")
	info, err := os.Stat(objDir)
	if err != nil || !info.IsDir() {
		t.Fatalf("expected .minigit/objects/ directory to exist")
	}
}

func TestDiskStoreWriteAndRead(t *testing.T) {
	dir := t.TempDir()
	store, _ := NewDiskStore(dir)
	hash := store.WriteObject("hello disk")
	content, err := store.ReadObject(hash)
	if err != nil {
		t.Fatalf("ReadObject error: %v", err)
	}
	if content != "hello disk" {
		t.Fatalf("expected \\"hello disk\\", got %q", content)
	}
}

func TestDiskStoreFileOnDisk(t *testing.T) {
	dir := t.TempDir()
	store, _ := NewDiskStore(dir)
	hash := store.WriteObject("persist me")
	prefix := hash[:2]
	rest := hash[2:]
	fpath := filepath.Join(dir, ".minigit", "objects", prefix, rest)
	data, err := os.ReadFile(fpath)
	if err != nil {
		t.Fatalf("object file not found at %s: %v", fpath, err)
	}
	if string(data) != "persist me" {
		t.Fatalf("file content mismatch: got %q", string(data))
	}
}

func TestDiskStoreHasObject(t *testing.T) {
	dir := t.TempDir()
	store, _ := NewDiskStore(dir)
	hash := store.WriteObject("exists")
	if !store.HasObject(hash) {
		t.Fatal("HasObject should return true for written object")
	}
	if store.HasObject("0000000000000000000000000000000000000000") {
		t.Fatal("HasObject should return false for missing object")
	}
}

func TestDiskStoreReadMissing(t *testing.T) {
	dir := t.TempDir()
	store, _ := NewDiskStore(dir)
	_, err := store.ReadObject("deadbeef00000000000000000000000000000000")
	if err == nil {
		t.Fatal("ReadObject should error for missing hash")
	}
}

func TestDiskStorePersistence(t *testing.T) {
	dir := t.TempDir()
	store1, _ := NewDiskStore(dir)
	hash := store1.WriteObject("persistent")

	store2, _ := NewDiskStore(dir)
	content, err := store2.ReadObject(hash)
	if err != nil {
		t.Fatalf("second store could not read: %v", err)
	}
	if content != "persistent" {
		t.Fatalf("expected \\"persistent\\", got %q", content)
	}
}
`,
  solution: `package main

import (
	"crypto/sha1"
	"fmt"
	"os"
	"path/filepath"
)

func HashObject(content string) string {
	h := sha1.Sum([]byte(content))
	return fmt.Sprintf("%x", h)
}

type DiskStore struct {
	objectsDir string
}

func NewDiskStore(rootDir string) (*DiskStore, error) {
	objDir := filepath.Join(rootDir, ".minigit", "objects")
	if err := os.MkdirAll(objDir, 0755); err != nil {
		return nil, err
	}
	return &DiskStore{objectsDir: objDir}, nil
}

func (d *DiskStore) objectPath(hash string) string {
	return filepath.Join(d.objectsDir, hash[:2], hash[2:])
}

func (d *DiskStore) WriteObject(content string) string {
	hash := HashObject(content)
	p := d.objectPath(hash)
	os.MkdirAll(filepath.Dir(p), 0755)
	os.WriteFile(p, []byte(content), 0644)
	return hash
}

func (d *DiskStore) ReadObject(hash string) (string, error) {
	data, err := os.ReadFile(d.objectPath(hash))
	if err != nil {
		return "", fmt.Errorf("object not found: %s", hash)
	}
	return string(data), nil
}

func (d *DiskStore) HasObject(hash string) bool {
	_, err := os.Stat(d.objectPath(hash))
	return err == nil
}

func main() {}
`,
  hints: [
    'Store the objectsDir path (rootDir + ".minigit/objects") in the DiskStore struct.',
    'Split the hash: first 2 chars = subdirectory, remaining 38 = filename.',
    'Use os.MkdirAll to create the two-char subdirectory before writing.',
    'os.ReadFile and os.WriteFile handle reading/writing file content.',
  ],
  projectId: 'proj-git',
  step: 3,
  totalSteps: 8,
}

export default exercise

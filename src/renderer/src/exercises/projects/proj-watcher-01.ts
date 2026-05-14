import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-watcher-01',
  title: 'File Watcher — File Snapshot',
  category: 'Projects',
  subcategory: 'File Watcher',
  difficulty: 'intermediate',
  order: 149,
  description: `Build a snapshot of file metadata for a directory tree.

Implement:
- FileInfo struct with fields: Name (string), Size (int64), ModTime (time.Time), IsDir (bool)
- Snapshot(dir string) (map[string]FileInfo, error) — walk the directory tree, collecting metadata for every file keyed by its path relative to dir

Rules:
- Only include regular files, not directories themselves
- Handle nested directories by recursing into them
- Relative paths should use forward slashes (filepath.ToSlash)
- Return an error if the root directory doesn't exist

This is the foundation for a polling-based file watcher.`,
  code: `package main

import (
\t"os"
\t"time"
)

// FileInfo holds metadata about a single file.
type FileInfo struct {
\tName    string
\tSize    int64
\tModTime time.Time
\tIsDir   bool
}

// TODO: Implement Snapshot(dir string) (map[string]FileInfo, error)
// Walk the directory tree rooted at dir.
// For each regular file, add an entry to the map keyed by its
// path relative to dir (use forward slashes).
// Skip directories themselves — only include files.

// Hint: use os.ReadDir for listing and os.Stat or entry.Info() for metadata.
// Use filepath.Rel to compute relative paths and filepath.ToSlash to normalise.

func main() {}
`,
  testCode: `package main

import (
\t"os"
\t"path/filepath"
\t"testing"
\t"time"
)

func TestSnapshotEmptyDir(t *testing.T) {
\tdir := t.TempDir()
\tsnap, err := Snapshot(dir)
\tif err != nil {
\t\tt.Fatalf("unexpected error: %v", err)
\t}
\tif len(snap) != 0 {
\t\tt.Fatalf("expected empty snapshot, got %d entries", len(snap))
\t}
}

func TestSnapshotSingleFile(t *testing.T) {
\tdir := t.TempDir()
\twriteFile(t, filepath.Join(dir, "hello.txt"), "hello world")

\tsnap, err := Snapshot(dir)
\tif err != nil {
\t\tt.Fatalf("unexpected error: %v", err)
\t}
\tif len(snap) != 1 {
\t\tt.Fatalf("expected 1 entry, got %d", len(snap))
\t}
\tfi, ok := snap["hello.txt"]
\tif !ok {
\t\tt.Fatal("expected key hello.txt in snapshot")
\t}
\tif fi.Name != "hello.txt" {
\t\tt.Fatalf("expected Name hello.txt, got %s", fi.Name)
\t}
\tif fi.Size != 11 {
\t\tt.Fatalf("expected Size 11, got %d", fi.Size)
\t}
\tif fi.IsDir {
\t\tt.Fatal("expected IsDir false")
\t}
}

func TestSnapshotNestedFiles(t *testing.T) {
\tdir := t.TempDir()
\tsubDir := filepath.Join(dir, "sub")
\tif err := os.MkdirAll(subDir, 0755); err != nil {
\t\tt.Fatal(err)
\t}
\twriteFile(t, filepath.Join(dir, "a.txt"), "aaa")
\twriteFile(t, filepath.Join(subDir, "b.txt"), "bbbbb")

\tsnap, err := Snapshot(dir)
\tif err != nil {
\t\tt.Fatalf("unexpected error: %v", err)
\t}
\tif len(snap) != 2 {
\t\tt.Fatalf("expected 2 entries, got %d", len(snap))
\t}
\tif _, ok := snap["a.txt"]; !ok {
\t\tt.Fatal("missing a.txt")
\t}
\tif _, ok := snap["sub/b.txt"]; !ok {
\t\tt.Fatal("missing sub/b.txt — paths should be relative with forward slashes")
\t}
}

func TestSnapshotExcludesDirectories(t *testing.T) {
\tdir := t.TempDir()
\tsubDir := filepath.Join(dir, "mydir")
\tif err := os.MkdirAll(subDir, 0755); err != nil {
\t\tt.Fatal(err)
\t}
\twriteFile(t, filepath.Join(subDir, "file.go"), "package main")

\tsnap, err := Snapshot(dir)
\tif err != nil {
\t\tt.Fatalf("unexpected error: %v", err)
\t}
\tfor k, fi := range snap {
\t\tif fi.IsDir {
\t\t\tt.Fatalf("snapshot should not contain directories, found %s", k)
\t\t}
\t}
\tif len(snap) != 1 {
\t\tt.Fatalf("expected 1 file entry, got %d", len(snap))
\t}
}

func TestSnapshotModTime(t *testing.T) {
\tdir := t.TempDir()
\twriteFile(t, filepath.Join(dir, "ts.txt"), "time check")

\tsnap, err := Snapshot(dir)
\tif err != nil {
\t\tt.Fatalf("unexpected error: %v", err)
\t}
\tfi := snap["ts.txt"]
\tif time.Since(fi.ModTime) > 5*time.Second {
\t\tt.Fatalf("ModTime seems wrong: %v", fi.ModTime)
\t}
}

func TestSnapshotBadDir(t *testing.T) {
\t_, err := Snapshot("/no/such/dir/ever")
\tif err == nil {
\t\tt.Fatal("expected error for nonexistent directory")
\t}
}

func writeFile(t *testing.T, path, content string) {
\tt.Helper()
\tif err := os.WriteFile(path, []byte(content), 0644); err != nil {
\t\tt.Fatal(err)
\t}
}
`,
  solution: `package main

import (
\t"os"
\t"path/filepath"
\t"time"
)

// FileInfo holds metadata about a single file.
type FileInfo struct {
\tName    string
\tSize    int64
\tModTime time.Time
\tIsDir   bool
}

// Snapshot walks dir and returns metadata for every regular file,
// keyed by its path relative to dir using forward slashes.
func Snapshot(dir string) (map[string]FileInfo, error) {
\tresult := make(map[string]FileInfo)

\terr := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
\t\tif err != nil {
\t\t\treturn err
\t\t}
\t\tif info.IsDir() {
\t\t\treturn nil
\t\t}
\t\trel, err := filepath.Rel(dir, path)
\t\tif err != nil {
\t\t\treturn err
\t\t}
\t\trel = filepath.ToSlash(rel)
\t\tresult[rel] = FileInfo{
\t\t\tName:    info.Name(),
\t\t\tSize:    info.Size(),
\t\t\tModTime: info.ModTime(),
\t\t\tIsDir:   false,
\t\t}
\t\treturn nil
\t})
\tif err != nil {
\t\treturn nil, err
\t}
\treturn result, nil
}

func main() {}
`,
  hints: [
    'Use filepath.Walk to recursively visit every entry under dir.',
    'Check info.IsDir() to skip directories — only add regular files to the map.',
    'Use filepath.Rel(dir, path) to compute the relative path from the root.',
    'Normalise path separators with filepath.ToSlash so tests work cross-platform.',
  ],
  projectId: 'proj-watcher',
  projectTitle: 'File Watcher',
  step: 1,
  totalSteps: 5,
}

export default exercise

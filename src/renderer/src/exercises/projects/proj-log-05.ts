import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-log-05',
  title: 'Structured Logger — Log Rotation',
  category: 'Projects',
  subcategory: 'Structured Logger',
  difficulty: 'advanced',
  order: 147,
  projectId: 'proj-log',
  step: 5,
  totalSteps: 6,
  description: `Implement a RotatingWriter that rotates log files when they exceed a size limit.

**Requirements:**
- NewRotatingWriter(path string, maxBytes int64, maxBackups int) (*RotatingWriter, error)
- Write(p []byte) (int, error) — implements io.Writer; after writing, if file size exceeds maxBytes, rotate
- Rotation: rename current file to path.1, shift existing backups up (path.1 → path.2, etc.)
- Delete backups beyond maxBackups
- Close() error — close the underlying file

The RotatingWriter satisfies io.Writer, so it can be passed to NewLoggerWithOutput or NewJSONLogger.`,
  code: `package main

import (
	"fmt"
	"os"
	"sync"
)

// TODO: Define RotatingWriter struct with:
//   - mu sync.Mutex
//   - path string
//   - maxBytes int64
//   - maxBackups int
//   - file *os.File
//   - size int64 (current file size)

// TODO: Implement NewRotatingWriter(path string, maxBytes int64, maxBackups int) (*RotatingWriter, error)
//   - Open/create the file with O_APPEND|O_CREATE|O_WRONLY
//   - Stat the file to get initial size

// TODO: Implement Write(p []byte) (int, error)
//   - Write to file, update size
//   - If size > maxBytes, call rotate()

// TODO: Implement rotate()
//   - Close current file
//   - Shift backups: path.N → path.N+1 (start from maxBackups-1 down to 1)
//   - Rename current path → path.1
//   - Delete any backup beyond maxBackups
//   - Reopen the file fresh

// TODO: Implement Close() error

var _ = fmt.Sprintf
var _ sync.Mutex

func main() {}
`,
  testCode: `package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRotatingWriterBasic(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "app.log")
	rw, err := NewRotatingWriter(path, 1000, 3)
	if err != nil {
		t.Fatal(err)
	}
	defer rw.Close()

	msg := "hello world\\n"
	n, err := rw.Write([]byte(msg))
	if err != nil {
		t.Fatal(err)
	}
	if n != len(msg) {
		t.Fatalf("expected %d bytes written, got %d", len(msg), n)
	}

	data, _ := os.ReadFile(path)
	if string(data) != msg {
		t.Fatalf("file content: %q", string(data))
	}
}

func TestRotatingWriterRotates(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "app.log")
	rw, err := NewRotatingWriter(path, 50, 3)
	if err != nil {
		t.Fatal(err)
	}
	defer rw.Close()

	// Write enough to trigger rotation
	for i := 0; i < 10; i++ {
		rw.Write([]byte(fmt.Sprintf("line %d: some data here\\n", i)))
	}

	// Check backup files exist
	if _, err := os.Stat(path + ".1"); os.IsNotExist(err) {
		t.Error("expected backup .1 to exist")
	}
}

func TestRotatingWriterMaxBackups(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "app.log")
	rw, err := NewRotatingWriter(path, 30, 2)
	if err != nil {
		t.Fatal(err)
	}
	defer rw.Close()

	// Write enough to create many rotations
	for i := 0; i < 20; i++ {
		rw.Write([]byte(fmt.Sprintf("line-%02d: padding data here\\n", i)))
	}

	// .1 and .2 should exist, .3 should not
	if _, err := os.Stat(path + ".1"); os.IsNotExist(err) {
		t.Error("expected .1 to exist")
	}
	if _, err := os.Stat(path + ".2"); os.IsNotExist(err) {
		t.Error("expected .2 to exist")
	}
	if _, err := os.Stat(path + ".3"); !os.IsNotExist(err) {
		t.Error("expected .3 to NOT exist (maxBackups=2)")
	}
}

func TestRotatingWriterContinuesAfterRotation(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "app.log")
	rw, err := NewRotatingWriter(path, 20, 2)
	if err != nil {
		t.Fatal(err)
	}

	rw.Write([]byte("first batch of data!\\n"))
	rw.Write([]byte("second batch\\n"))
	rw.Close()

	data, _ := os.ReadFile(path)
	if !strings.Contains(string(data), "second batch") {
		t.Errorf("current file should contain latest data: %q", string(data))
	}
}

func TestRotatingWriterNewFileAfterClose(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "app.log")
	rw, err := NewRotatingWriter(path, 1000, 1)
	if err != nil {
		t.Fatal(err)
	}
	rw.Write([]byte("data"))
	rw.Close()

	rw2, err := NewRotatingWriter(path, 1000, 1)
	if err != nil {
		t.Fatal(err)
	}
	rw2.Write([]byte(" more"))
	rw2.Close()

	data, _ := os.ReadFile(path)
	if string(data) != "data more" {
		t.Fatalf("expected appended data, got %q", string(data))
	}
}
`,
  solution: `package main

import (
	"fmt"
	"os"
	"sync"
)

type RotatingWriter struct {
	mu         sync.Mutex
	path       string
	maxBytes   int64
	maxBackups int
	file       *os.File
	size       int64
}

func NewRotatingWriter(path string, maxBytes int64, maxBackups int) (*RotatingWriter, error) {
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, err
	}
	info, err := f.Stat()
	if err != nil {
		f.Close()
		return nil, err
	}
	return &RotatingWriter{
		path:       path,
		maxBytes:   maxBytes,
		maxBackups: maxBackups,
		file:       f,
		size:       info.Size(),
	}, nil
}

func (rw *RotatingWriter) Write(p []byte) (int, error) {
	rw.mu.Lock()
	defer rw.mu.Unlock()

	n, err := rw.file.Write(p)
	rw.size += int64(n)
	if err != nil {
		return n, err
	}

	if rw.size > rw.maxBytes {
		rw.rotate()
	}
	return n, nil
}

func (rw *RotatingWriter) rotate() {
	rw.file.Close()

	// Delete the oldest backup if it would exceed maxBackups
	oldest := fmt.Sprintf("%s.%d", rw.path, rw.maxBackups)
	os.Remove(oldest)

	// Shift backups up: .2 → .3, .1 → .2, etc.
	for i := rw.maxBackups - 1; i >= 1; i-- {
		src := fmt.Sprintf("%s.%d", rw.path, i)
		dst := fmt.Sprintf("%s.%d", rw.path, i+1)
		os.Rename(src, dst)
	}

	// Rename current file to .1
	os.Rename(rw.path, rw.path+".1")

	// Open a fresh file
	rw.file, _ = os.OpenFile(rw.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	rw.size = 0
}

func (rw *RotatingWriter) Close() error {
	rw.mu.Lock()
	defer rw.mu.Unlock()
	return rw.file.Close()
}

func main() {}
`,
  hints: [
    'Track current file size as an int64 field. Update it after every Write.',
    'rotate() closes the file, shifts backups from N-1 down to 1, renames current to .1, then reopens fresh.',
    'Use os.Rename for shifting. It silently fails if the source does not exist, which is fine.',
    'Delete the oldest backup (path.maxBackups) before shifting, so you never exceed the limit.',
  ],
}

export default exercise

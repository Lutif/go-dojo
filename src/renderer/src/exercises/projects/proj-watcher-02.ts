import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-watcher-02',
  title: 'File Watcher — Change Detection',
  category: 'Projects',
  subcategory: 'File Watcher',
  difficulty: 'intermediate',
  order: 150,
  projectId: 'proj-watcher',
  step: 2,
  totalSteps: 5,
  description: `Compare two snapshots to detect which files were created, modified, or deleted.

**Implement:**
- ChangeType constants: Created, Modified, Deleted
- Change struct { Path string; Type ChangeType }
- Diff(old, new map[string]FileInfo) []Change

**Rules:**
- Created: in new but not in old
- Deleted: in old but not in new
- Modified: in both but Size or ModTime differs
- Sort results by Path for deterministic output`,
  code: `package main

import (
	"os"
	"path/filepath"
	"sort"
	"time"
)

// FileInfo from Step 1
type FileInfo struct {
	Name    string
	Size    int64
	ModTime time.Time
	IsDir   bool
}

func Snapshot(dir string) (map[string]FileInfo, error) {
	result := make(map[string]FileInfo)
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		rel, _ := filepath.Rel(dir, path)
		rel = filepath.ToSlash(rel)
		result[rel] = FileInfo{
			Name:    info.Name(),
			Size:    info.Size(),
			ModTime: info.ModTime(),
			IsDir:   false,
		}
		return nil
	})
	return result, err
}

// --- Change Detection ---

type ChangeType int

const (
	Created ChangeType = iota
	Modified
	Deleted
)

type Change struct {
	Path string
	Type ChangeType
}

// TODO: Implement Diff(old, new map[string]FileInfo) []Change
//   - Iterate new: if not in old → Created; if in old but Size or ModTime differs → Modified
//   - Iterate old: if not in new → Deleted
//   - Sort by Path

var _ = sort.Slice

func main() {}
`,
  testCode: `package main

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestDiffCreated(t *testing.T) {
	old := map[string]FileInfo{}
	now := time.Now()
	new_ := map[string]FileInfo{
		"a.txt": {Name: "a.txt", Size: 10, ModTime: now},
	}
	changes := Diff(old, new_)
	if len(changes) != 1 {
		t.Fatalf("expected 1 change, got %d", len(changes))
	}
	if changes[0].Type != Created || changes[0].Path != "a.txt" {
		t.Fatalf("expected Created a.txt, got %+v", changes[0])
	}
}

func TestDiffDeleted(t *testing.T) {
	now := time.Now()
	old := map[string]FileInfo{
		"gone.txt": {Name: "gone.txt", Size: 5, ModTime: now},
	}
	new_ := map[string]FileInfo{}
	changes := Diff(old, new_)
	if len(changes) != 1 {
		t.Fatalf("expected 1 change, got %d", len(changes))
	}
	if changes[0].Type != Deleted || changes[0].Path != "gone.txt" {
		t.Fatalf("expected Deleted gone.txt, got %+v", changes[0])
	}
}

func TestDiffModified(t *testing.T) {
	t1 := time.Now()
	t2 := t1.Add(time.Second)
	old := map[string]FileInfo{
		"f.txt": {Name: "f.txt", Size: 10, ModTime: t1},
	}
	new_ := map[string]FileInfo{
		"f.txt": {Name: "f.txt", Size: 20, ModTime: t2},
	}
	changes := Diff(old, new_)
	if len(changes) != 1 {
		t.Fatalf("expected 1 change, got %d", len(changes))
	}
	if changes[0].Type != Modified {
		t.Fatalf("expected Modified, got %+v", changes[0])
	}
}

func TestDiffNoChanges(t *testing.T) {
	now := time.Now()
	snap := map[string]FileInfo{
		"same.txt": {Name: "same.txt", Size: 10, ModTime: now},
	}
	changes := Diff(snap, snap)
	if len(changes) != 0 {
		t.Fatalf("expected 0 changes, got %d: %+v", len(changes), changes)
	}
}

func TestDiffMixed(t *testing.T) {
	t1 := time.Now()
	t2 := t1.Add(time.Second)
	old := map[string]FileInfo{
		"a.txt": {Name: "a.txt", Size: 10, ModTime: t1},
		"b.txt": {Name: "b.txt", Size: 5, ModTime: t1},
	}
	new_ := map[string]FileInfo{
		"a.txt": {Name: "a.txt", Size: 10, ModTime: t1},
		"c.txt": {Name: "c.txt", Size: 8, ModTime: t2},
	}
	changes := Diff(old, new_)
	if len(changes) != 2 {
		t.Fatalf("expected 2 changes, got %d: %+v", len(changes), changes)
	}
	// Should be sorted: b.txt (Deleted), c.txt (Created)
	if changes[0].Path != "b.txt" || changes[0].Type != Deleted {
		t.Errorf("change 0: expected Deleted b.txt, got %+v", changes[0])
	}
	if changes[1].Path != "c.txt" || changes[1].Type != Created {
		t.Errorf("change 1: expected Created c.txt, got %+v", changes[1])
	}
}

func TestDiffWithRealFiles(t *testing.T) {
	dir := t.TempDir()
	os.WriteFile(filepath.Join(dir, "exist.txt"), []byte("data"), 0644)

	snap1, _ := Snapshot(dir)

	os.WriteFile(filepath.Join(dir, "new.txt"), []byte("new"), 0644)

	snap2, _ := Snapshot(dir)
	changes := Diff(snap1, snap2)

	found := false
	for _, c := range changes {
		if c.Path == "new.txt" && c.Type == Created {
			found = true
		}
	}
	if !found {
		t.Errorf("expected Created new.txt in changes: %+v", changes)
	}
}
`,
  solution: `package main

import (
	"os"
	"path/filepath"
	"sort"
	"time"
)

type FileInfo struct {
	Name    string
	Size    int64
	ModTime time.Time
	IsDir   bool
}

func Snapshot(dir string) (map[string]FileInfo, error) {
	result := make(map[string]FileInfo)
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		rel, _ := filepath.Rel(dir, path)
		rel = filepath.ToSlash(rel)
		result[rel] = FileInfo{
			Name: info.Name(), Size: info.Size(),
			ModTime: info.ModTime(), IsDir: false,
		}
		return nil
	})
	return result, err
}

type ChangeType int

const (
	Created ChangeType = iota
	Modified
	Deleted
)

type Change struct {
	Path string
	Type ChangeType
}

func Diff(old, new_ map[string]FileInfo) []Change {
	var changes []Change

	for path, newInfo := range new_ {
		oldInfo, exists := old[path]
		if !exists {
			changes = append(changes, Change{Path: path, Type: Created})
		} else if newInfo.Size != oldInfo.Size || !newInfo.ModTime.Equal(oldInfo.ModTime) {
			changes = append(changes, Change{Path: path, Type: Modified})
		}
	}

	for path := range old {
		if _, exists := new_[path]; !exists {
			changes = append(changes, Change{Path: path, Type: Deleted})
		}
	}

	sort.Slice(changes, func(i, j int) bool {
		return changes[i].Path < changes[j].Path
	})
	return changes
}

func main() {}
`,
  hints: [
    'Iterate the new map first: keys not in old are Created, keys in both with different Size or ModTime are Modified.',
    'Then iterate old: keys not in new are Deleted.',
    'Use sort.Slice to sort by Path for deterministic output.',
    'Compare ModTime with .Equal() instead of == to handle timezone differences.',
  ],
}

export default exercise

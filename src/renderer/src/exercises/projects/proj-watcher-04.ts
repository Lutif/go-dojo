import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-watcher-04',
  title: 'File Watcher — Pattern Filtering',
  category: 'Projects',
  subcategory: 'File Watcher',
  difficulty: 'advanced',
  order: 152,
  projectId: 'proj-watcher',
  step: 4,
  totalSteps: 5,
  description: `Add glob pattern filtering so the watcher only reports changes to files matching certain patterns.

**Implement FilteredWatcher:**
- NewFilteredWatcher(dir string, interval time.Duration) *FilteredWatcher
- Include(pattern string) — add an include pattern (e.g. "*.go"). If any include patterns are set, only matching files pass.
- Exclude(pattern string) — add an exclude pattern (e.g. "*.tmp"). Exclude always rejects, even if include matches.
- Start(ctx context.Context) <-chan []Change — like Watcher.Start but filters changes

Use filepath.Match for glob matching. Match against the filename (not the full path).`,
  code: `package main

import (
	"context"
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
	filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		rel, _ := filepath.Rel(dir, path)
		rel = filepath.ToSlash(rel)
		result[rel] = FileInfo{Name: info.Name(), Size: info.Size(), ModTime: info.ModTime()}
		return nil
	})
	return result, nil
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
	for p, ni := range new_ {
		oi, ok := old[p]
		if !ok {
			changes = append(changes, Change{Path: p, Type: Created})
		} else if ni.Size != oi.Size || !ni.ModTime.Equal(oi.ModTime) {
			changes = append(changes, Change{Path: p, Type: Modified})
		}
	}
	for p := range old {
		if _, ok := new_[p]; !ok {
			changes = append(changes, Change{Path: p, Type: Deleted})
		}
	}
	sort.Slice(changes, func(i, j int) bool { return changes[i].Path < changes[j].Path })
	return changes
}

// --- Filtered Watcher ---

// TODO: Define FilteredWatcher with dir, interval, includes []string, excludes []string

// TODO: Implement NewFilteredWatcher, Include, Exclude

// TODO: Implement matches(name string) bool
//   - If excludes match, return false
//   - If includes are set and none match, return false
//   - Otherwise return true

// TODO: Implement Start(ctx context.Context) <-chan []Change
//   - Like Watcher.Start but filter changes through matches()

func main() {}
`,
  testCode: `package main

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestFilteredInclude(t *testing.T) {
	dir := t.TempDir()
	fw := NewFilteredWatcher(dir, 30*time.Millisecond)
	fw.Include("*.go")

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	ch := fw.Start(ctx)

	time.Sleep(20 * time.Millisecond)
	os.WriteFile(filepath.Join(dir, "main.go"), []byte("package main"), 0644)
	os.WriteFile(filepath.Join(dir, "notes.txt"), []byte("ignore me"), 0644)

	var goFound, txtFound bool
	for changes := range ch {
		for _, c := range changes {
			if c.Path == "main.go" {
				goFound = true
			}
			if c.Path == "notes.txt" {
				txtFound = true
			}
		}
		if goFound {
			break
		}
	}
	if !goFound {
		t.Error("*.go include should allow main.go")
	}
	if txtFound {
		t.Error("*.go include should block notes.txt")
	}
}

func TestFilteredExclude(t *testing.T) {
	dir := t.TempDir()
	fw := NewFilteredWatcher(dir, 30*time.Millisecond)
	fw.Exclude("*.tmp")

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	ch := fw.Start(ctx)

	time.Sleep(20 * time.Millisecond)
	os.WriteFile(filepath.Join(dir, "data.txt"), []byte("keep"), 0644)
	os.WriteFile(filepath.Join(dir, "cache.tmp"), []byte("skip"), 0644)

	var txtFound, tmpFound bool
	for changes := range ch {
		for _, c := range changes {
			if c.Path == "data.txt" {
				txtFound = true
			}
			if c.Path == "cache.tmp" {
				tmpFound = true
			}
		}
		if txtFound {
			break
		}
	}
	if !txtFound {
		t.Error("data.txt should pass (not excluded)")
	}
	if tmpFound {
		t.Error("cache.tmp should be excluded")
	}
}

func TestFilteredNoPatterns(t *testing.T) {
	dir := t.TempDir()
	fw := NewFilteredWatcher(dir, 30*time.Millisecond)

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	ch := fw.Start(ctx)

	time.Sleep(20 * time.Millisecond)
	os.WriteFile(filepath.Join(dir, "any.xyz"), []byte("data"), 0644)

	var found bool
	for changes := range ch {
		for _, c := range changes {
			if c.Path == "any.xyz" {
				found = true
			}
		}
		if found {
			break
		}
	}
	if !found {
		t.Error("no patterns = all files should pass")
	}
}

func TestFilteredExcludeOverridesInclude(t *testing.T) {
	dir := t.TempDir()
	fw := NewFilteredWatcher(dir, 30*time.Millisecond)
	fw.Include("*.go")
	fw.Exclude("*_test.go")

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	ch := fw.Start(ctx)

	time.Sleep(20 * time.Millisecond)
	os.WriteFile(filepath.Join(dir, "main.go"), []byte("package main"), 0644)
	os.WriteFile(filepath.Join(dir, "main_test.go"), []byte("package main"), 0644)

	var mainFound, testFound bool
	for changes := range ch {
		for _, c := range changes {
			if c.Path == "main.go" {
				mainFound = true
			}
			if c.Path == "main_test.go" {
				testFound = true
			}
		}
		if mainFound {
			break
		}
	}
	if !mainFound {
		t.Error("main.go should pass include")
	}
	if testFound {
		t.Error("main_test.go should be excluded even though *.go matches")
	}
}
`,
  solution: `package main

import (
	"context"
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
	filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		rel, _ := filepath.Rel(dir, path)
		rel = filepath.ToSlash(rel)
		result[rel] = FileInfo{Name: info.Name(), Size: info.Size(), ModTime: info.ModTime()}
		return nil
	})
	return result, nil
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
	for p, ni := range new_ {
		oi, ok := old[p]
		if !ok {
			changes = append(changes, Change{Path: p, Type: Created})
		} else if ni.Size != oi.Size || !ni.ModTime.Equal(oi.ModTime) {
			changes = append(changes, Change{Path: p, Type: Modified})
		}
	}
	for p := range old {
		if _, ok := new_[p]; !ok {
			changes = append(changes, Change{Path: p, Type: Deleted})
		}
	}
	sort.Slice(changes, func(i, j int) bool { return changes[i].Path < changes[j].Path })
	return changes
}

type FilteredWatcher struct {
	dir      string
	interval time.Duration
	includes []string
	excludes []string
}

func NewFilteredWatcher(dir string, interval time.Duration) *FilteredWatcher {
	return &FilteredWatcher{dir: dir, interval: interval}
}

func (fw *FilteredWatcher) Include(pattern string) {
	fw.includes = append(fw.includes, pattern)
}

func (fw *FilteredWatcher) Exclude(pattern string) {
	fw.excludes = append(fw.excludes, pattern)
}

func (fw *FilteredWatcher) matches(name string) bool {
	base := filepath.Base(name)
	for _, pat := range fw.excludes {
		if matched, _ := filepath.Match(pat, base); matched {
			return false
		}
	}
	if len(fw.includes) > 0 {
		for _, pat := range fw.includes {
			if matched, _ := filepath.Match(pat, base); matched {
				return true
			}
		}
		return false
	}
	return true
}

func (fw *FilteredWatcher) Start(ctx context.Context) <-chan []Change {
	out := make(chan []Change)
	go func() {
		defer close(out)
		prev, _ := Snapshot(fw.dir)
		ticker := time.NewTicker(fw.interval)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				current, _ := Snapshot(fw.dir)
				changes := Diff(prev, current)
				var filtered []Change
				for _, c := range changes {
					if fw.matches(c.Path) {
						filtered = append(filtered, c)
					}
				}
				if len(filtered) > 0 {
					select {
					case out <- filtered:
					case <-ctx.Done():
						return
					}
				}
				prev = current
			}
		}
	}()
	return out
}

func main() {}
`,
  hints: [
    'matches() checks excludes first (any match → reject), then includes (if set, at least one must match).',
    'Use filepath.Match(pattern, filepath.Base(name)) to match against just the filename.',
    'Filter the changes slice after Diff — only send changes that pass matches().',
    'No includes and no excludes means all files pass (return true).',
  ],
}

export default exercise

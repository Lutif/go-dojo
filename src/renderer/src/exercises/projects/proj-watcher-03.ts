import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-watcher-03',
  title: 'File Watcher — Polling Watcher',
  category: 'Projects',
  subcategory: 'File Watcher',
  difficulty: 'advanced',
  order: 151,
  projectId: 'proj-watcher',
  step: 3,
  totalSteps: 5,
  description: `Build a polling-based file watcher that emits change events on a channel.

**Implement Watcher:**
- NewWatcher(dir string, interval time.Duration) *Watcher
- Start(ctx context.Context) <-chan []Change — takes initial snapshot, then polls at interval. Emits batches of changes on the channel when diffs are detected. Stops and closes the channel when ctx is cancelled.

The watcher runs in a goroutine. Each poll cycle: take a new snapshot, diff against the previous one, send any changes. No changes = no send.`,
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
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		rel, _ := filepath.Rel(dir, path)
		rel = filepath.ToSlash(rel)
		result[rel] = FileInfo{Name: info.Name(), Size: info.Size(), ModTime: info.ModTime()}
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
	sort.Slice(changes, func(i, j int) bool { return changes[i].Path < changes[j].Path })
	return changes
}

// --- Polling Watcher ---

// TODO: Define Watcher struct with dir and interval fields

// TODO: Implement NewWatcher(dir string, interval time.Duration) *Watcher

// TODO: Implement Start(ctx context.Context) <-chan []Change
//   - Take initial snapshot
//   - Use time.Ticker for polling
//   - On each tick: snapshot, diff, send changes if any
//   - Stop on ctx.Done(), close the output channel

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

func TestWatcherDetectsCreation(t *testing.T) {
	dir := t.TempDir()
	w := NewWatcher(dir, 30*time.Millisecond)
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	ch := w.Start(ctx)

	// Create a file after watcher starts
	time.Sleep(20 * time.Millisecond)
	os.WriteFile(filepath.Join(dir, "new.txt"), []byte("hello"), 0644)

	var found bool
	for changes := range ch {
		for _, c := range changes {
			if c.Path == "new.txt" && c.Type == Created {
				found = true
			}
		}
		if found {
			break
		}
	}
	if !found {
		t.Error("watcher should detect new file creation")
	}
}

func TestWatcherStopsOnCancel(t *testing.T) {
	dir := t.TempDir()
	w := NewWatcher(dir, 20*time.Millisecond)
	ctx, cancel := context.WithCancel(context.Background())

	ch := w.Start(ctx)
	time.Sleep(50 * time.Millisecond)
	cancel()

	// Channel should close
	timeout := time.After(500 * time.Millisecond)
	for {
		select {
		case _, ok := <-ch:
			if !ok {
				return // success
			}
		case <-timeout:
			t.Fatal("channel should close after cancel")
		}
	}
}

func TestWatcherNoChangesNoSend(t *testing.T) {
	dir := t.TempDir()
	os.WriteFile(filepath.Join(dir, "stable.txt"), []byte("data"), 0644)

	w := NewWatcher(dir, 20*time.Millisecond)
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	ch := w.Start(ctx)
	count := 0
	for range ch {
		count++
	}
	if count != 0 {
		t.Errorf("expected 0 change events for stable dir, got %d", count)
	}
}

func TestWatcherDetectsDeletion(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "temp.txt")
	os.WriteFile(path, []byte("data"), 0644)

	w := NewWatcher(dir, 30*time.Millisecond)
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	ch := w.Start(ctx)

	time.Sleep(20 * time.Millisecond)
	os.Remove(path)

	var found bool
	for changes := range ch {
		for _, c := range changes {
			if c.Path == "temp.txt" && c.Type == Deleted {
				found = true
			}
		}
		if found {
			break
		}
	}
	if !found {
		t.Error("watcher should detect file deletion")
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
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		rel, _ := filepath.Rel(dir, path)
		rel = filepath.ToSlash(rel)
		result[rel] = FileInfo{Name: info.Name(), Size: info.Size(), ModTime: info.ModTime()}
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
	sort.Slice(changes, func(i, j int) bool { return changes[i].Path < changes[j].Path })
	return changes
}

type Watcher struct {
	dir      string
	interval time.Duration
}

func NewWatcher(dir string, interval time.Duration) *Watcher {
	return &Watcher{dir: dir, interval: interval}
}

func (w *Watcher) Start(ctx context.Context) <-chan []Change {
	out := make(chan []Change)
	go func() {
		defer close(out)
		prev, err := Snapshot(w.dir)
		if err != nil {
			return
		}
		ticker := time.NewTicker(w.interval)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				current, err := Snapshot(w.dir)
				if err != nil {
					continue
				}
				changes := Diff(prev, current)
				if len(changes) > 0 {
					select {
					case out <- changes:
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
    'Use time.NewTicker for the polling interval. Remember to Stop() it when done.',
    'In the goroutine: select on ticker.C and ctx.Done(). On tick, snapshot + diff.',
    'Only send to the output channel when there are actual changes (len > 0).',
    'Use a nested select when sending to out, also checking ctx.Done() to avoid blocking on a cancelled context.',
  ],
}

export default exercise

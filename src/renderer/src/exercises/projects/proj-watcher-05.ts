import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-watcher-05',
  title: 'File Watcher — Debounced Events & Listeners',
  category: 'Projects',
  subcategory: 'File Watcher',
  difficulty: 'expert',
  order: 153,
  projectId: 'proj-watcher',
  step: 5,
  totalSteps: 5,
  description: `Add event debouncing and a listener registry so multiple consumers can react to file changes.

**Implement DebouncedWatcher:**
- NewDebouncedWatcher(dir string, pollInterval, debounce time.Duration) *DebouncedWatcher
- AddListener(fn func([]Change)) int — register a callback, return a listener ID
- RemoveListener(id int) — unregister a listener
- Start(ctx context.Context) error — blocks until ctx is cancelled

**Debouncing:** After detecting changes, wait for the debounce duration. If more changes arrive during that window, reset the timer. Only fire listeners once the debounce window expires with no new changes.

Thread-safe listener management with sync.Mutex.`,
  code: `package main

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"sync"
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

// --- Debounced Watcher ---

// TODO: Define DebouncedWatcher struct

// TODO: Implement NewDebouncedWatcher(dir string, pollInterval, debounce time.Duration) *DebouncedWatcher

// TODO: Implement AddListener(fn func([]Change)) int

// TODO: Implement RemoveListener(id int)

// TODO: Implement Start(ctx context.Context) error
//   Poll at pollInterval, accumulate changes, reset debounce timer on each new batch.
//   Fire all listeners when debounce window expires.

func main() {}
`,
  testCode: `package main

import (
	"context"
	"os"
	"path/filepath"
	"sync"
	"testing"
	"time"
)

func TestDebouncedWatcherBasic(t *testing.T) {
	dir := t.TempDir()

	dw := NewDebouncedWatcher(dir, 20*time.Millisecond, 50*time.Millisecond)
	if dw == nil {
		t.Fatal("NewDebouncedWatcher returned nil")
	}

	var mu sync.Mutex
	var received []Change
	dw.AddListener(func(changes []Change) {
		mu.Lock()
		received = append(received, changes...)
		mu.Unlock()
	})

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	go dw.Start(ctx)
	time.Sleep(30 * time.Millisecond)

	os.WriteFile(filepath.Join(dir, "test.txt"), []byte("hello"), 0644)

	time.Sleep(200 * time.Millisecond)

	mu.Lock()
	defer mu.Unlock()
	if len(received) == 0 {
		t.Error("expected at least one change event")
	}
}

func TestDebouncedWatcherDebounces(t *testing.T) {
	dir := t.TempDir()

	dw := NewDebouncedWatcher(dir, 15*time.Millisecond, 60*time.Millisecond)

	var mu sync.Mutex
	callCount := 0
	dw.AddListener(func(changes []Change) {
		mu.Lock()
		callCount++
		mu.Unlock()
	})

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	go dw.Start(ctx)
	time.Sleep(20 * time.Millisecond)

	// Rapid file changes within debounce window
	for i := 0; i < 5; i++ {
		os.WriteFile(filepath.Join(dir, "rapid.txt"), []byte{byte(i)}, 0644)
		time.Sleep(15 * time.Millisecond)
	}

	time.Sleep(150 * time.Millisecond)

	mu.Lock()
	defer mu.Unlock()
	if callCount > 2 {
		t.Errorf("debounce should reduce calls, got %d (expected 1-2)", callCount)
	}
}

func TestDebouncedWatcherMultipleListeners(t *testing.T) {
	dir := t.TempDir()

	dw := NewDebouncedWatcher(dir, 20*time.Millisecond, 40*time.Millisecond)

	var mu sync.Mutex
	count1, count2 := 0, 0
	dw.AddListener(func(changes []Change) {
		mu.Lock()
		count1++
		mu.Unlock()
	})
	dw.AddListener(func(changes []Change) {
		mu.Lock()
		count2++
		mu.Unlock()
	})

	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
	defer cancel()

	go dw.Start(ctx)
	time.Sleep(30 * time.Millisecond)

	os.WriteFile(filepath.Join(dir, "multi.txt"), []byte("data"), 0644)
	time.Sleep(150 * time.Millisecond)

	mu.Lock()
	defer mu.Unlock()
	if count1 == 0 || count2 == 0 {
		t.Errorf("both listeners should fire: count1=%d count2=%d", count1, count2)
	}
}

func TestDebouncedWatcherRemoveListener(t *testing.T) {
	dir := t.TempDir()

	dw := NewDebouncedWatcher(dir, 20*time.Millisecond, 40*time.Millisecond)

	var mu sync.Mutex
	count := 0
	id := dw.AddListener(func(changes []Change) {
		mu.Lock()
		count++
		mu.Unlock()
	})

	dw.RemoveListener(id)

	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	go dw.Start(ctx)
	time.Sleep(30 * time.Millisecond)

	os.WriteFile(filepath.Join(dir, "removed.txt"), []byte("data"), 0644)
	time.Sleep(150 * time.Millisecond)

	mu.Lock()
	defer mu.Unlock()
	if count != 0 {
		t.Errorf("removed listener should not fire, got %d calls", count)
	}
}

func TestDebouncedWatcherStopsOnCancel(t *testing.T) {
	dir := t.TempDir()
	dw := NewDebouncedWatcher(dir, 20*time.Millisecond, 30*time.Millisecond)

	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error)
	go func() {
		done <- dw.Start(ctx)
	}()

	time.Sleep(50 * time.Millisecond)
	cancel()

	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("Start should return after cancel")
	}
}
`,
  solution: `package main

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"sync"
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

type listener struct {
	id int
	fn func([]Change)
}

type DebouncedWatcher struct {
	dir          string
	pollInterval time.Duration
	debounce     time.Duration
	mu           sync.Mutex
	listeners    []listener
	nextID       int
}

func NewDebouncedWatcher(dir string, pollInterval, debounce time.Duration) *DebouncedWatcher {
	return &DebouncedWatcher{
		dir:          dir,
		pollInterval: pollInterval,
		debounce:     debounce,
	}
}

func (dw *DebouncedWatcher) AddListener(fn func([]Change)) int {
	dw.mu.Lock()
	defer dw.mu.Unlock()
	dw.nextID++
	dw.listeners = append(dw.listeners, listener{id: dw.nextID, fn: fn})
	return dw.nextID
}

func (dw *DebouncedWatcher) RemoveListener(id int) {
	dw.mu.Lock()
	defer dw.mu.Unlock()
	for i, l := range dw.listeners {
		if l.id == id {
			dw.listeners = append(dw.listeners[:i], dw.listeners[i+1:]...)
			return
		}
	}
}

func (dw *DebouncedWatcher) fireListeners(changes []Change) {
	dw.mu.Lock()
	ls := make([]listener, len(dw.listeners))
	copy(ls, dw.listeners)
	dw.mu.Unlock()
	for _, l := range ls {
		l.fn(changes)
	}
}

func (dw *DebouncedWatcher) Start(ctx context.Context) error {
	prev, _ := Snapshot(dw.dir)
	ticker := time.NewTicker(dw.pollInterval)
	defer ticker.Stop()

	var accumulated []Change
	var debounceTimer *time.Timer
	var debounceCh <-chan time.Time

	for {
		select {
		case <-ctx.Done():
			if debounceTimer != nil {
				debounceTimer.Stop()
			}
			return ctx.Err()
		case <-ticker.C:
			current, _ := Snapshot(dw.dir)
			changes := Diff(prev, current)
			prev = current
			if len(changes) > 0 {
				accumulated = append(accumulated, changes...)
				if debounceTimer != nil {
					debounceTimer.Stop()
				}
				debounceTimer = time.NewTimer(dw.debounce)
				debounceCh = debounceTimer.C
			}
		case <-debounceCh:
			if len(accumulated) > 0 {
				dw.fireListeners(accumulated)
				accumulated = nil
			}
			debounceCh = nil
			debounceTimer = nil
		}
	}
}

func main() {}
`,
  hints: [
    'Use a time.Timer for the debounce window. Reset it every time new changes arrive.',
    'Accumulate changes across poll cycles. Only fire listeners when the debounce timer expires.',
    'Copy the listeners slice before firing to avoid holding the lock during callbacks.',
    'The select in Start watches ticker.C, debounce timer channel, and ctx.Done() simultaneously.',
  ],
}

export default exercise

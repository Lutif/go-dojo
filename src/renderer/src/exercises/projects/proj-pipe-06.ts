import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pipe-06',
  title: 'Pipeline — Context Cancellation & Tee',
  category: 'Projects',
  subcategory: 'Pipeline Framework',
  difficulty: 'expert',
  order: 136,
  projectId: 'proj-pipe',
  step: 6,
  totalSteps: 6,
  description: `Make every stage respect context cancellation, and add a Tee stage that duplicates items to multiple downstream stages.

**Requirements:**

1. **CancelableMap(fn func(string) string) Stage** — like MapStage but checks ctx.Done() on every iteration. If the context is cancelled, stop processing and close the output channel. No goroutine leaks.

2. **Tee(stages ...Stage) Stage** — sends each input item to ALL given stages in parallel, then merges all their outputs into a single channel. Each stage gets its own copy of the input stream.

3. **Timeout(d time.Duration, inner Stage) Stage** — wraps another stage. For each input item, runs it through the inner stage with a per-item timeout. If the inner stage takes longer than d for an item, that item is dropped.

All stages must stop cleanly when the context is cancelled.`,
  code: `package main

import (
	"context"
	"sync"
	"time"
)

// Stage processes items from an input channel and returns an output channel.
type Stage interface {
	Process(ctx context.Context, in <-chan string) <-chan string
}

// Source creates a channel and sends all items to it, then closes the channel.
func Source(items ...string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for _, item := range items {
			out <- item
		}
	}()
	return out
}

// Run chains the source through each Stage in order and collects the results.
func Run(ctx context.Context, source <-chan string, stages ...Stage) []string {
	ch := source
	for _, stage := range stages {
		ch = stage.Process(ctx, ch)
	}
	var results []string
	for item := range ch {
		results = append(results, item)
	}
	return results
}

// --- Implement below ---

// TODO: Implement CancelableMap(fn func(string) string) Stage

// TODO: Implement Tee(stages ...Stage) Stage

// TODO: Implement Timeout(d time.Duration, inner Stage) Stage

// Hint: use these imports
var _ = sync.WaitGroup{}
var _ time.Duration

func main() {}
`,
  testCode: `package main

import (
	"context"
	"sort"
	"strings"
	"testing"
	"time"
)

func TestCancelableMapBasic(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source("a", "b", "c"), CancelableMap(strings.ToUpper))
	if len(result) != 3 {
		t.Fatalf("expected 3, got %d: %v", len(result), result)
	}
	sort.Strings(result)
	if result[0] != "A" || result[1] != "B" || result[2] != "C" {
		t.Fatalf("expected [A B C], got %v", result)
	}
}

func TestCancelableMapStopsOnCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())

	// Create a slow source
	slowSource := make(chan string)
	go func() {
		defer close(slowSource)
		for i := 0; i < 100; i++ {
			select {
			case slowSource <- "item":
			case <-ctx.Done():
				return
			}
			time.Sleep(5 * time.Millisecond)
		}
	}()

	done := make(chan []string)
	go func() {
		done <- Run(ctx, slowSource, CancelableMap(strings.ToUpper))
	}()

	time.Sleep(30 * time.Millisecond)
	cancel()

	result := <-done
	if len(result) >= 100 {
		t.Fatalf("should have stopped early, got %d items", len(result))
	}
}

func TestTeeBasic(t *testing.T) {
	ctx := context.Background()
	upper := CancelableMap(strings.ToUpper)
	addBang := CancelableMap(func(s string) string { return s + "!" })

	result := Run(ctx, Source("a", "b"), Tee(upper, addBang))
	sort.Strings(result)
	// Should get: A, B (from upper) and a!, b! (from addBang)
	expected := []string{"A", "B", "a!", "b!"}
	sort.Strings(expected)

	if len(result) != len(expected) {
		t.Fatalf("expected %d items, got %d: %v", len(expected), len(result), result)
	}
	for i := range expected {
		if result[i] != expected[i] {
			t.Errorf("index %d: got %q, want %q", i, result[i], expected[i])
		}
	}
}

func TestTeeSingleStage(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source("x"), Tee(CancelableMap(strings.ToUpper)))
	if len(result) != 1 || result[0] != "X" {
		t.Fatalf("expected [X], got %v", result)
	}
}

func TestTimeoutDropsSlow(t *testing.T) {
	ctx := context.Background()
	slow := CancelableMap(func(s string) string {
		if s == "slow" {
			time.Sleep(100 * time.Millisecond)
		}
		return s
	})

	result := Run(ctx, Source("fast", "slow", "fast2"), Timeout(30*time.Millisecond, slow))
	sort.Strings(result)
	// "slow" should be dropped
	if len(result) != 2 {
		t.Fatalf("expected 2 items (slow dropped), got %d: %v", len(result), result)
	}
}

func TestTimeoutKeepsFast(t *testing.T) {
	ctx := context.Background()
	fast := CancelableMap(strings.ToUpper)
	result := Run(ctx, Source("a", "b", "c"), Timeout(1*time.Second, fast))
	sort.Strings(result)
	if len(result) != 3 {
		t.Fatalf("expected 3 items, got %d: %v", len(result), result)
	}
}
`,
  solution: `package main

import (
	"context"
	"sync"
	"time"
)

type Stage interface {
	Process(ctx context.Context, in <-chan string) <-chan string
}

func Source(items ...string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for _, item := range items {
			out <- item
		}
	}()
	return out
}

func Run(ctx context.Context, source <-chan string, stages ...Stage) []string {
	ch := source
	for _, stage := range stages {
		ch = stage.Process(ctx, ch)
	}
	var results []string
	for item := range ch {
		results = append(results, item)
	}
	return results
}

type cancelableMap struct{ fn func(string) string }

func (c *cancelableMap) Process(ctx context.Context, in <-chan string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for {
			select {
			case <-ctx.Done():
				return
			case item, ok := <-in:
				if !ok {
					return
				}
				select {
				case out <- c.fn(item):
				case <-ctx.Done():
					return
				}
			}
		}
	}()
	return out
}

func CancelableMap(fn func(string) string) Stage {
	return &cancelableMap{fn: fn}
}

type teeStage struct{ stages []Stage }

func (t *teeStage) Process(ctx context.Context, in <-chan string) <-chan string {
	// Create input channels for each sub-stage
	ins := make([]chan string, len(t.stages))
	for i := range ins {
		ins[i] = make(chan string)
	}

	// Distribute each input item to all sub-stage input channels
	go func() {
		for item := range in {
			for _, ch := range ins {
				ch <- item
			}
		}
		for _, ch := range ins {
			close(ch)
		}
	}()

	// Run each stage and merge outputs
	out := make(chan string)
	var wg sync.WaitGroup
	for i, stage := range t.stages {
		wg.Add(1)
		go func(s Stage, inCh <-chan string) {
			defer wg.Done()
			for item := range s.Process(ctx, inCh) {
				out <- item
			}
		}(stage, ins[i])
	}
	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}

func Tee(stages ...Stage) Stage {
	return &teeStage{stages: stages}
}

type timeoutStage struct {
	d     time.Duration
	inner Stage
}

func (t *timeoutStage) Process(ctx context.Context, in <-chan string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for item := range in {
			// Process each item with a per-item timeout
			itemIn := make(chan string, 1)
			itemIn <- item
			close(itemIn)

			itemCtx, cancel := context.WithTimeout(ctx, t.d)
			resultCh := t.inner.Process(itemCtx, itemIn)

			select {
			case result, ok := <-resultCh:
				if ok {
					out <- result
				}
			case <-itemCtx.Done():
				// Timed out — drop item
			}
			cancel()
		}
	}()
	return out
}

func Timeout(d time.Duration, inner Stage) Stage {
	return &timeoutStage{d: d, inner: inner}
}

func main() {}
`,
  hints: [
    'CancelableMap: use select with ctx.Done() on both the read from in and the write to out. This prevents goroutine leaks when context is cancelled.',
    'Tee: create one input channel per sub-stage. A distributor goroutine sends each item to ALL input channels. Then run each stage and merge outputs with WaitGroup.',
    'Timeout: for each item, create a single-item channel, create a context.WithTimeout, and pass it to inner.Process. Use select to either receive the result or detect timeout.',
  ],
}

export default exercise

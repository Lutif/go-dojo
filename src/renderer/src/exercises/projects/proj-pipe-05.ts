import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pipe-05',
  title: 'Pipeline — Buffering & Batching',
  category: 'Projects',
  subcategory: 'Pipeline Framework',
  difficulty: 'advanced',
  order: 135,
  projectId: 'proj-pipe',
  step: 5,
  totalSteps: 6,
  description: `Add buffering and batching stages to control throughput and grouping in the pipeline.

**Requirements:**

1. **BufferStage(size int) Stage** — inserts a buffered channel of the given size between input and output. Items pass through unchanged, but the buffer decouples producer and consumer speed.

2. **BatchStage(size int) Stage** — collects up to \`size\` items, then emits them joined by comma as a single string. If the input closes with a partial batch, emit it too.
   - Example: items "a","b","c","d","e" with size=2 → "a,b", "c,d", "e"

3. **ThrottleStage(interval time.Duration) Stage** — emits at most one item per interval. The first item passes immediately; subsequent items wait until the interval has elapsed since the last emit.`,
  code: `package main

import (
	"context"
	"strings"
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

// TODO: Implement BufferStage(size int) Stage

// TODO: Implement BatchStage(size int) Stage

// TODO: Implement ThrottleStage(interval time.Duration) Stage

func main() {}
`,
  testCode: `package main

import (
	"context"
	"strings"
	"testing"
	"time"
)

func TestBufferStagePassesAllItems(t *testing.T) {
	ctx := context.Background()
	items := []string{"a", "b", "c", "d", "e"}
	result := Run(ctx, Source(items...), BufferStage(3))
	if len(result) != 5 {
		t.Fatalf("expected 5 items, got %d: %v", len(result), result)
	}
	for i, want := range items {
		if result[i] != want {
			t.Errorf("index %d: got %q, want %q", i, result[i], want)
		}
	}
}

func TestBufferStageEmpty(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source(), BufferStage(10))
	if len(result) != 0 {
		t.Fatalf("expected 0 items, got %d", len(result))
	}
}

func TestBatchStageExact(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source("a", "b", "c", "d"), BatchStage(2))
	if len(result) != 2 {
		t.Fatalf("expected 2 batches, got %d: %v", len(result), result)
	}
	if result[0] != "a,b" {
		t.Errorf("batch 0: got %q, want %q", result[0], "a,b")
	}
	if result[1] != "c,d" {
		t.Errorf("batch 1: got %q, want %q", result[1], "c,d")
	}
}

func TestBatchStagePartial(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source("a", "b", "c", "d", "e"), BatchStage(2))
	if len(result) != 3 {
		t.Fatalf("expected 3 batches, got %d: %v", len(result), result)
	}
	if result[2] != "e" {
		t.Errorf("partial batch: got %q, want %q", result[2], "e")
	}
}

func TestBatchStageSingle(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source("only"), BatchStage(5))
	if len(result) != 1 || result[0] != "only" {
		t.Fatalf("expected [only], got %v", result)
	}
}

func TestBatchStageEmpty(t *testing.T) {
	ctx := context.Background()
	result := Run(ctx, Source(), BatchStage(3))
	if len(result) != 0 {
		t.Fatalf("expected 0 batches, got %d", len(result))
	}
}

func TestThrottleStageEnforcesInterval(t *testing.T) {
	ctx := context.Background()
	start := time.Now()
	result := Run(ctx, Source("a", "b", "c"), ThrottleStage(30*time.Millisecond))
	elapsed := time.Since(start)

	if len(result) != 3 {
		t.Fatalf("expected 3 items, got %d", len(result))
	}
	// 3 items at 30ms interval: first is immediate, then 2 waits = ~60ms minimum
	if elapsed < 50*time.Millisecond {
		t.Errorf("throttle too fast: %v (expected >= 50ms)", elapsed)
	}
}

func TestThrottleStagePreservesOrder(t *testing.T) {
	ctx := context.Background()
	items := []string{"x", "y", "z"}
	result := Run(ctx, Source(items...), ThrottleStage(5*time.Millisecond))
	for i, want := range items {
		if result[i] != want {
			t.Errorf("index %d: got %q, want %q", i, result[i], want)
		}
	}
}

// Ensure unused imports are consumed
var _ = strings.Join
`,
  solution: `package main

import (
	"context"
	"strings"
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

type bufferStage struct{ size int }

func (b *bufferStage) Process(ctx context.Context, in <-chan string) <-chan string {
	out := make(chan string, b.size)
	go func() {
		defer close(out)
		for item := range in {
			out <- item
		}
	}()
	return out
}

func BufferStage(size int) Stage {
	return &bufferStage{size: size}
}

type batchStage struct{ size int }

func (b *batchStage) Process(ctx context.Context, in <-chan string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		var batch []string
		for item := range in {
			batch = append(batch, item)
			if len(batch) == b.size {
				out <- strings.Join(batch, ",")
				batch = nil
			}
		}
		if len(batch) > 0 {
			out <- strings.Join(batch, ",")
		}
	}()
	return out
}

func BatchStage(size int) Stage {
	return &batchStage{size: size}
}

type throttleStage struct{ interval time.Duration }

func (t *throttleStage) Process(ctx context.Context, in <-chan string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		first := true
		last := time.Now()
		for item := range in {
			if !first {
				elapsed := time.Since(last)
				if elapsed < t.interval {
					time.Sleep(t.interval - elapsed)
				}
			}
			first = false
			out <- item
			last = time.Now()
		}
	}()
	return out
}

func ThrottleStage(interval time.Duration) Stage {
	return &throttleStage{interval: interval}
}

func main() {}
`,
  hints: [
    'BufferStage is the simplest: create a channel with make(chan string, size) and forward all items.',
    'For BatchStage, accumulate items in a slice. When the slice reaches the batch size, join with strings.Join and emit. After the loop ends, emit any remaining partial batch.',
    'ThrottleStage tracks the time of the last emit. Before sending, sleep for the remaining interval if needed. The first item passes immediately.',
  ],
}

export default exercise

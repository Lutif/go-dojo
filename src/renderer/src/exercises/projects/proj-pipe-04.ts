import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pipe-04',
  title: 'Pipeline — Fan-Out / Fan-In',
  category: 'Projects',
  subcategory: 'Pipeline Framework',
  difficulty: 'advanced',
  order: 134,
  projectId: 'proj-pipe',
  step: 4,
  totalSteps: 6,
  description: `Many pipeline stages are embarrassingly parallel. Fan-out distributes work across
multiple goroutines running the same stage; fan-in merges their outputs back into a single channel.

**Requirements:**

Implement **FanOut(stage Stage, workers int) Stage**:
- Launch \`workers\` goroutines, each running its own copy of \`stage.Process\`.
- Distribute incoming items round-robin (or any fair strategy) across the workers.
- Merge all worker outputs into a single output channel.
- Use \`sync.WaitGroup\` to know when all workers are done so you can close the merged output.
- Output ordering is **not** guaranteed (tests sort before comparing).

**Key concurrency points:**
- The distributor goroutine reads from \`in\` and sends to per-worker input channels.
- Each worker reads from its own input channel and writes to a shared output channel.
- A separate goroutine waits on the WaitGroup and closes the output channel.`,
  code: `package main

import (
\t"context"
\t"sync"
)

// Stage processes items from an input channel and returns an output channel.
type Stage interface {
\tProcess(ctx context.Context, in <-chan string) <-chan string
}

// Source creates a channel and sends all items to it, then closes the channel.
func Source(items ...string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor _, item := range items {
\t\t\tout <- item
\t\t}
\t}()
\treturn out
}

// Run chains the source through each Stage in order and collects the results.
func Run(ctx context.Context, source <-chan string, stages ...Stage) []string {
\tch := source
\tfor _, stage := range stages {
\t\tch = stage.Process(ctx, ch)
\t}
\tvar results []string
\tfor item := range ch {
\t\tresults = append(results, item)
\t}
\treturn results
}

// MapStage returns a Stage that applies fn to every item.
func MapStage(fn func(string) string) Stage {
\treturn &mapStage{fn: fn}
}

type mapStage struct{ fn func(string) string }

func (m *mapStage) Process(ctx context.Context, in <-chan string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor item := range in {
\t\t\tout <- m.fn(item)
\t\t}
\t}()
\treturn out
}

// FilterStage returns a Stage that keeps items where fn returns true.
func FilterStage(fn func(string) bool) Stage {
\treturn &filterStage{fn: fn}
}

type filterStage struct{ fn func(string) bool }

func (f *filterStage) Process(ctx context.Context, in <-chan string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor item := range in {
\t\t\tif f.fn(item) {
\t\t\t\tout <- item
\t\t\t}
\t\t}
\t}()
\treturn out
}

// --- Implement FanOut below ---

// FanOut distributes incoming items across N workers running the given stage,
// then merges their outputs into a single channel.
func FanOut(stage Stage, workers int) Stage {
\t// TODO: use sync.WaitGroup
\t_ = sync.WaitGroup{}
\treturn nil
}

func main() {}
`,
  testCode: `package main

import (
\t"context"
\t"fmt"
\t"sort"
\t"strings"
\t"testing"
\t"time"
)

func TestFanOutBasic(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx,
\t\tSource("a", "b", "c", "d", "e"),
\t\tFanOut(MapStage(strings.ToUpper), 3),
\t)
\tsort.Strings(result)
\texpected := []string{"A", "B", "C", "D", "E"}
\tif len(result) != len(expected) {
\t\tt.Fatalf("expected %d items, got %d: %v", len(expected), len(result), result)
\t}
\tfor i, want := range expected {
\t\tif result[i] != want {
\t\t\tt.Errorf("index %d: got %q, want %q", i, result[i], want)
\t\t}
\t}
}

func TestFanOutAllItemsProcessed(t *testing.T) {
\tctx := context.Background()
\titems := make([]string, 100)
\tfor i := range items {
\t\titems[i] = fmt.Sprintf("item-%d", i)
\t}
\tresult := Run(ctx, Source(items...), FanOut(MapStage(strings.ToUpper), 5))
\tif len(result) != 100 {
\t\tt.Fatalf("expected 100 items, got %d", len(result))
\t}
}

func TestFanOutSingleWorker(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx, Source("x", "y"), FanOut(MapStage(strings.ToUpper), 1))
\tsort.Strings(result)
\tif len(result) != 2 || result[0] != "X" || result[1] != "Y" {
\t\tt.Fatalf("expected [X Y], got %v", result)
\t}
}

func TestFanOutSpeedup(t *testing.T) {
\tctx := context.Background()
\tslow := MapStage(func(s string) string {
\t\ttime.Sleep(10 * time.Millisecond)
\t\treturn s
\t})

\titems := make([]string, 12)
\tfor i := range items {
\t\titems[i] = fmt.Sprintf("%d", i)
\t}

\t// Sequential: should take ~120ms
\tstart := time.Now()
\tRun(ctx, Source(items...), slow)
\tseqDur := time.Since(start)

\t// Parallel with 4 workers: should take ~30-40ms
\tstart = time.Now()
\tRun(ctx, Source(items...), FanOut(slow, 4))
\tparDur := time.Since(start)

\t// Parallel should be at least 2x faster
\tif parDur >= seqDur {
\t\tt.Errorf("fan-out was not faster: sequential=%v parallel=%v", seqDur, parDur)
\t}
}

func TestFanOutWithFilter(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx,
\t\tSource("1", "22", "333", "4444", "55555"),
\t\tFanOut(FilterStage(func(s string) bool { return len(s) >= 3 }), 2),
\t)
\tsort.Strings(result)
\tif len(result) != 3 {
\t\tt.Fatalf("expected 3 items, got %d: %v", len(result), result)
\t}
}
`,
  solution: `package main

import (
\t"context"
\t"sync"
)

// Stage processes items from an input channel and returns an output channel.
type Stage interface {
\tProcess(ctx context.Context, in <-chan string) <-chan string
}

// Source creates a channel and sends all items to it, then closes the channel.
func Source(items ...string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor _, item := range items {
\t\t\tout <- item
\t\t}
\t}()
\treturn out
}

// Run chains the source through each Stage in order and collects the results.
func Run(ctx context.Context, source <-chan string, stages ...Stage) []string {
\tch := source
\tfor _, stage := range stages {
\t\tch = stage.Process(ctx, ch)
\t}
\tvar results []string
\tfor item := range ch {
\t\tresults = append(results, item)
\t}
\treturn results
}

// MapStage returns a Stage that applies fn to every item.
func MapStage(fn func(string) string) Stage {
\treturn &mapStage{fn: fn}
}

type mapStage struct{ fn func(string) string }

func (m *mapStage) Process(ctx context.Context, in <-chan string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor item := range in {
\t\t\tout <- m.fn(item)
\t\t}
\t}()
\treturn out
}

// FilterStage returns a Stage that keeps items where fn returns true.
func FilterStage(fn func(string) bool) Stage {
\treturn &filterStage{fn: fn}
}

type filterStage struct{ fn func(string) bool }

func (f *filterStage) Process(ctx context.Context, in <-chan string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor item := range in {
\t\t\tif f.fn(item) {
\t\t\t\tout <- item
\t\t\t}
\t\t}
\t}()
\treturn out
}

type fanOutStage struct {
\tstage   Stage
\tworkers int
}

func (f *fanOutStage) Process(ctx context.Context, in <-chan string) <-chan string {
\t// Create per-worker input channels
\tworkerIns := make([]chan string, f.workers)
\tfor i := range workerIns {
\t\tworkerIns[i] = make(chan string)
\t}

\t// Distributor: round-robin items to worker input channels
\tgo func() {
\t\ti := 0
\t\tfor item := range in {
\t\t\tworkerIns[i%f.workers] <- item
\t\t\ti++
\t\t}
\t\tfor _, ch := range workerIns {
\t\t\tclose(ch)
\t\t}
\t}()

\t// Merged output channel
\tout := make(chan string)
\tvar wg sync.WaitGroup

\t// Launch workers
\tfor i := 0; i < f.workers; i++ {
\t\twg.Add(1)
\t\tgo func(workerIn <-chan string) {
\t\t\tdefer wg.Done()
\t\t\tresultCh := f.stage.Process(ctx, workerIn)
\t\t\tfor item := range resultCh {
\t\t\t\tout <- item
\t\t\t}
\t\t}(workerIns[i])
\t}

\t// Close merged output when all workers are done
\tgo func() {
\t\twg.Wait()
\t\tclose(out)
\t}()

\treturn out
}

// FanOut distributes incoming items across N workers running the given stage,
// then merges their outputs into a single channel.
func FanOut(stage Stage, workers int) Stage {
\treturn &fanOutStage{stage: stage, workers: workers}
}

func main() {}
`,
  hints: [
    'Create one input channel per worker. A distributor goroutine reads from `in` and sends to worker channels round-robin, then closes them all.',
    'Each worker calls stage.Process with its own input channel, then drains the result channel into the shared output.',
    'Use a WaitGroup: Add(1) per worker, Done() when a worker finishes, then a final goroutine that calls Wait() and closes the output channel.',
  ],
}

export default exercise

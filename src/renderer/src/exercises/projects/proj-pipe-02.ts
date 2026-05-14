import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pipe-02',
  title: 'Pipeline — Transform Stages',
  category: 'Projects',
  subcategory: 'Pipeline Framework',
  difficulty: 'intermediate',
  order: 132,
  projectId: 'proj-pipe',
  step: 2,
  totalSteps: 6,
  description: `Now build reusable transform stages that snap into the pipeline.

**Requirements:**

1. **MapStage(fn func(string) string) Stage** — applies fn to each item and sends the result downstream.

2. **FilterStage(fn func(string) bool) Stage** — only forwards items for which fn returns true.

3. **FlatMapStage(fn func(string) []string) Stage** — each input item may produce zero or more output items.

All stages must respect the goroutine pattern: launch a goroutine, defer close(out), read from in, write to out.

Stages are composable: \`Run(ctx, Source("a","b"), MapStage(upper), FilterStage(startsWithA))\` should work.`,
  code: `package main

import (
\t"context"
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

// --- Implement the stages below ---

// MapStage returns a Stage that applies fn to every item.
func MapStage(fn func(string) string) Stage {
\t// TODO
\treturn nil
}

// FilterStage returns a Stage that only forwards items where fn returns true.
func FilterStage(fn func(string) bool) Stage {
\t// TODO
\treturn nil
}

// FlatMapStage returns a Stage that expands each item into zero or more items.
func FlatMapStage(fn func(string) []string) Stage {
\t// TODO
\treturn nil
}

func main() {}
`,
  testCode: `package main

import (
\t"context"
\t"strings"
\t"testing"
)

func TestMapStageUppercase(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx, Source("hello", "world"), MapStage(strings.ToUpper))
\tif len(result) != 2 {
\t\tt.Fatalf("expected 2 items, got %d", len(result))
\t}
\tif result[0] != "HELLO" || result[1] != "WORLD" {
\t\tt.Fatalf("expected [HELLO WORLD], got %v", result)
\t}
}

func TestMapStageEmpty(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx, Source(), MapStage(strings.ToUpper))
\tif len(result) != 0 {
\t\tt.Fatalf("expected empty, got %v", result)
\t}
}

func TestFilterStage(t *testing.T) {
\tctx := context.Background()
\tisLong := func(s string) bool { return len(s) > 3 }
\tresult := Run(ctx, Source("go", "rust", "python", "c"), FilterStage(isLong))
\tif len(result) != 2 {
\t\tt.Fatalf("expected 2 items, got %d: %v", len(result), result)
\t}
\tif result[0] != "rust" || result[1] != "python" {
\t\tt.Fatalf("expected [rust python], got %v", result)
\t}
}

func TestFilterStageNonePass(t *testing.T) {
\tctx := context.Background()
\tnever := func(s string) bool { return false }
\tresult := Run(ctx, Source("a", "b"), FilterStage(never))
\tif len(result) != 0 {
\t\tt.Fatalf("expected empty, got %v", result)
\t}
}

func TestFlatMapStageSplitWords(t *testing.T) {
\tctx := context.Background()
\tsplitWords := func(s string) []string { return strings.Fields(s) }
\tresult := Run(ctx, Source("hello world", "foo bar baz"), FlatMapStage(splitWords))
\tif len(result) != 5 {
\t\tt.Fatalf("expected 5 items, got %d: %v", len(result), result)
\t}
\texpected := []string{"hello", "world", "foo", "bar", "baz"}
\tfor i, want := range expected {
\t\tif result[i] != want {
\t\t\tt.Errorf("index %d: got %q, want %q", i, result[i], want)
\t\t}
\t}
}

func TestFlatMapStageDropItems(t *testing.T) {
\tctx := context.Background()
\tdropShort := func(s string) []string {
\t\tif len(s) > 2 {
\t\t\treturn []string{s}
\t\t}
\t\treturn nil
\t}
\tresult := Run(ctx, Source("go", "rust", "c", "python"), FlatMapStage(dropShort))
\tif len(result) != 2 || result[0] != "rust" || result[1] != "python" {
\t\tt.Fatalf("expected [rust python], got %v", result)
\t}
}

func TestChainedMapAndFilter(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx,
\t\tSource("hello", "world", "hi", "go"),
\t\tMapStage(strings.ToUpper),
\t\tFilterStage(func(s string) bool { return len(s) > 2 }),
\t)
\tif len(result) != 2 || result[0] != "HELLO" || result[1] != "WORLD" {
\t\tt.Fatalf("expected [HELLO WORLD], got %v", result)
\t}
}
`,
  solution: `package main

import (
\t"context"
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

// mapStage applies fn to each item.
type mapStage struct {
\tfn func(string) string
}

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

// MapStage returns a Stage that applies fn to every item.
func MapStage(fn func(string) string) Stage {
\treturn &mapStage{fn: fn}
}

// filterStage keeps items where fn returns true.
type filterStage struct {
\tfn func(string) bool
}

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

// FilterStage returns a Stage that only forwards items where fn returns true.
func FilterStage(fn func(string) bool) Stage {
\treturn &filterStage{fn: fn}
}

// flatMapStage expands each item into zero or more output items.
type flatMapStage struct {
\tfn func(string) []string
}

func (f *flatMapStage) Process(ctx context.Context, in <-chan string) <-chan string {
\tout := make(chan string)
\tgo func() {
\t\tdefer close(out)
\t\tfor item := range in {
\t\t\tfor _, expanded := range f.fn(item) {
\t\t\t\tout <- expanded
\t\t\t}
\t\t}
\t}()
\treturn out
}

// FlatMapStage returns a Stage that expands each item into zero or more items.
func FlatMapStage(fn func(string) []string) Stage {
\treturn &flatMapStage{fn: fn}
}

func main() {}
`,
  hints: [
    'Each stage constructor returns a struct that implements the Stage interface. The Process method launches a goroutine.',
    'For FilterStage, only send to out when fn(item) returns true. Items that fail the predicate are silently dropped.',
    'FlatMapStage iterates over the slice returned by fn and sends each element individually to out.',
  ],
}

export default exercise

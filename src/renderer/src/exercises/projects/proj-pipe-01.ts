import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pipe-01',
  title: 'Pipeline — Stage Interface & Source',
  category: 'Projects',
  subcategory: 'Pipeline Framework',
  difficulty: 'intermediate',
  order: 131,
  projectId: 'proj-pipe',
  projectTitle: 'Pipeline Framework',
  step: 1,
  totalSteps: 6,
  description: `Build a streaming data pipeline framework from scratch! In this first step you will define
the core abstractions and wiring.

**Requirements:**

1. Define a **Stage** interface with a single method:
   - \`Process(ctx context.Context, in <-chan string) <-chan string\`
   A Stage reads from an input channel, transforms items, and writes them to an output channel.

2. Implement a **Source** helper:
   - \`Source(items ...string) <-chan string\`
   It creates a channel, sends every item to it, then closes the channel.

3. Implement the **Run** function that chains everything together:
   - \`Run(ctx context.Context, source <-chan string, stages ...Stage) []string\`
   It threads the source channel through each Stage in order and collects the final output into a slice.

These three pieces form the backbone of every pipeline you will build in the remaining steps.`,
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
\t// TODO: create a channel, launch a goroutine to send items, return the channel
\treturn nil
}

// Run chains the source through each Stage in order and collects the results.
func Run(ctx context.Context, source <-chan string, stages ...Stage) []string {
\t// TODO: thread source through stages, read final channel into a slice
\treturn nil
}

func main() {}
`,
  testCode: `package main

import (
\t"context"
\t"testing"
)

func TestSourceEmpty(t *testing.T) {
\tch := Source()
\tvar got []string
\tfor s := range ch {
\t\tgot = append(got, s)
\t}
\tif len(got) != 0 {
\t\tt.Fatalf("expected empty slice, got %v", got)
\t}
}

func TestSourceSingle(t *testing.T) {
\tch := Source("hello")
\tvar got []string
\tfor s := range ch {
\t\tgot = append(got, s)
\t}
\tif len(got) != 1 || got[0] != "hello" {
\t\tt.Fatalf("expected [hello], got %v", got)
\t}
}

func TestSourceMultiple(t *testing.T) {
\tch := Source("a", "b", "c")
\tvar got []string
\tfor s := range ch {
\t\tgot = append(got, s)
\t}
\tif len(got) != 3 {
\t\tt.Fatalf("expected 3 items, got %d", len(got))
\t}
\tfor i, want := range []string{"a", "b", "c"} {
\t\tif got[i] != want {
\t\t\tt.Errorf("index %d: got %q, want %q", i, got[i], want)
\t\t}
\t}
}

func TestRunNoStages(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx, Source("x", "y"))
\tif len(result) != 2 || result[0] != "x" || result[1] != "y" {
\t\tt.Fatalf("expected [x y], got %v", result)
\t}
}

func TestRunEmptySource(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx, Source())
\tif len(result) != 0 {
\t\tt.Fatalf("expected empty, got %v", result)
\t}
}

func TestRunPassthrough(t *testing.T) {
\tctx := context.Background()
\tresult := Run(ctx, Source("a", "b", "c"))
\tif len(result) != 3 {
\t\tt.Fatalf("expected 3 items, got %d", len(result))
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

func main() {}
`,
  hints: [
    'Source should launch a goroutine that ranges over items and sends each one to the channel, then the deferred close fires.',
    'Run passes the source channel to the first stage, takes its output, feeds it to the next stage, and so on. With zero stages the source channel IS the final channel.',
    'Remember to defer close(out) inside goroutines so downstream consumers know the channel is done.',
  ],
}

export default exercise

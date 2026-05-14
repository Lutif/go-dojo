import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-pipe-03',
  title: 'Pipeline — Error Handling',
  category: 'Projects',
  subcategory: 'Pipeline Framework',
  difficulty: 'intermediate',
  order: 133,
  projectId: 'proj-pipe',
  step: 3,
  totalSteps: 6,
  description: `Real pipelines need error handling. In this step you will extend the framework with
a result type that carries either a value or an error.

**Requirements:**

1. Define **Result** struct with fields \`Value string\` and \`Err error\`.

2. Define **ErrStage** interface:
   - \`ProcessWithErr(ctx context.Context, in <-chan Result) <-chan Result\`

3. Implement **ResultSource(items ...string) <-chan Result** — wraps each item in a Result with nil Err.

4. Implement **SafeMap(fn func(string) (string, error)) ErrStage** — applies fn to each item.
   If the input Result already has an error, pass it through unchanged (do not call fn).
   If fn returns an error, wrap it in a Result with empty Value.

5. Implement **RunWithErr(ctx context.Context, source <-chan Result, stages ...ErrStage) ([]string, []error)**
   — collects successful values and errors into separate slices.`,
  code: `package main

import (
\t"context"
)

// Result carries either a successful value or an error.
type Result struct {
\tValue string
\tErr   error
}

// ErrStage processes Result items with error propagation.
type ErrStage interface {
\tProcessWithErr(ctx context.Context, in <-chan Result) <-chan Result
}

// ResultSource creates a channel of Results from plain strings.
func ResultSource(items ...string) <-chan Result {
\t// TODO
\treturn nil
}

// SafeMap returns an ErrStage that applies fn to each item's Value.
// If the input already has an error, it passes through unchanged.
// If fn returns an error, emit a Result with that error and empty Value.
func SafeMap(fn func(string) (string, error)) ErrStage {
\t// TODO
\treturn nil
}

// RunWithErr chains the source through ErrStages and separates values from errors.
func RunWithErr(ctx context.Context, source <-chan Result, stages ...ErrStage) ([]string, []error) {
\t// TODO
\treturn nil, nil
}

func main() {}
`,
  testCode: `package main

import (
\t"context"
\t"fmt"
\t"strconv"
\t"strings"
\t"testing"
)

func TestResultSourceItems(t *testing.T) {
\tch := ResultSource("a", "b")
\tvar results []Result
\tfor r := range ch {
\t\tresults = append(results, r)
\t}
\tif len(results) != 2 {
\t\tt.Fatalf("expected 2 results, got %d", len(results))
\t}
\tfor _, r := range results {
\t\tif r.Err != nil {
\t\t\tt.Errorf("unexpected error: %v", r.Err)
\t\t}
\t}
}

func TestSafeMapAllSucceed(t *testing.T) {
\tctx := context.Background()
\tupper := func(s string) (string, error) { return strings.ToUpper(s), nil }
\tvals, errs := RunWithErr(ctx, ResultSource("hello", "world"), SafeMap(upper))
\tif len(errs) != 0 {
\t\tt.Fatalf("expected no errors, got %v", errs)
\t}
\tif len(vals) != 2 || vals[0] != "HELLO" || vals[1] != "WORLD" {
\t\tt.Fatalf("expected [HELLO WORLD], got %v", vals)
\t}
}

func TestSafeMapSomeFail(t *testing.T) {
\tctx := context.Background()
\tparseNum := func(s string) (string, error) {
\t\tn, err := strconv.Atoi(s)
\t\tif err != nil {
\t\t\treturn "", fmt.Errorf("not a number: %s", s)
\t\t}
\t\treturn fmt.Sprintf("%d", n*2), nil
\t}
\tvals, errs := RunWithErr(ctx, ResultSource("3", "abc", "5", "xyz"), SafeMap(parseNum))
\tif len(vals) != 2 {
\t\tt.Fatalf("expected 2 values, got %d: %v", len(vals), vals)
\t}
\tif vals[0] != "6" || vals[1] != "10" {
\t\tt.Fatalf("expected [6 10], got %v", vals)
\t}
\tif len(errs) != 2 {
\t\tt.Fatalf("expected 2 errors, got %d", len(errs))
\t}
}

func TestSafeMapErrorPassthrough(t *testing.T) {
\tctx := context.Background()
\t// Create a source with a pre-existing error
\tch := make(chan Result, 3)
\tch <- Result{Value: "ok"}
\tch <- Result{Err: fmt.Errorf("prior error")}
\tch <- Result{Value: "also-ok"}
\tclose(ch)

\tcallCount := 0
\tcounter := func(s string) (string, error) {
\t\tcallCount++
\t\treturn s, nil
\t}
\tvals, errs := RunWithErr(ctx, ch, SafeMap(counter))
\tif len(vals) != 2 {
\t\tt.Fatalf("expected 2 values, got %d: %v", len(vals), vals)
\t}
\tif len(errs) != 1 {
\t\tt.Fatalf("expected 1 error, got %d: %v", len(errs), errs)
\t}
\tif callCount != 2 {
\t\tt.Errorf("fn should be called 2 times (skipping error), got %d", callCount)
\t}
}

func TestRunWithErrEmptySource(t *testing.T) {
\tctx := context.Background()
\tupper := func(s string) (string, error) { return strings.ToUpper(s), nil }
\tvals, errs := RunWithErr(ctx, ResultSource(), SafeMap(upper))
\tif len(vals) != 0 || len(errs) != 0 {
\t\tt.Fatalf("expected empty results, got vals=%v errs=%v", vals, errs)
\t}
}
`,
  solution: `package main

import (
\t"context"
)

// Result carries either a successful value or an error.
type Result struct {
\tValue string
\tErr   error
}

// ErrStage processes Result items with error propagation.
type ErrStage interface {
\tProcessWithErr(ctx context.Context, in <-chan Result) <-chan Result
}

// ResultSource creates a channel of Results from plain strings.
func ResultSource(items ...string) <-chan Result {
\tout := make(chan Result)
\tgo func() {
\t\tdefer close(out)
\t\tfor _, item := range items {
\t\t\tout <- Result{Value: item}
\t\t}
\t}()
\treturn out
}

type safeMapStage struct {
\tfn func(string) (string, error)
}

func (s *safeMapStage) ProcessWithErr(ctx context.Context, in <-chan Result) <-chan Result {
\tout := make(chan Result)
\tgo func() {
\t\tdefer close(out)
\t\tfor r := range in {
\t\t\tif r.Err != nil {
\t\t\t\tout <- r
\t\t\t\tcontinue
\t\t\t}
\t\t\tval, err := s.fn(r.Value)
\t\t\tif err != nil {
\t\t\t\tout <- Result{Err: err}
\t\t\t} else {
\t\t\t\tout <- Result{Value: val}
\t\t\t}
\t\t}
\t}()
\treturn out
}

// SafeMap returns an ErrStage that applies fn to each item's Value.
func SafeMap(fn func(string) (string, error)) ErrStage {
\treturn &safeMapStage{fn: fn}
}

// RunWithErr chains the source through ErrStages and separates values from errors.
func RunWithErr(ctx context.Context, source <-chan Result, stages ...ErrStage) ([]string, []error) {
\tch := source
\tfor _, stage := range stages {
\t\tch = stage.ProcessWithErr(ctx, ch)
\t}
\tvar vals []string
\tvar errs []error
\tfor r := range ch {
\t\tif r.Err != nil {
\t\t\terrs = append(errs, r.Err)
\t\t} else {
\t\t\tvals = append(vals, r.Value)
\t\t}
\t}
\treturn vals, errs
}

func main() {}
`,
  hints: [
    'ResultSource is just like Source but wraps each string in a Result{Value: item}.',
    'In SafeMap, check r.Err first. If it is non-nil, forward the Result as-is without calling fn.',
    'RunWithErr is like Run but reads Results and sorts them into two slices based on whether Err is nil.',
  ],
}

export default exercise

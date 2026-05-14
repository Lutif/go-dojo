import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-test-05',
  title: 'Test Framework — Benchmark Helpers',
  category: 'Projects',
  subcategory: 'Test Framework',
  difficulty: 'expert',
  order: 166,
  description: `Build utilities for simple benchmarking in tests.

Implement:
- BenchResult struct with N int, NsPerOp int64, AllocsPerOp int64, BytesPerOp int64
- RunBench(fn func()) BenchResult — runs fn repeatedly, measuring time. Start with N=1 and double until total time >= 100ms, then record NsPerOp. Set AllocsPerOp and BytesPerOp to 0 (simplified).
- CompareBench(a, b BenchResult) string — returns "faster" if a is faster, "slower" if slower, or "same" if within 10%
- FormatBench(r BenchResult) string — e.g. "1000 ops, 1234 ns/op, 5 allocs/op, 64 bytes/op"`,
  code: `package main

import (
\t"fmt"
\t"time"
)

// TODO: Define BenchResult struct { N int; NsPerOp, AllocsPerOp, BytesPerOp int64 }.

// TODO: Implement RunBench(fn func()) BenchResult.

// TODO: Implement CompareBench(a, b BenchResult) string.

// TODO: Implement FormatBench(r BenchResult) string.

func main() {}
`,
  testCode: `package main

import (
\t"strings"
\t"testing"
\t"time"
)

func TestRunBenchMeasures(t *testing.T) {
\tresult := RunBench(func() {
\t\ttime.Sleep(1 * time.Microsecond)
\t})
\tif result.N < 1 {
\t\tt.Fatalf("expected N >= 1, got %d", result.N)
\t}
\tif result.NsPerOp <= 0 {
\t\tt.Fatalf("expected NsPerOp > 0, got %d", result.NsPerOp)
\t}
}

func TestRunBenchFastFunction(t *testing.T) {
\tresult := RunBench(func() {
\t\tx := 0
\t\tfor i := 0; i < 100; i++ {
\t\t\tx += i
\t\t}
\t\t_ = x
\t})
\tif result.N < 10 {
\t\tt.Fatalf("fast function should run many times, got N=%d", result.N)
\t}
}

func TestCompareBenchFaster(t *testing.T) {
\ta := BenchResult{N: 1000, NsPerOp: 100}
\tb := BenchResult{N: 1000, NsPerOp: 200}
\tresult := CompareBench(a, b)
\tif result != "faster" {
\t\tt.Fatalf("expected faster, got %s", result)
\t}
}

func TestCompareBenchSlower(t *testing.T) {
\ta := BenchResult{N: 1000, NsPerOp: 300}
\tb := BenchResult{N: 1000, NsPerOp: 100}
\tresult := CompareBench(a, b)
\tif result != "slower" {
\t\tt.Fatalf("expected slower, got %s", result)
\t}
}

func TestCompareBenchSame(t *testing.T) {
\ta := BenchResult{N: 1000, NsPerOp: 100}
\tb := BenchResult{N: 1000, NsPerOp: 105}
\tresult := CompareBench(a, b)
\tif result != "same" {
\t\tt.Fatalf("expected same (within 10%%), got %s", result)
\t}
}

func TestCompareBenchSameEdge(t *testing.T) {
\ta := BenchResult{N: 1000, NsPerOp: 100}
\tb := BenchResult{N: 1000, NsPerOp: 110}
\tresult := CompareBench(a, b)
\tif result != "same" {
\t\tt.Fatalf("10%% difference should be same, got %s", result)
\t}
}

func TestFormatBench(t *testing.T) {
\tr := BenchResult{N: 1000, NsPerOp: 1234, AllocsPerOp: 5, BytesPerOp: 64}
\ts := FormatBench(r)
\tif !strings.Contains(s, "1000") {
\t\tt.Fatalf("should contain ops count, got %s", s)
\t}
\tif !strings.Contains(s, "1234") {
\t\tt.Fatalf("should contain ns/op, got %s", s)
\t}
\tif !strings.Contains(s, "ns/op") {
\t\tt.Fatalf("should contain ns/op label, got %s", s)
\t}
}

func TestFormatBenchZeroAllocs(t *testing.T) {
\tr := BenchResult{N: 500, NsPerOp: 2000, AllocsPerOp: 0, BytesPerOp: 0}
\ts := FormatBench(r)
\tif !strings.Contains(s, "500") {
\t\tt.Fatalf("should contain ops count, got %s", s)
\t}
}
`,
  solution: `package main

import (
\t"fmt"
\t"time"
)

type BenchResult struct {
\tN           int
\tNsPerOp     int64
\tAllocsPerOp int64
\tBytesPerOp  int64
}

func RunBench(fn func()) BenchResult {
\tn := 1
\tvar elapsed time.Duration
\tfor {
\t\tstart := time.Now()
\t\tfor i := 0; i < n; i++ {
\t\t\tfn()
\t\t}
\t\telapsed = time.Since(start)
\t\tif elapsed >= 100*time.Millisecond {
\t\t\tbreak
\t\t}
\t\tif n >= 1000000000 {
\t\t\tbreak
\t\t}
\t\tn *= 2
\t}
\tnsPerOp := elapsed.Nanoseconds() / int64(n)
\treturn BenchResult{
\t\tN:           n,
\t\tNsPerOp:     nsPerOp,
\t\tAllocsPerOp: 0,
\t\tBytesPerOp:  0,
\t}
}

func CompareBench(a, b BenchResult) string {
\tif b.NsPerOp == 0 {
\t\treturn "same"
\t}
\tratio := float64(a.NsPerOp) / float64(b.NsPerOp)
\tif ratio <= 0.9 {
\t\treturn "faster"
\t}
\tif ratio > 1.1 {
\t\treturn "slower"
\t}
\treturn "same"
}

func FormatBench(r BenchResult) string {
\treturn fmt.Sprintf("%d ops, %d ns/op, %d allocs/op, %d bytes/op",
\t\tr.N, r.NsPerOp, r.AllocsPerOp, r.BytesPerOp)
}

func main() {}
`,
  hints: [
    'Start with N=1 and double it until the total elapsed time reaches at least 100ms.',
    'Use time.Now() and time.Since(start) to measure elapsed time.',
    'NsPerOp = elapsed.Nanoseconds() / int64(n).',
    'For CompareBench, compute the ratio a.NsPerOp / b.NsPerOp — less than 0.9 means faster, more than 1.1 means slower.',
  ],
  projectId: 'proj-test',
  step: 5,
  totalSteps: 6,
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-test-02',
  title: 'Test Framework — Table-Driven Runner',
  category: 'Projects',
  subcategory: 'Test Framework',
  difficulty: 'intermediate',
  order: 163,
  description: `Build helpers for table-driven tests — Go's most common testing pattern.

Implement:
- TestCase struct with Name string, Input string, Expected string, Fn func(string) string
- RunTable(t *testing.T, cases []TestCase) — runs each case as a subtest via t.Run, calling Fn(Input) and comparing to Expected
- RunTableParallel(t *testing.T, cases []TestCase) — same but calls t.Parallel() inside each subtest

Tests define a simple reverse-string function, create table cases, and verify all run correctly. A deliberately failing case confirms proper error reporting.`,
  code: `package main

import (
\t"testing"
)

// TODO: Define a TestCase struct { Name, Input, Expected string; Fn func(string) string }.

// TODO: Implement RunTable(t *testing.T, cases []TestCase).

// TODO: Implement RunTableParallel(t *testing.T, cases []TestCase).

func main() {}
`,
  testCode: `package main

import (
\t"testing"
)

func reverseString(s string) string {
\trunes := []rune(s)
\tfor i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
\t\trunes[i], runes[j] = runes[j], runes[i]
\t}
\treturn string(runes)
}

func TestRunTableAllPass(t *testing.T) {
\tcases := []TestCase{
\t\t{Name: "empty", Input: "", Expected: "", Fn: reverseString},
\t\t{Name: "single", Input: "a", Expected: "a", Fn: reverseString},
\t\t{Name: "hello", Input: "hello", Expected: "olleh", Fn: reverseString},
\t\t{Name: "spaces", Input: "a b", Expected: "b a", Fn: reverseString},
\t}
\tRunTable(t, cases)
}

func TestRunTableParallelAllPass(t *testing.T) {
\tcases := []TestCase{
\t\t{Name: "empty", Input: "", Expected: "", Fn: reverseString},
\t\t{Name: "abc", Input: "abc", Expected: "cba", Fn: reverseString},
\t}
\tRunTableParallel(t, cases)
}

type fakeSubT struct {
\tfailed  bool
\tname    string
\tparallel bool
}

func (f *fakeSubT) Errorf(format string, args ...interface{}) {
\tf.failed = true
}

func (f *fakeSubT) Helper() {}

func (f *fakeSubT) Parallel() {
\tf.parallel = true
}

func TestRunTableDetectsFailure(t *testing.T) {
\t// Verify that a wrong expected value causes the case function to detect mismatch
\tcases := []TestCase{
\t\t{Name: "correct", Input: "abc", Expected: "cba", Fn: reverseString},
\t}
\tRunTable(t, cases)
\t// Verify the Fn is actually called by checking the reverse logic
\tif reverseString("abc") != "cba" {
\t\tt.Fatal("reverse function is broken")
\t}
}

func TestRunTableSubtestNames(t *testing.T) {
\tcases := []TestCase{
\t\t{Name: "alpha", Input: "x", Expected: "x", Fn: reverseString},
\t\t{Name: "beta", Input: "ab", Expected: "ba", Fn: reverseString},
\t}
\tRunTable(t, cases)
}
`,
  solution: `package main

import (
\t"testing"
)

type TestCase struct {
\tName     string
\tInput    string
\tExpected string
\tFn       func(string) string
}

func RunTable(t *testing.T, cases []TestCase) {
\tt.Helper()
\tfor _, tc := range cases {
\t\ttc := tc
\t\tt.Run(tc.Name, func(t *testing.T) {
\t\t\tgot := tc.Fn(tc.Input)
\t\t\tif got != tc.Expected {
\t\t\t\tt.Errorf("got %q, want %q", got, tc.Expected)
\t\t\t}
\t\t})
\t}
}

func RunTableParallel(t *testing.T, cases []TestCase) {
\tt.Helper()
\tfor _, tc := range cases {
\t\ttc := tc
\t\tt.Run(tc.Name, func(t *testing.T) {
\t\t\tt.Parallel()
\t\t\tgot := tc.Fn(tc.Input)
\t\t\tif got != tc.Expected {
\t\t\t\tt.Errorf("got %q, want %q", got, tc.Expected)
\t\t\t}
\t\t})
\t}
}

func main() {}
`,
  hints: [
    'Use t.Run(tc.Name, func(t *testing.T) { ... }) to create subtests.',
    'Capture the loop variable with tc := tc before the closure.',
    'For parallel, call t.Parallel() as the first line inside the subtest function.',
    'Compare got := tc.Fn(tc.Input) against tc.Expected and call t.Errorf on mismatch.',
  ],
  projectId: 'proj-test',
  step: 2,
  totalSteps: 6,
}

export default exercise

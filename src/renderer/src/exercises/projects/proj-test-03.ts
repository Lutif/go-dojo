import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-test-03',
  title: 'Test Framework — Golden File Testing',
  category: 'Projects',
  subcategory: 'Test Framework',
  difficulty: 'advanced',
  order: 164,
  description: `Build a golden-file testing utility that compares function output against saved reference files.

Implement:
- GoldenTest struct with Name string, Input string, Fn func(string) string
- RunGolden(t *testing.T, dir string, tests []GoldenTest) — for each test, run Fn(Input) and compare against dir/Name.golden. If the golden file doesn't exist, create it with the current output.
- CompareGolden(t *testing.T, got string, goldenPath string) — reads the golden file and compares. On mismatch, reports which lines differ.

Use os.ReadFile/os.WriteFile and t.TempDir() for test isolation.`,
  code: `package main

import (
\t"os"
\t"path/filepath"
\t"strings"
\t"testing"
)

// TODO: Define GoldenTest struct { Name, Input string; Fn func(string) string }.

// TODO: Implement RunGolden(t *testing.T, dir string, tests []GoldenTest).

// TODO: Implement CompareGolden(t *testing.T, got string, goldenPath string).

func main() {}
`,
  testCode: `package main

import (
\t"os"
\t"path/filepath"
\t"testing"
)

func toUpper(s string) string {
\tresult := make([]byte, len(s))
\tfor i, b := range []byte(s) {
\t\tif b >= 'a' && b <= 'z' {
\t\t\tresult[i] = b - 32
\t\t} else {
\t\t\tresult[i] = b
\t\t}
\t}
\treturn string(result)
}

func TestRunGoldenCreatesFile(t *testing.T) {
\tdir := t.TempDir()
\ttests := []GoldenTest{
\t\t{Name: "upper-hello", Input: "hello", Fn: toUpper},
\t}
\tRunGolden(t, dir, tests)
\tdata, err := os.ReadFile(filepath.Join(dir, "upper-hello.golden"))
\tif err != nil {
\t\tt.Fatalf("golden file should have been created: %v", err)
\t}
\tif string(data) != "HELLO" {
\t\tt.Fatalf("golden file content should be HELLO, got %q", string(data))
\t}
}

func TestRunGoldenMatchesExisting(t *testing.T) {
\tdir := t.TempDir()
\t// Pre-create the golden file
\terr := os.WriteFile(filepath.Join(dir, "upper-world.golden"), []byte("WORLD"), 0644)
\tif err != nil {
\t\tt.Fatal(err)
\t}
\ttests := []GoldenTest{
\t\t{Name: "upper-world", Input: "world", Fn: toUpper},
\t}
\tRunGolden(t, dir, tests)
}

func TestCompareGoldenMatch(t *testing.T) {
\tdir := t.TempDir()
\tpath := filepath.Join(dir, "match.golden")
\tos.WriteFile(path, []byte("abc"), 0644)
\tCompareGolden(t, "abc", path)
}

func TestCompareGoldenMismatch(t *testing.T) {
\tdir := t.TempDir()
\tpath := filepath.Join(dir, "mismatch.golden")
\tos.WriteFile(path, []byte("expected"), 0644)

\tft := &fakeT2{}
\tCompareGoldenTestable(ft, "actual", path)
\tif !ft.failed {
\t\tt.Fatal("CompareGolden should fail on mismatch")
\t}
}

func TestRunGoldenMultiple(t *testing.T) {
\tdir := t.TempDir()
\ttests := []GoldenTest{
\t\t{Name: "a", Input: "foo", Fn: toUpper},
\t\t{Name: "b", Input: "bar", Fn: toUpper},
\t}
\tRunGolden(t, dir, tests)

\tdata1, _ := os.ReadFile(filepath.Join(dir, "a.golden"))
\tdata2, _ := os.ReadFile(filepath.Join(dir, "b.golden"))
\tif string(data1) != "FOO" {
\t\tt.Fatalf("expected FOO, got %q", string(data1))
\t}
\tif string(data2) != "BAR" {
\t\tt.Fatalf("expected BAR, got %q", string(data2))
\t}
}

type fakeT2 struct {
\tfailed bool
}

func (f *fakeT2) Errorf(format string, args ...interface{}) {
\tf.failed = true
}

func (f *fakeT2) Helper() {}
`,
  solution: `package main

import (
\t"fmt"
\t"os"
\t"path/filepath"
\t"strings"
\t"testing"
)

type GoldenTest struct {
\tName  string
\tInput string
\tFn    func(string) string
}

type tReporter interface {
\tErrorf(format string, args ...interface{})
\tHelper()
}

func RunGolden(t *testing.T, dir string, tests []GoldenTest) {
\tt.Helper()
\tfor _, gt := range tests {
\t\tgot := gt.Fn(gt.Input)
\t\tgoldenPath := filepath.Join(dir, gt.Name+".golden")
\t\tdata, err := os.ReadFile(goldenPath)
\t\tif err != nil {
\t\t\t// Golden file doesn't exist — create it
\t\t\tos.WriteFile(goldenPath, []byte(got), 0644)
\t\t\tcontinue
\t\t}
\t\tif string(data) != got {
\t\t\tt.Errorf("golden mismatch for %s:\\n  got:  %q\\n  want: %q", gt.Name, got, string(data))
\t\t}
\t}
}

func CompareGolden(t *testing.T, got string, goldenPath string) {
\tt.Helper()
\tCompareGoldenTestable(t, got, goldenPath)
}

func CompareGoldenTestable(t tReporter, got string, goldenPath string) {
\tt.Helper()
\tdata, err := os.ReadFile(goldenPath)
\tif err != nil {
\t\tt.Errorf("failed to read golden file %s: %v", goldenPath, err)
\t\treturn
\t}
\twant := string(data)
\tif got == want {
\t\treturn
\t}
\tgotLines := strings.Split(got, "\\n")
\twantLines := strings.Split(want, "\\n")
\tmax := len(gotLines)
\tif len(wantLines) > max {
\t\tmax = len(wantLines)
\t}
\tfor i := 0; i < max; i++ {
\t\tvar gl, wl string
\t\tif i < len(gotLines) {
\t\t\tgl = gotLines[i]
\t\t}
\t\tif i < len(wantLines) {
\t\t\twl = wantLines[i]
\t\t}
\t\tif gl != wl {
\t\t\tt.Errorf("line %d differs:\\n  got:  %q\\n  want: %q", i+1, gl, wl)
\t\t}
\t}
}

var _ = fmt.Sprintf

func main() {}
`,
  hints: [
    'Use os.ReadFile to check if a golden file exists. If os.ReadFile returns an error, the file is missing — create it with os.WriteFile.',
    'filepath.Join(dir, name + ".golden") builds the golden file path.',
    'For CompareGolden, split both strings by newline and compare line by line.',
    'Use a tReporter interface so CompareGoldenTestable can accept both real *testing.T and fakeT.',
  ],
  projectId: 'proj-test',
  step: 3,
  totalSteps: 6,
}

export default exercise

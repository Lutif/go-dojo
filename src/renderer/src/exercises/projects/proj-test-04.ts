import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-test-04',
  title: 'Test Framework — Test Fixtures',
  category: 'Projects',
  subcategory: 'Test Framework',
  difficulty: 'advanced',
  order: 165,
  description: `Build a fixture manager that handles setup and teardown for tests.

Implement:
- FixtureManager struct
- NewFixtureManager() *FixtureManager
- Register(name string, setup func() interface{}, teardown func(interface{})) — registers a named fixture
- Use(t *testing.T, name string) interface{} — calls the setup function, registers teardown via t.Cleanup, and returns the fixture data

Fixtures should be reusable across multiple tests. The teardown function receives whatever the setup function returned.`,
  code: `package main

import (
\t"testing"
)

// TODO: Define FixtureManager struct.

// TODO: Implement NewFixtureManager() *FixtureManager.

// TODO: Implement Register(name string, setup func() interface{}, teardown func(interface{})).

// TODO: Implement Use(t *testing.T, name string) interface{}.

func main() {}
`,
  testCode: `package main

import (
\t"testing"
)

func TestFixtureSetupRuns(t *testing.T) {
\tfm := NewFixtureManager()
\tsetupCalled := false
\tfm.Register("db", func() interface{} {
\t\tsetupCalled = true
\t\treturn "db-connection"
\t}, func(v interface{}) {})

\tresult := fm.Use(t, "db")
\tif !setupCalled {
\t\tt.Fatal("setup should have been called")
\t}
\tif result != "db-connection" {
\t\tt.Fatalf("expected db-connection, got %v", result)
\t}
}

func TestFixtureTeardownRuns(t *testing.T) {
\tfm := NewFixtureManager()
\tteardownCalled := false

\tt.Run("inner", func(t *testing.T) {
\t\tfm.Register("tmp", func() interface{} {
\t\t\treturn "temp-data"
\t\t}, func(v interface{}) {
\t\t\tif v != "temp-data" {
\t\t\t\tpanic("teardown should receive setup return value")
\t\t\t}
\t\t\tteardownCalled = true
\t\t})
\t\tfm.Use(t, "tmp")
\t})

\tif !teardownCalled {
\t\tt.Fatal("teardown should have been called after subtest")
\t}
}

func TestFixtureDataPassthrough(t *testing.T) {
\tfm := NewFixtureManager()
\tfm.Register("counter", func() interface{} {
\t\tc := 42
\t\treturn &c
\t}, func(v interface{}) {})

\tresult := fm.Use(t, "counter")
\tp := result.(*int)
\tif *p != 42 {
\t\tt.Fatalf("expected 42, got %d", *p)
\t}
}

func TestMultipleFixtures(t *testing.T) {
\tfm := NewFixtureManager()
\tfm.Register("alpha", func() interface{} {
\t\treturn "A"
\t}, func(v interface{}) {})
\tfm.Register("beta", func() interface{} {
\t\treturn "B"
\t}, func(v interface{}) {})

\ta := fm.Use(t, "alpha")
\tb := fm.Use(t, "beta")
\tif a != "A" || b != "B" {
\t\tt.Fatalf("expected A and B, got %v and %v", a, b)
\t}
}

func TestFixtureReusable(t *testing.T) {
\tfm := NewFixtureManager()
\tcallCount := 0
\tfm.Register("reusable", func() interface{} {
\t\tcallCount++
\t\treturn callCount
\t}, func(v interface{}) {})

\tt.Run("first", func(t *testing.T) {
\t\tv := fm.Use(t, "reusable")
\t\tif v != 1 {
\t\t\tt.Fatalf("first use should return 1, got %v", v)
\t\t}
\t})
\tt.Run("second", func(t *testing.T) {
\t\tv := fm.Use(t, "reusable")
\t\tif v != 2 {
\t\t\tt.Fatalf("second use should return 2, got %v", v)
\t\t}
\t})
}
`,
  solution: `package main

import (
\t"testing"
)

type fixtureEntry struct {
\tsetup    func() interface{}
\tteardown func(interface{})
}

type FixtureManager struct {
\tfixtures map[string]fixtureEntry
}

func NewFixtureManager() *FixtureManager {
\treturn &FixtureManager{
\t\tfixtures: make(map[string]fixtureEntry),
\t}
}

func (fm *FixtureManager) Register(name string, setup func() interface{}, teardown func(interface{})) {
\tfm.fixtures[name] = fixtureEntry{setup: setup, teardown: teardown}
}

func (fm *FixtureManager) Use(t *testing.T, name string) interface{} {
\tt.Helper()
\tentry, ok := fm.fixtures[name]
\tif !ok {
\t\tt.Fatalf("fixture %q not registered", name)
\t}
\tdata := entry.setup()
\tt.Cleanup(func() {
\t\tentry.teardown(data)
\t})
\treturn data
}

func main() {}
`,
  hints: [
    'Store registered fixtures in a map[string]fixtureEntry where fixtureEntry holds the setup and teardown functions.',
    'Use() calls entry.setup() to get the data, then t.Cleanup(func(){ entry.teardown(data) }) to schedule teardown.',
    'Each Use() call is independent — setup runs fresh each time for reusability.',
    't.Cleanup runs after the test (or subtest) finishes, making it perfect for teardown.',
  ],
  projectId: 'proj-test',
  step: 4,
  totalSteps: 6,
}

export default exercise

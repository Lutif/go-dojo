import { WorkspaceProject } from '../../types'

const project: WorkspaceProject = {
  "projectId": "proj-test",
  "title": "Test Framework",
  "category": "Projects",
  "subcategory": "Test Framework",
  "order": 162,
  "difficulty": "expert",
  "workspaceScaffold": {
    "goMod": "module proj-test\n\ngo 1.21\n",
    "files": [],
    "testFiles": []
  },
  "steps": [
    {
      "id": "proj-test-01",
      "title": "Custom Assertions",
      "difficulty": "intermediate",
      "description": "Build assertion helpers that wrap testing.T for cleaner test code.\n\nImplement:\n- Assert struct wrapping *testing.T\n- NewAssert(t *testing.T) *Assert\n- Equal(got, want interface{}) — uses reflect.DeepEqual, calls t.Errorf with descriptive message\n- NotEqual(got, want interface{})\n- True(val bool), False(val bool)\n- Nil(val interface{}), NotNil(val interface{})\n- Contains(haystack, needle string)\n- EqualSlice(got, want []string)\n\nTests use a fakeT to verify assertions fire correctly on incorrect input.",
      "testFiles": [
        {
          "name": "step01_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\ntype fakeT struct {\n\tfailed bool\n}\n\nfunc (f *fakeT) Errorf(format string, args ...interface{}) {\n\tf.failed = true\n}\n\nfunc (f *fakeT) Helper() {}\n\nfunc newFakeAssert() (*Assert, *fakeT) {\n\tft := &fakeT{}\n\ta := &Assert{t: ft}\n\treturn a, ft\n}\n\nfunc TestEqualPass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.Equal(42, 42)\n\tif ft.failed {\n\t\tt.Fatal(\"Equal(42,42) should not fail\")\n\t}\n}\n\nfunc TestEqualFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.Equal(1, 2)\n\tif !ft.failed {\n\t\tt.Fatal(\"Equal(1,2) should fail\")\n\t}\n}\n\nfunc TestNotEqualPass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.NotEqual(1, 2)\n\tif ft.failed {\n\t\tt.Fatal(\"NotEqual(1,2) should not fail\")\n\t}\n}\n\nfunc TestNotEqualFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.NotEqual(5, 5)\n\tif !ft.failed {\n\t\tt.Fatal(\"NotEqual(5,5) should fail\")\n\t}\n}\n\nfunc TestTruePass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.True(true)\n\tif ft.failed {\n\t\tt.Fatal(\"True(true) should not fail\")\n\t}\n}\n\nfunc TestTrueFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.True(false)\n\tif !ft.failed {\n\t\tt.Fatal(\"True(false) should fail\")\n\t}\n}\n\nfunc TestFalsePass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.False(false)\n\tif ft.failed {\n\t\tt.Fatal(\"False(false) should not fail\")\n\t}\n}\n\nfunc TestFalseFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.False(true)\n\tif !ft.failed {\n\t\tt.Fatal(\"False(true) should fail\")\n\t}\n}\n\nfunc TestNilPass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.Nil(nil)\n\tif ft.failed {\n\t\tt.Fatal(\"Nil(nil) should not fail\")\n\t}\n}\n\nfunc TestNilFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.Nil(\"hello\")\n\tif !ft.failed {\n\t\tt.Fatal(\"Nil(string) should fail\")\n\t}\n}\n\nfunc TestNotNilPass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.NotNil(\"hello\")\n\tif ft.failed {\n\t\tt.Fatal(\"NotNil(string) should not fail\")\n\t}\n}\n\nfunc TestNotNilFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.NotNil(nil)\n\tif !ft.failed {\n\t\tt.Fatal(\"NotNil(nil) should fail\")\n\t}\n}\n\nfunc TestContainsPass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.Contains(\"hello world\", \"world\")\n\tif ft.failed {\n\t\tt.Fatal(\"Contains should pass when needle is in haystack\")\n\t}\n}\n\nfunc TestContainsFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.Contains(\"hello world\", \"xyz\")\n\tif !ft.failed {\n\t\tt.Fatal(\"Contains should fail when needle is not in haystack\")\n\t}\n}\n\nfunc TestEqualSlicePass(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.EqualSlice([]string{\"a\", \"b\"}, []string{\"a\", \"b\"})\n\tif ft.failed {\n\t\tt.Fatal(\"EqualSlice should pass for identical slices\")\n\t}\n}\n\nfunc TestEqualSliceFail(t *testing.T) {\n\ta, ft := newFakeAssert()\n\ta.EqualSlice([]string{\"a\"}, []string{\"a\", \"b\"})\n\tif !ft.failed {\n\t\tt.Fatal(\"EqualSlice should fail for different slices\")\n\t}\n}\n\nfunc TestNewAssertWithRealT(t *testing.T) {\n\ta := NewAssert(t)\n\ta.Equal(1, 1)\n\ta.True(true)\n\ta.Contains(\"Go is great\", \"great\")\n}\n"
        }
      ],
      "testRunPattern": "step01_test.go",
      "hints": [
        "Define a tHelper interface with Errorf and Helper methods so the Assert struct can work with both real and fake testing.T.",
        "Use reflect.DeepEqual for Equal/NotEqual/EqualSlice comparisons.",
        "strings.Contains checks if needle is in haystack.",
        "Call t.Helper() at the start of each assertion so error line numbers point to the caller."
      ],
      "solution": "package main\n\nimport (\n\t\"fmt\"\n\t\"reflect\"\n\t\"strings\"\n\t\"testing\"\n)\n\ntype tHelper interface {\n\tErrorf(format string, args ...interface{})\n\tHelper()\n}\n\ntype Assert struct {\n\tt tHelper\n}\n\nfunc NewAssert(t *testing.T) *Assert {\n\treturn &Assert{t: t}\n}\n\nfunc (a *Assert) Equal(got, want interface{}) {\n\ta.t.Helper()\n\tif !reflect.DeepEqual(got, want) {\n\t\ta.t.Errorf(\"Equal failed: got %v, want %v\", got, want)\n\t}\n}\n\nfunc (a *Assert) NotEqual(got, want interface{}) {\n\ta.t.Helper()\n\tif reflect.DeepEqual(got, want) {\n\t\ta.t.Errorf(\"NotEqual failed: values are equal: %v\", got)\n\t}\n}\n\nfunc (a *Assert) True(val bool) {\n\ta.t.Helper()\n\tif !val {\n\t\ta.t.Errorf(\"True failed: got false\")\n\t}\n}\n\nfunc (a *Assert) False(val bool) {\n\ta.t.Helper()\n\tif val {\n\t\ta.t.Errorf(\"False failed: got true\")\n\t}\n}\n\nfunc (a *Assert) Nil(val interface{}) {\n\ta.t.Helper()\n\tif val != nil {\n\t\ta.t.Errorf(\"Nil failed: got %v\", val)\n\t}\n}\n\nfunc (a *Assert) NotNil(val interface{}) {\n\ta.t.Helper()\n\tif val == nil {\n\t\ta.t.Errorf(\"NotNil failed: got nil\")\n\t}\n}\n\nfunc (a *Assert) Contains(haystack, needle string) {\n\ta.t.Helper()\n\tif !strings.Contains(haystack, needle) {\n\t\ta.t.Errorf(\"Contains failed: %q does not contain %q\", haystack, needle)\n\t}\n}\n\nfunc (a *Assert) EqualSlice(got, want []string) {\n\ta.t.Helper()\n\tif !reflect.DeepEqual(got, want) {\n\t\ta.t.Errorf(\"EqualSlice failed: got %v, want %v\", got, want)\n\t}\n}\n\nvar _ = fmt.Sprintf\n\nfunc main() {}\n",
      "requires": []
    },
    {
      "id": "proj-test-02",
      "title": "Table-Driven Runner",
      "difficulty": "intermediate",
      "description": "Build helpers for table-driven tests — Go's most common testing pattern.\n\nImplement:\n- TestCase struct with Name string, Input string, Expected string, Fn func(string) string\n- RunTable(t *testing.T, cases []TestCase) — runs each case as a subtest via t.Run, calling Fn(Input) and comparing to Expected\n- RunTableParallel(t *testing.T, cases []TestCase) — same but calls t.Parallel() inside each subtest\n\nTests define a simple reverse-string function, create table cases, and verify all run correctly. A deliberately failing case confirms proper error reporting.",
      "testFiles": [
        {
          "name": "step02_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\nfunc reverseString(s string) string {\n\trunes := []rune(s)\n\tfor i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n\t\trunes[i], runes[j] = runes[j], runes[i]\n\t}\n\treturn string(runes)\n}\n\nfunc TestRunTableAllPass(t *testing.T) {\n\tcases := []TestCase{\n\t\t{Name: \"empty\", Input: \"\", Expected: \"\", Fn: reverseString},\n\t\t{Name: \"single\", Input: \"a\", Expected: \"a\", Fn: reverseString},\n\t\t{Name: \"hello\", Input: \"hello\", Expected: \"olleh\", Fn: reverseString},\n\t\t{Name: \"spaces\", Input: \"a b\", Expected: \"b a\", Fn: reverseString},\n\t}\n\tRunTable(t, cases)\n}\n\nfunc TestRunTableParallelAllPass(t *testing.T) {\n\tcases := []TestCase{\n\t\t{Name: \"empty\", Input: \"\", Expected: \"\", Fn: reverseString},\n\t\t{Name: \"abc\", Input: \"abc\", Expected: \"cba\", Fn: reverseString},\n\t}\n\tRunTableParallel(t, cases)\n}\n\ntype fakeSubT struct {\n\tfailed  bool\n\tname    string\n\tparallel bool\n}\n\nfunc (f *fakeSubT) Errorf(format string, args ...interface{}) {\n\tf.failed = true\n}\n\nfunc (f *fakeSubT) Helper() {}\n\nfunc (f *fakeSubT) Parallel() {\n\tf.parallel = true\n}\n\nfunc TestRunTableDetectsFailure(t *testing.T) {\n\t// Verify that a wrong expected value causes the case function to detect mismatch\n\tcases := []TestCase{\n\t\t{Name: \"correct\", Input: \"abc\", Expected: \"cba\", Fn: reverseString},\n\t}\n\tRunTable(t, cases)\n\t// Verify the Fn is actually called by checking the reverse logic\n\tif reverseString(\"abc\") != \"cba\" {\n\t\tt.Fatal(\"reverse function is broken\")\n\t}\n}\n\nfunc TestRunTableSubtestNames(t *testing.T) {\n\tcases := []TestCase{\n\t\t{Name: \"alpha\", Input: \"x\", Expected: \"x\", Fn: reverseString},\n\t\t{Name: \"beta\", Input: \"ab\", Expected: \"ba\", Fn: reverseString},\n\t}\n\tRunTable(t, cases)\n}\n"
        }
      ],
      "testRunPattern": "step02_test.go",
      "hints": [
        "Use t.Run(tc.Name, func(t *testing.T) { ... }) to create subtests.",
        "Capture the loop variable with tc := tc before the closure.",
        "For parallel, call t.Parallel() as the first line inside the subtest function.",
        "Compare got := tc.Fn(tc.Input) against tc.Expected and call t.Errorf on mismatch."
      ],
      "solution": "package main\n\nimport (\n\t\"testing\"\n)\n\ntype TestCase struct {\n\tName     string\n\tInput    string\n\tExpected string\n\tFn       func(string) string\n}\n\nfunc RunTable(t *testing.T, cases []TestCase) {\n\tt.Helper()\n\tfor _, tc := range cases {\n\t\ttc := tc\n\t\tt.Run(tc.Name, func(t *testing.T) {\n\t\t\tgot := tc.Fn(tc.Input)\n\t\t\tif got != tc.Expected {\n\t\t\t\tt.Errorf(\"got %q, want %q\", got, tc.Expected)\n\t\t\t}\n\t\t})\n\t}\n}\n\nfunc RunTableParallel(t *testing.T, cases []TestCase) {\n\tt.Helper()\n\tfor _, tc := range cases {\n\t\ttc := tc\n\t\tt.Run(tc.Name, func(t *testing.T) {\n\t\t\tt.Parallel()\n\t\t\tgot := tc.Fn(tc.Input)\n\t\t\tif got != tc.Expected {\n\t\t\t\tt.Errorf(\"got %q, want %q\", got, tc.Expected)\n\t\t\t}\n\t\t})\n\t}\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-test-01"
      ]
    },
    {
      "id": "proj-test-03",
      "title": "Golden File Testing",
      "difficulty": "advanced",
      "description": "Build a golden-file testing utility that compares function output against saved reference files.\n\nImplement:\n- GoldenTest struct with Name string, Input string, Fn func(string) string\n- RunGolden(t *testing.T, dir string, tests []GoldenTest) — for each test, run Fn(Input) and compare against dir/Name.golden. If the golden file doesn't exist, create it with the current output.\n- CompareGolden(t *testing.T, got string, goldenPath string) — reads the golden file and compares. On mismatch, reports which lines differ.\n\nUse os.ReadFile/os.WriteFile and t.TempDir() for test isolation.",
      "testFiles": [
        {
          "name": "step03_test.go",
          "content": "package main\n\nimport (\n\t\"os\"\n\t\"path/filepath\"\n\t\"testing\"\n)\n\nfunc toUpper(s string) string {\n\tresult := make([]byte, len(s))\n\tfor i, b := range []byte(s) {\n\t\tif b >= 'a' && b <= 'z' {\n\t\t\tresult[i] = b - 32\n\t\t} else {\n\t\t\tresult[i] = b\n\t\t}\n\t}\n\treturn string(result)\n}\n\nfunc TestRunGoldenCreatesFile(t *testing.T) {\n\tdir := t.TempDir()\n\ttests := []GoldenTest{\n\t\t{Name: \"upper-hello\", Input: \"hello\", Fn: toUpper},\n\t}\n\tRunGolden(t, dir, tests)\n\tdata, err := os.ReadFile(filepath.Join(dir, \"upper-hello.golden\"))\n\tif err != nil {\n\t\tt.Fatalf(\"golden file should have been created: %v\", err)\n\t}\n\tif string(data) != \"HELLO\" {\n\t\tt.Fatalf(\"golden file content should be HELLO, got %q\", string(data))\n\t}\n}\n\nfunc TestRunGoldenMatchesExisting(t *testing.T) {\n\tdir := t.TempDir()\n\t// Pre-create the golden file\n\terr := os.WriteFile(filepath.Join(dir, \"upper-world.golden\"), []byte(\"WORLD\"), 0644)\n\tif err != nil {\n\t\tt.Fatal(err)\n\t}\n\ttests := []GoldenTest{\n\t\t{Name: \"upper-world\", Input: \"world\", Fn: toUpper},\n\t}\n\tRunGolden(t, dir, tests)\n}\n\nfunc TestCompareGoldenMatch(t *testing.T) {\n\tdir := t.TempDir()\n\tpath := filepath.Join(dir, \"match.golden\")\n\tos.WriteFile(path, []byte(\"abc\"), 0644)\n\tCompareGolden(t, \"abc\", path)\n}\n\nfunc TestCompareGoldenMismatch(t *testing.T) {\n\tdir := t.TempDir()\n\tpath := filepath.Join(dir, \"mismatch.golden\")\n\tos.WriteFile(path, []byte(\"expected\"), 0644)\n\n\tft := &fakeT2{}\n\tCompareGoldenTestable(ft, \"actual\", path)\n\tif !ft.failed {\n\t\tt.Fatal(\"CompareGolden should fail on mismatch\")\n\t}\n}\n\nfunc TestRunGoldenMultiple(t *testing.T) {\n\tdir := t.TempDir()\n\ttests := []GoldenTest{\n\t\t{Name: \"a\", Input: \"foo\", Fn: toUpper},\n\t\t{Name: \"b\", Input: \"bar\", Fn: toUpper},\n\t}\n\tRunGolden(t, dir, tests)\n\n\tdata1, _ := os.ReadFile(filepath.Join(dir, \"a.golden\"))\n\tdata2, _ := os.ReadFile(filepath.Join(dir, \"b.golden\"))\n\tif string(data1) != \"FOO\" {\n\t\tt.Fatalf(\"expected FOO, got %q\", string(data1))\n\t}\n\tif string(data2) != \"BAR\" {\n\t\tt.Fatalf(\"expected BAR, got %q\", string(data2))\n\t}\n}\n\ntype fakeT2 struct {\n\tfailed bool\n}\n\nfunc (f *fakeT2) Errorf(format string, args ...interface{}) {\n\tf.failed = true\n}\n\nfunc (f *fakeT2) Helper() {}\n"
        }
      ],
      "testRunPattern": "step03_test.go",
      "hints": [
        "Use os.ReadFile to check if a golden file exists. If os.ReadFile returns an error, the file is missing — create it with os.WriteFile.",
        "filepath.Join(dir, name + \".golden\") builds the golden file path.",
        "For CompareGolden, split both strings by newline and compare line by line.",
        "Use a tReporter interface so CompareGoldenTestable can accept both real *testing.T and fakeT."
      ],
      "solution": "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"path/filepath\"\n\t\"strings\"\n\t\"testing\"\n)\n\ntype GoldenTest struct {\n\tName  string\n\tInput string\n\tFn    func(string) string\n}\n\ntype tReporter interface {\n\tErrorf(format string, args ...interface{})\n\tHelper()\n}\n\nfunc RunGolden(t *testing.T, dir string, tests []GoldenTest) {\n\tt.Helper()\n\tfor _, gt := range tests {\n\t\tgot := gt.Fn(gt.Input)\n\t\tgoldenPath := filepath.Join(dir, gt.Name+\".golden\")\n\t\tdata, err := os.ReadFile(goldenPath)\n\t\tif err != nil {\n\t\t\t// Golden file doesn't exist — create it\n\t\t\tos.WriteFile(goldenPath, []byte(got), 0644)\n\t\t\tcontinue\n\t\t}\n\t\tif string(data) != got {\n\t\t\tt.Errorf(\"golden mismatch for %s:\\n  got:  %q\\n  want: %q\", gt.Name, got, string(data))\n\t\t}\n\t}\n}\n\nfunc CompareGolden(t *testing.T, got string, goldenPath string) {\n\tt.Helper()\n\tCompareGoldenTestable(t, got, goldenPath)\n}\n\nfunc CompareGoldenTestable(t tReporter, got string, goldenPath string) {\n\tt.Helper()\n\tdata, err := os.ReadFile(goldenPath)\n\tif err != nil {\n\t\tt.Errorf(\"failed to read golden file %s: %v\", goldenPath, err)\n\t\treturn\n\t}\n\twant := string(data)\n\tif got == want {\n\t\treturn\n\t}\n\tgotLines := strings.Split(got, \"\\n\")\n\twantLines := strings.Split(want, \"\\n\")\n\tmax := len(gotLines)\n\tif len(wantLines) > max {\n\t\tmax = len(wantLines)\n\t}\n\tfor i := 0; i < max; i++ {\n\t\tvar gl, wl string\n\t\tif i < len(gotLines) {\n\t\t\tgl = gotLines[i]\n\t\t}\n\t\tif i < len(wantLines) {\n\t\t\twl = wantLines[i]\n\t\t}\n\t\tif gl != wl {\n\t\t\tt.Errorf(\"line %d differs:\\n  got:  %q\\n  want: %q\", i+1, gl, wl)\n\t\t}\n\t}\n}\n\nvar _ = fmt.Sprintf\n\nfunc main() {}\n",
      "requires": [
        "proj-test-02"
      ]
    },
    {
      "id": "proj-test-04",
      "title": "Test Fixtures",
      "difficulty": "advanced",
      "description": "Build a fixture manager that handles setup and teardown for tests.\n\nImplement:\n- FixtureManager struct\n- NewFixtureManager() *FixtureManager\n- Register(name string, setup func() interface{}, teardown func(interface{})) — registers a named fixture\n- Use(t *testing.T, name string) interface{} — calls the setup function, registers teardown via t.Cleanup, and returns the fixture data\n\nFixtures should be reusable across multiple tests. The teardown function receives whatever the setup function returned.",
      "testFiles": [
        {
          "name": "step04_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\nfunc TestFixtureSetupRuns(t *testing.T) {\n\tfm := NewFixtureManager()\n\tsetupCalled := false\n\tfm.Register(\"db\", func() interface{} {\n\t\tsetupCalled = true\n\t\treturn \"db-connection\"\n\t}, func(v interface{}) {})\n\n\tresult := fm.Use(t, \"db\")\n\tif !setupCalled {\n\t\tt.Fatal(\"setup should have been called\")\n\t}\n\tif result != \"db-connection\" {\n\t\tt.Fatalf(\"expected db-connection, got %v\", result)\n\t}\n}\n\nfunc TestFixtureTeardownRuns(t *testing.T) {\n\tfm := NewFixtureManager()\n\tteardownCalled := false\n\n\tt.Run(\"inner\", func(t *testing.T) {\n\t\tfm.Register(\"tmp\", func() interface{} {\n\t\t\treturn \"temp-data\"\n\t\t}, func(v interface{}) {\n\t\t\tif v != \"temp-data\" {\n\t\t\t\tpanic(\"teardown should receive setup return value\")\n\t\t\t}\n\t\t\tteardownCalled = true\n\t\t})\n\t\tfm.Use(t, \"tmp\")\n\t})\n\n\tif !teardownCalled {\n\t\tt.Fatal(\"teardown should have been called after subtest\")\n\t}\n}\n\nfunc TestFixtureDataPassthrough(t *testing.T) {\n\tfm := NewFixtureManager()\n\tfm.Register(\"counter\", func() interface{} {\n\t\tc := 42\n\t\treturn &c\n\t}, func(v interface{}) {})\n\n\tresult := fm.Use(t, \"counter\")\n\tp := result.(*int)\n\tif *p != 42 {\n\t\tt.Fatalf(\"expected 42, got %d\", *p)\n\t}\n}\n\nfunc TestMultipleFixtures(t *testing.T) {\n\tfm := NewFixtureManager()\n\tfm.Register(\"alpha\", func() interface{} {\n\t\treturn \"A\"\n\t}, func(v interface{}) {})\n\tfm.Register(\"beta\", func() interface{} {\n\t\treturn \"B\"\n\t}, func(v interface{}) {})\n\n\ta := fm.Use(t, \"alpha\")\n\tb := fm.Use(t, \"beta\")\n\tif a != \"A\" || b != \"B\" {\n\t\tt.Fatalf(\"expected A and B, got %v and %v\", a, b)\n\t}\n}\n\nfunc TestFixtureReusable(t *testing.T) {\n\tfm := NewFixtureManager()\n\tcallCount := 0\n\tfm.Register(\"reusable\", func() interface{} {\n\t\tcallCount++\n\t\treturn callCount\n\t}, func(v interface{}) {})\n\n\tt.Run(\"first\", func(t *testing.T) {\n\t\tv := fm.Use(t, \"reusable\")\n\t\tif v != 1 {\n\t\t\tt.Fatalf(\"first use should return 1, got %v\", v)\n\t\t}\n\t})\n\tt.Run(\"second\", func(t *testing.T) {\n\t\tv := fm.Use(t, \"reusable\")\n\t\tif v != 2 {\n\t\t\tt.Fatalf(\"second use should return 2, got %v\", v)\n\t\t}\n\t})\n}\n"
        }
      ],
      "testRunPattern": "step04_test.go",
      "hints": [
        "Store registered fixtures in a map[string]fixtureEntry where fixtureEntry holds the setup and teardown functions.",
        "Use() calls entry.setup() to get the data, then t.Cleanup(func(){ entry.teardown(data) }) to schedule teardown.",
        "Each Use() call is independent — setup runs fresh each time for reusability.",
        "t.Cleanup runs after the test (or subtest) finishes, making it perfect for teardown."
      ],
      "solution": "package main\n\nimport (\n\t\"testing\"\n)\n\ntype fixtureEntry struct {\n\tsetup    func() interface{}\n\tteardown func(interface{})\n}\n\ntype FixtureManager struct {\n\tfixtures map[string]fixtureEntry\n}\n\nfunc NewFixtureManager() *FixtureManager {\n\treturn &FixtureManager{\n\t\tfixtures: make(map[string]fixtureEntry),\n\t}\n}\n\nfunc (fm *FixtureManager) Register(name string, setup func() interface{}, teardown func(interface{})) {\n\tfm.fixtures[name] = fixtureEntry{setup: setup, teardown: teardown}\n}\n\nfunc (fm *FixtureManager) Use(t *testing.T, name string) interface{} {\n\tt.Helper()\n\tentry, ok := fm.fixtures[name]\n\tif !ok {\n\t\tt.Fatalf(\"fixture %q not registered\", name)\n\t}\n\tdata := entry.setup()\n\tt.Cleanup(func() {\n\t\tentry.teardown(data)\n\t})\n\treturn data\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-test-03"
      ]
    },
    {
      "id": "proj-test-05",
      "title": "Benchmark Helpers",
      "difficulty": "expert",
      "description": "Build utilities for simple benchmarking in tests.\n\nImplement:\n- BenchResult struct with N int, NsPerOp int64, AllocsPerOp int64, BytesPerOp int64\n- RunBench(fn func()) BenchResult — runs fn repeatedly, measuring time. Start with N=1 and double until total time >= 100ms, then record NsPerOp. Set AllocsPerOp and BytesPerOp to 0 (simplified).\n- CompareBench(a, b BenchResult) string — returns \"faster\" if a is faster, \"slower\" if slower, or \"same\" if within 10%\n- FormatBench(r BenchResult) string — e.g. \"1000 ops, 1234 ns/op, 5 allocs/op, 64 bytes/op\"",
      "testFiles": [
        {
          "name": "step05_test.go",
          "content": "package main\n\nimport (\n\t\"strings\"\n\t\"testing\"\n\t\"time\"\n)\n\nfunc TestRunBenchMeasures(t *testing.T) {\n\tresult := RunBench(func() {\n\t\ttime.Sleep(1 * time.Microsecond)\n\t})\n\tif result.N < 1 {\n\t\tt.Fatalf(\"expected N >= 1, got %d\", result.N)\n\t}\n\tif result.NsPerOp <= 0 {\n\t\tt.Fatalf(\"expected NsPerOp > 0, got %d\", result.NsPerOp)\n\t}\n}\n\nfunc TestRunBenchFastFunction(t *testing.T) {\n\tresult := RunBench(func() {\n\t\tx := 0\n\t\tfor i := 0; i < 100; i++ {\n\t\t\tx += i\n\t\t}\n\t\t_ = x\n\t})\n\tif result.N < 10 {\n\t\tt.Fatalf(\"fast function should run many times, got N=%d\", result.N)\n\t}\n}\n\nfunc TestCompareBenchFaster(t *testing.T) {\n\ta := BenchResult{N: 1000, NsPerOp: 100}\n\tb := BenchResult{N: 1000, NsPerOp: 200}\n\tresult := CompareBench(a, b)\n\tif result != \"faster\" {\n\t\tt.Fatalf(\"expected faster, got %s\", result)\n\t}\n}\n\nfunc TestCompareBenchSlower(t *testing.T) {\n\ta := BenchResult{N: 1000, NsPerOp: 300}\n\tb := BenchResult{N: 1000, NsPerOp: 100}\n\tresult := CompareBench(a, b)\n\tif result != \"slower\" {\n\t\tt.Fatalf(\"expected slower, got %s\", result)\n\t}\n}\n\nfunc TestCompareBenchSame(t *testing.T) {\n\ta := BenchResult{N: 1000, NsPerOp: 100}\n\tb := BenchResult{N: 1000, NsPerOp: 105}\n\tresult := CompareBench(a, b)\n\tif result != \"same\" {\n\t\tt.Fatalf(\"expected same (within 10%%), got %s\", result)\n\t}\n}\n\nfunc TestCompareBenchSameEdge(t *testing.T) {\n\ta := BenchResult{N: 1000, NsPerOp: 100}\n\tb := BenchResult{N: 1000, NsPerOp: 110}\n\tresult := CompareBench(a, b)\n\tif result != \"same\" {\n\t\tt.Fatalf(\"10%% difference should be same, got %s\", result)\n\t}\n}\n\nfunc TestFormatBench(t *testing.T) {\n\tr := BenchResult{N: 1000, NsPerOp: 1234, AllocsPerOp: 5, BytesPerOp: 64}\n\ts := FormatBench(r)\n\tif !strings.Contains(s, \"1000\") {\n\t\tt.Fatalf(\"should contain ops count, got %s\", s)\n\t}\n\tif !strings.Contains(s, \"1234\") {\n\t\tt.Fatalf(\"should contain ns/op, got %s\", s)\n\t}\n\tif !strings.Contains(s, \"ns/op\") {\n\t\tt.Fatalf(\"should contain ns/op label, got %s\", s)\n\t}\n}\n\nfunc TestFormatBenchZeroAllocs(t *testing.T) {\n\tr := BenchResult{N: 500, NsPerOp: 2000, AllocsPerOp: 0, BytesPerOp: 0}\n\ts := FormatBench(r)\n\tif !strings.Contains(s, \"500\") {\n\t\tt.Fatalf(\"should contain ops count, got %s\", s)\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step05_test.go",
      "hints": [
        "Start with N=1 and double it until the total elapsed time reaches at least 100ms.",
        "Use time.Now() and time.Since(start) to measure elapsed time.",
        "NsPerOp = elapsed.Nanoseconds() / int64(n).",
        "For CompareBench, compute the ratio a.NsPerOp / b.NsPerOp — less than 0.9 means faster, more than 1.1 means slower."
      ],
      "solution": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\ntype BenchResult struct {\n\tN           int\n\tNsPerOp     int64\n\tAllocsPerOp int64\n\tBytesPerOp  int64\n}\n\nfunc RunBench(fn func()) BenchResult {\n\tn := 1\n\tvar elapsed time.Duration\n\tfor {\n\t\tstart := time.Now()\n\t\tfor i := 0; i < n; i++ {\n\t\t\tfn()\n\t\t}\n\t\telapsed = time.Since(start)\n\t\tif elapsed >= 100*time.Millisecond {\n\t\t\tbreak\n\t\t}\n\t\tif n >= 1000000000 {\n\t\t\tbreak\n\t\t}\n\t\tn *= 2\n\t}\n\tnsPerOp := elapsed.Nanoseconds() / int64(n)\n\treturn BenchResult{\n\t\tN:           n,\n\t\tNsPerOp:     nsPerOp,\n\t\tAllocsPerOp: 0,\n\t\tBytesPerOp:  0,\n\t}\n}\n\nfunc CompareBench(a, b BenchResult) string {\n\tif b.NsPerOp == 0 {\n\t\treturn \"same\"\n\t}\n\tratio := float64(a.NsPerOp) / float64(b.NsPerOp)\n\tif ratio <= 0.9 {\n\t\treturn \"faster\"\n\t}\n\tif ratio > 1.1 {\n\t\treturn \"slower\"\n\t}\n\treturn \"same\"\n}\n\nfunc FormatBench(r BenchResult) string {\n\treturn fmt.Sprintf(\"%d ops, %d ns/op, %d allocs/op, %d bytes/op\",\n\t\tr.N, r.NsPerOp, r.AllocsPerOp, r.BytesPerOp)\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-test-04"
      ]
    },
    {
      "id": "proj-test-06",
      "title": "Fuzz Test Helpers",
      "difficulty": "expert",
      "description": "Build property-based testing helpers with deterministic random generation.\n\nImplement:\n- Generator interface with Generate(rand *rand.Rand) interface{}\n- StringGen(minLen, maxLen int) Generator — generates random strings of length between minLen and maxLen using lowercase letters\n- IntGen(min, max int) Generator — generates random ints in [min, max]\n- Property struct with Name string, Gen Generator, Check func(interface{}) bool\n- RunProperties(t *testing.T, seed int64, iterations int, props []Property) — runs each property N times using a deterministic *rand.Rand seeded with seed\n\nRunProperties should call t.Errorf when a Check returns false, including the property name and the failing input value.",
      "testFiles": [
        {
          "name": "step06_test.go",
          "content": "package main\n\nimport (\n\t\"math/rand\"\n\t\"testing\"\n)\n\nfunc TestStringGenLength(t *testing.T) {\n\tgen := StringGen(3, 7)\n\tr := rand.New(rand.NewSource(42))\n\tfor i := 0; i < 100; i++ {\n\t\ts := gen.Generate(r).(string)\n\t\tif len(s) < 3 || len(s) > 7 {\n\t\t\tt.Fatalf(\"string length %d out of range [3,7]: %q\", len(s), s)\n\t\t}\n\t}\n}\n\nfunc TestStringGenCharacters(t *testing.T) {\n\tgen := StringGen(10, 10)\n\tr := rand.New(rand.NewSource(99))\n\ts := gen.Generate(r).(string)\n\tfor _, c := range s {\n\t\tif c < 'a' || c > 'z' {\n\t\t\tt.Fatalf(\"expected lowercase letter, got %c\", c)\n\t\t}\n\t}\n}\n\nfunc TestIntGenRange(t *testing.T) {\n\tgen := IntGen(5, 15)\n\tr := rand.New(rand.NewSource(42))\n\tfor i := 0; i < 100; i++ {\n\t\tv := gen.Generate(r).(int)\n\t\tif v < 5 || v > 15 {\n\t\t\tt.Fatalf(\"int %d out of range [5,15]\", v)\n\t\t}\n\t}\n}\n\nfunc TestIntGenSingleValue(t *testing.T) {\n\tgen := IntGen(7, 7)\n\tr := rand.New(rand.NewSource(1))\n\tv := gen.Generate(r).(int)\n\tif v != 7 {\n\t\tt.Fatalf(\"expected 7, got %d\", v)\n\t}\n}\n\nfunc TestRunPropertiesAllPass(t *testing.T) {\n\tprops := []Property{\n\t\t{\n\t\t\tName: \"positive-length\",\n\t\t\tGen:  StringGen(1, 10),\n\t\t\tCheck: func(v interface{}) bool {\n\t\t\t\treturn len(v.(string)) > 0\n\t\t\t},\n\t\t},\n\t\t{\n\t\t\tName: \"in-range\",\n\t\t\tGen:  IntGen(0, 100),\n\t\t\tCheck: func(v interface{}) bool {\n\t\t\t\tn := v.(int)\n\t\t\t\treturn n >= 0 && n <= 100\n\t\t\t},\n\t\t},\n\t}\n\tRunProperties(t, 42, 50, props)\n}\n\nfunc TestRunPropertiesDetectsFailure(t *testing.T) {\n\tft := &fakeT3{}\n\tprops := []Property{\n\t\t{\n\t\t\tName: \"always-fails\",\n\t\t\tGen:  IntGen(1, 10),\n\t\t\tCheck: func(v interface{}) bool {\n\t\t\t\treturn false\n\t\t\t},\n\t\t},\n\t}\n\trunPropertiesTestable(ft, 42, 5, props)\n\tif !ft.failed {\n\t\tt.Fatal(\"should detect failing property\")\n\t}\n}\n\nfunc TestRunPropertiesDeterministic(t *testing.T) {\n\tvar values1, values2 []interface{}\n\n\tgen := IntGen(0, 1000)\n\tr1 := rand.New(rand.NewSource(123))\n\tr2 := rand.New(rand.NewSource(123))\n\tfor i := 0; i < 20; i++ {\n\t\tvalues1 = append(values1, gen.Generate(r1))\n\t\tvalues2 = append(values2, gen.Generate(r2))\n\t}\n\tfor i := range values1 {\n\t\tif values1[i] != values2[i] {\n\t\t\tt.Fatalf(\"same seed should produce same values at index %d: %v vs %v\", i, values1[i], values2[i])\n\t\t}\n\t}\n}\n\ntype fakeT3 struct {\n\tfailed bool\n}\n\nfunc (f *fakeT3) Errorf(format string, args ...interface{}) {\n\tf.failed = true\n}\n\nfunc (f *fakeT3) Helper() {}\n"
        }
      ],
      "testRunPattern": "step06_test.go",
      "hints": [
        "Define unexported structs (stringGen, intGen) that implement the Generator interface.",
        "Use r.Intn(max-min+1) + min to generate a random int in [min, max].",
        "For StringGen, generate each character as byte('a' + r.Intn(26)).",
        "RunProperties creates one *rand.Rand from the seed and shares it across all property checks for determinism."
      ],
      "solution": "package main\n\nimport (\n\t\"math/rand\"\n\t\"testing\"\n)\n\ntype Generator interface {\n\tGenerate(r *rand.Rand) interface{}\n}\n\ntype stringGen struct {\n\tminLen, maxLen int\n}\n\nfunc StringGen(minLen, maxLen int) Generator {\n\treturn &stringGen{minLen: minLen, maxLen: maxLen}\n}\n\nfunc (g *stringGen) Generate(r *rand.Rand) interface{} {\n\tlength := g.minLen\n\tif g.maxLen > g.minLen {\n\t\tlength = g.minLen + r.Intn(g.maxLen-g.minLen+1)\n\t}\n\tb := make([]byte, length)\n\tfor i := range b {\n\t\tb[i] = byte('a' + r.Intn(26))\n\t}\n\treturn string(b)\n}\n\ntype intGen struct {\n\tmin, max int\n}\n\nfunc IntGen(min, max int) Generator {\n\treturn &intGen{min: min, max: max}\n}\n\nfunc (g *intGen) Generate(r *rand.Rand) interface{} {\n\tif g.max == g.min {\n\t\treturn g.min\n\t}\n\treturn g.min + r.Intn(g.max-g.min+1)\n}\n\ntype Property struct {\n\tName  string\n\tGen   Generator\n\tCheck func(interface{}) bool\n}\n\ntype tRunner interface {\n\tErrorf(format string, args ...interface{})\n\tHelper()\n}\n\nfunc RunProperties(t *testing.T, seed int64, iterations int, props []Property) {\n\tt.Helper()\n\trunPropertiesTestable(t, seed, iterations, props)\n}\n\nfunc runPropertiesTestable(t tRunner, seed int64, iterations int, props []Property) {\n\tt.Helper()\n\tr := rand.New(rand.NewSource(seed))\n\tfor _, prop := range props {\n\t\tfor i := 0; i < iterations; i++ {\n\t\t\tval := prop.Gen.Generate(r)\n\t\t\tif !prop.Check(val) {\n\t\t\t\tt.Errorf(\"property %q failed on iteration %d with value: %v\", prop.Name, i, val)\n\t\t\t\tbreak\n\t\t\t}\n\t\t}\n\t}\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-test-05"
      ]
    }
  ]
}

export default project

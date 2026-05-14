import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-test-01',
  title: 'Test Framework — Custom Assertions',
  category: 'Projects',
  subcategory: 'Test Framework',
  difficulty: 'intermediate',
  order: 162,
  description: `Build assertion helpers that wrap testing.T for cleaner test code.

Implement:
- Assert struct wrapping *testing.T
- NewAssert(t *testing.T) *Assert
- Equal(got, want interface{}) — uses reflect.DeepEqual, calls t.Errorf with descriptive message
- NotEqual(got, want interface{})
- True(val bool), False(val bool)
- Nil(val interface{}), NotNil(val interface{})
- Contains(haystack, needle string)
- EqualSlice(got, want []string)

Tests use a fakeT to verify assertions fire correctly on incorrect input.`,
  code: `package main

import (
\t"reflect"
\t"strings"
\t"testing"
)

// TODO: Define an Assert struct that wraps *testing.T.

// TODO: Implement NewAssert(t *testing.T) *Assert.

// TODO: Implement Equal(got, want interface{}).

// TODO: Implement NotEqual(got, want interface{}).

// TODO: Implement True(val bool) and False(val bool).

// TODO: Implement Nil(val interface{}) and NotNil(val interface{}).

// TODO: Implement Contains(haystack, needle string).

// TODO: Implement EqualSlice(got, want []string).

func main() {}
`,
  testCode: `package main

import (
\t"testing"
)

type fakeT struct {
\tfailed bool
}

func (f *fakeT) Errorf(format string, args ...interface{}) {
\tf.failed = true
}

func (f *fakeT) Helper() {}

func newFakeAssert() (*Assert, *fakeT) {
\tft := &fakeT{}
\ta := &Assert{t: ft}
\treturn a, ft
}

func TestEqualPass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.Equal(42, 42)
\tif ft.failed {
\t\tt.Fatal("Equal(42,42) should not fail")
\t}
}

func TestEqualFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.Equal(1, 2)
\tif !ft.failed {
\t\tt.Fatal("Equal(1,2) should fail")
\t}
}

func TestNotEqualPass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.NotEqual(1, 2)
\tif ft.failed {
\t\tt.Fatal("NotEqual(1,2) should not fail")
\t}
}

func TestNotEqualFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.NotEqual(5, 5)
\tif !ft.failed {
\t\tt.Fatal("NotEqual(5,5) should fail")
\t}
}

func TestTruePass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.True(true)
\tif ft.failed {
\t\tt.Fatal("True(true) should not fail")
\t}
}

func TestTrueFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.True(false)
\tif !ft.failed {
\t\tt.Fatal("True(false) should fail")
\t}
}

func TestFalsePass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.False(false)
\tif ft.failed {
\t\tt.Fatal("False(false) should not fail")
\t}
}

func TestFalseFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.False(true)
\tif !ft.failed {
\t\tt.Fatal("False(true) should fail")
\t}
}

func TestNilPass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.Nil(nil)
\tif ft.failed {
\t\tt.Fatal("Nil(nil) should not fail")
\t}
}

func TestNilFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.Nil("hello")
\tif !ft.failed {
\t\tt.Fatal("Nil(string) should fail")
\t}
}

func TestNotNilPass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.NotNil("hello")
\tif ft.failed {
\t\tt.Fatal("NotNil(string) should not fail")
\t}
}

func TestNotNilFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.NotNil(nil)
\tif !ft.failed {
\t\tt.Fatal("NotNil(nil) should fail")
\t}
}

func TestContainsPass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.Contains("hello world", "world")
\tif ft.failed {
\t\tt.Fatal("Contains should pass when needle is in haystack")
\t}
}

func TestContainsFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.Contains("hello world", "xyz")
\tif !ft.failed {
\t\tt.Fatal("Contains should fail when needle is not in haystack")
\t}
}

func TestEqualSlicePass(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.EqualSlice([]string{"a", "b"}, []string{"a", "b"})
\tif ft.failed {
\t\tt.Fatal("EqualSlice should pass for identical slices")
\t}
}

func TestEqualSliceFail(t *testing.T) {
\ta, ft := newFakeAssert()
\ta.EqualSlice([]string{"a"}, []string{"a", "b"})
\tif !ft.failed {
\t\tt.Fatal("EqualSlice should fail for different slices")
\t}
}

func TestNewAssertWithRealT(t *testing.T) {
\ta := NewAssert(t)
\ta.Equal(1, 1)
\ta.True(true)
\ta.Contains("Go is great", "great")
}
`,
  solution: `package main

import (
\t"fmt"
\t"reflect"
\t"strings"
\t"testing"
)

type tHelper interface {
\tErrorf(format string, args ...interface{})
\tHelper()
}

type Assert struct {
\tt tHelper
}

func NewAssert(t *testing.T) *Assert {
\treturn &Assert{t: t}
}

func (a *Assert) Equal(got, want interface{}) {
\ta.t.Helper()
\tif !reflect.DeepEqual(got, want) {
\t\ta.t.Errorf("Equal failed: got %v, want %v", got, want)
\t}
}

func (a *Assert) NotEqual(got, want interface{}) {
\ta.t.Helper()
\tif reflect.DeepEqual(got, want) {
\t\ta.t.Errorf("NotEqual failed: values are equal: %v", got)
\t}
}

func (a *Assert) True(val bool) {
\ta.t.Helper()
\tif !val {
\t\ta.t.Errorf("True failed: got false")
\t}
}

func (a *Assert) False(val bool) {
\ta.t.Helper()
\tif val {
\t\ta.t.Errorf("False failed: got true")
\t}
}

func (a *Assert) Nil(val interface{}) {
\ta.t.Helper()
\tif val != nil {
\t\ta.t.Errorf("Nil failed: got %v", val)
\t}
}

func (a *Assert) NotNil(val interface{}) {
\ta.t.Helper()
\tif val == nil {
\t\ta.t.Errorf("NotNil failed: got nil")
\t}
}

func (a *Assert) Contains(haystack, needle string) {
\ta.t.Helper()
\tif !strings.Contains(haystack, needle) {
\t\ta.t.Errorf("Contains failed: %q does not contain %q", haystack, needle)
\t}
}

func (a *Assert) EqualSlice(got, want []string) {
\ta.t.Helper()
\tif !reflect.DeepEqual(got, want) {
\t\ta.t.Errorf("EqualSlice failed: got %v, want %v", got, want)
\t}
}

var _ = fmt.Sprintf

func main() {}
`,
  hints: [
    'Define a tHelper interface with Errorf and Helper methods so the Assert struct can work with both real and fake testing.T.',
    'Use reflect.DeepEqual for Equal/NotEqual/EqualSlice comparisons.',
    'strings.Contains checks if needle is in haystack.',
    'Call t.Helper() at the start of each assertion so error line numbers point to the caller.',
  ],
  projectId: 'proj-test',
  projectTitle: 'Test Framework',
  step: 1,
  totalSteps: 6,
}

export default exercise

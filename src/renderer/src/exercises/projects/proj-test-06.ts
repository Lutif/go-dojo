import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-test-06',
  title: 'Test Framework — Fuzz Test Helpers',
  category: 'Projects',
  subcategory: 'Test Framework',
  difficulty: 'expert',
  order: 167,
  description: `Build property-based testing helpers with deterministic random generation.

Implement:
- Generator interface with Generate(rand *rand.Rand) interface{}
- StringGen(minLen, maxLen int) Generator — generates random strings of length between minLen and maxLen using lowercase letters
- IntGen(min, max int) Generator — generates random ints in [min, max]
- Property struct with Name string, Gen Generator, Check func(interface{}) bool
- RunProperties(t *testing.T, seed int64, iterations int, props []Property) — runs each property N times using a deterministic *rand.Rand seeded with seed

RunProperties should call t.Errorf when a Check returns false, including the property name and the failing input value.`,
  code: `package main

import (
\t"math/rand"
\t"testing"
)

// TODO: Define Generator interface { Generate(rand *rand.Rand) interface{} }.

// TODO: Implement StringGen(minLen, maxLen int) Generator.

// TODO: Implement IntGen(min, max int) Generator.

// TODO: Define Property struct { Name string; Gen Generator; Check func(interface{}) bool }.

// TODO: Implement RunProperties(t *testing.T, seed int64, iterations int, props []Property).

func main() {}
`,
  testCode: `package main

import (
\t"math/rand"
\t"testing"
)

func TestStringGenLength(t *testing.T) {
\tgen := StringGen(3, 7)
\tr := rand.New(rand.NewSource(42))
\tfor i := 0; i < 100; i++ {
\t\ts := gen.Generate(r).(string)
\t\tif len(s) < 3 || len(s) > 7 {
\t\t\tt.Fatalf("string length %d out of range [3,7]: %q", len(s), s)
\t\t}
\t}
}

func TestStringGenCharacters(t *testing.T) {
\tgen := StringGen(10, 10)
\tr := rand.New(rand.NewSource(99))
\ts := gen.Generate(r).(string)
\tfor _, c := range s {
\t\tif c < 'a' || c > 'z' {
\t\t\tt.Fatalf("expected lowercase letter, got %c", c)
\t\t}
\t}
}

func TestIntGenRange(t *testing.T) {
\tgen := IntGen(5, 15)
\tr := rand.New(rand.NewSource(42))
\tfor i := 0; i < 100; i++ {
\t\tv := gen.Generate(r).(int)
\t\tif v < 5 || v > 15 {
\t\t\tt.Fatalf("int %d out of range [5,15]", v)
\t\t}
\t}
}

func TestIntGenSingleValue(t *testing.T) {
\tgen := IntGen(7, 7)
\tr := rand.New(rand.NewSource(1))
\tv := gen.Generate(r).(int)
\tif v != 7 {
\t\tt.Fatalf("expected 7, got %d", v)
\t}
}

func TestRunPropertiesAllPass(t *testing.T) {
\tprops := []Property{
\t\t{
\t\t\tName: "positive-length",
\t\t\tGen:  StringGen(1, 10),
\t\t\tCheck: func(v interface{}) bool {
\t\t\t\treturn len(v.(string)) > 0
\t\t\t},
\t\t},
\t\t{
\t\t\tName: "in-range",
\t\t\tGen:  IntGen(0, 100),
\t\t\tCheck: func(v interface{}) bool {
\t\t\t\tn := v.(int)
\t\t\t\treturn n >= 0 && n <= 100
\t\t\t},
\t\t},
\t}
\tRunProperties(t, 42, 50, props)
}

func TestRunPropertiesDetectsFailure(t *testing.T) {
\tft := &fakeT3{}
\tprops := []Property{
\t\t{
\t\t\tName: "always-fails",
\t\t\tGen:  IntGen(1, 10),
\t\t\tCheck: func(v interface{}) bool {
\t\t\t\treturn false
\t\t\t},
\t\t},
\t}
\trunPropertiesTestable(ft, 42, 5, props)
\tif !ft.failed {
\t\tt.Fatal("should detect failing property")
\t}
}

func TestRunPropertiesDeterministic(t *testing.T) {
\tvar values1, values2 []interface{}

\tgen := IntGen(0, 1000)
\tr1 := rand.New(rand.NewSource(123))
\tr2 := rand.New(rand.NewSource(123))
\tfor i := 0; i < 20; i++ {
\t\tvalues1 = append(values1, gen.Generate(r1))
\t\tvalues2 = append(values2, gen.Generate(r2))
\t}
\tfor i := range values1 {
\t\tif values1[i] != values2[i] {
\t\t\tt.Fatalf("same seed should produce same values at index %d: %v vs %v", i, values1[i], values2[i])
\t\t}
\t}
}

type fakeT3 struct {
\tfailed bool
}

func (f *fakeT3) Errorf(format string, args ...interface{}) {
\tf.failed = true
}

func (f *fakeT3) Helper() {}
`,
  solution: `package main

import (
\t"math/rand"
\t"testing"
)

type Generator interface {
\tGenerate(r *rand.Rand) interface{}
}

type stringGen struct {
\tminLen, maxLen int
}

func StringGen(minLen, maxLen int) Generator {
\treturn &stringGen{minLen: minLen, maxLen: maxLen}
}

func (g *stringGen) Generate(r *rand.Rand) interface{} {
\tlength := g.minLen
\tif g.maxLen > g.minLen {
\t\tlength = g.minLen + r.Intn(g.maxLen-g.minLen+1)
\t}
\tb := make([]byte, length)
\tfor i := range b {
\t\tb[i] = byte('a' + r.Intn(26))
\t}
\treturn string(b)
}

type intGen struct {
\tmin, max int
}

func IntGen(min, max int) Generator {
\treturn &intGen{min: min, max: max}
}

func (g *intGen) Generate(r *rand.Rand) interface{} {
\tif g.max == g.min {
\t\treturn g.min
\t}
\treturn g.min + r.Intn(g.max-g.min+1)
}

type Property struct {
\tName  string
\tGen   Generator
\tCheck func(interface{}) bool
}

type tRunner interface {
\tErrorf(format string, args ...interface{})
\tHelper()
}

func RunProperties(t *testing.T, seed int64, iterations int, props []Property) {
\tt.Helper()
\trunPropertiesTestable(t, seed, iterations, props)
}

func runPropertiesTestable(t tRunner, seed int64, iterations int, props []Property) {
\tt.Helper()
\tr := rand.New(rand.NewSource(seed))
\tfor _, prop := range props {
\t\tfor i := 0; i < iterations; i++ {
\t\t\tval := prop.Gen.Generate(r)
\t\t\tif !prop.Check(val) {
\t\t\t\tt.Errorf("property %q failed on iteration %d with value: %v", prop.Name, i, val)
\t\t\t\tbreak
\t\t\t}
\t\t}
\t}
}

func main() {}
`,
  hints: [
    'Define unexported structs (stringGen, intGen) that implement the Generator interface.',
    'Use r.Intn(max-min+1) + min to generate a random int in [min, max].',
    'For StringGen, generate each character as byte(\'a\' + r.Intn(26)).',
    'RunProperties creates one *rand.Rand from the seed and shares it across all property checks for determinism.',
  ],
  projectId: 'proj-test',
  step: 6,
  totalSteps: 6,
}

export default exercise

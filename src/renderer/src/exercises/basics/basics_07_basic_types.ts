import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_07_basic_types',
  title: 'Basic Types',
  category: 'Basics',
  subcategory: 'Types',
  difficulty: 'beginner',
  order: 7,
  description: `Go is statically typed with several built-in types:

- **Integers**: \`int\`, \`int8\`, \`int16\`, \`int32\`, \`int64\` (and unsigned \`uint\` variants)
- **Floats**: \`float32\`, \`float64\`
- **Other**: \`bool\`, \`string\`, \`byte\` (alias for uint8), \`rune\` (alias for int32)

In practice, use \`int\` for integers and \`float64\` for decimals unless you have a specific reason to choose a sized type.

Your task: create variables of different types and return them.`,
  code: `package main

// BasicTypes should return one value of each type:
//   int:     42
//   float64: 3.14
//   bool:    true
//   string:  "Go"
//   byte:    'G' (a single byte)
//   rune:    '世' (a Unicode character)
func BasicTypes() (int, float64, bool, string, byte, rune) {
	// TODO: Declare variables of each type and return them

	return 0, 0, false, "", 0, 0
}`,
  testCode: `package main

import "testing"

func TestBasicTypes(t *testing.T) {
	i, f, b, s, by, r := BasicTypes()
	if i != 42 {
		t.Errorf("int = %d, want 42", i)
	}
	if f != 3.14 {
		t.Errorf("float64 = %f, want 3.14", f)
	}
	if b != true {
		t.Errorf("bool = %v, want true", b)
	}
	if s != "Go" {
		t.Errorf("string = %q, want %q", s, "Go")
	}
	if by != 'G' {
		t.Errorf("byte = %c, want 'G'", by)
	}
	if r != '世' {
		t.Errorf("rune = %c, want '世'", r)
	}
}`,
  solution: `package main

func BasicTypes() (int, float64, bool, string, byte, rune) {
	i := 42
	f := 3.14
	b := true
	s := "Go"
	var by byte = 'G'
	r := '世'
	return i, f, b, s, by, r
}`,
  hints: [
    'Most types can use := with inference. But byte needs an explicit type: var b byte = \'G\' (otherwise Go infers rune/int32 for character literals).',
    'Single quotes are for runes/bytes: \'A\'. Double quotes are for strings: "hello".',
    'A rune is an alias for int32 and represents a Unicode code point. A byte is an alias for uint8.'
  ],
}

export default exercise

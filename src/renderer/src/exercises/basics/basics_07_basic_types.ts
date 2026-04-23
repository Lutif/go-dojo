import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_07_basic_types',
  title: 'Basic Types',
  category: 'Basics',
  subcategory: 'Types',
  difficulty: 'beginner',
  order: 7,
  description: `Go’s built-in types are fixed at compile time: every value belongs to one of them. For whole numbers you have \`int\` (a good default whose size matches the machine) and **sized** integers like \`int8\` or \`int64\` when you care about memory layout or interop. For decimals you have \`float32\` and \`float64\`; most code uses \`float64\`. \`bool\` is for logic, \`string\` for text, \`byte\` is the same as \`uint8\` (one raw byte), and \`rune\` is the same as \`int32\` and represents a single Unicode code point. Character literals in single quotes, like \`'A'\` or \`'世'\`, have type \`rune\` when they are multi-byte in UTF-8. Unless you are optimizing or matching an external format, \`int\` + \`float64\` is enough.

**Your task:** return one value of each of the required types, using the values given in the function comment.`,
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

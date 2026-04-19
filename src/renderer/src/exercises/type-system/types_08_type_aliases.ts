import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_08_type_aliases',
  title: 'Type Aliases',
  category: 'Type System',
  subcategory: 'Types',
  difficulty: 'intermediate',
  order: 8,
  description: `Type **aliases** use \`=\` and are interchangeable with the original:
\`\`\`
type Byte = uint8     // byte and uint8 are the same type
type Rune = int32     // rune and int32 are the same type
\`\`\`

Type **definitions** (without \`=\`) create distinct types:
\`\`\`
type UserID int       // UserID is NOT int — different type
\`\`\`

The key difference: aliases can use the original type's methods. Definitions start with a clean slate.

Your task: understand the difference between type definitions and type aliases.`,
  code: `package main

import "fmt"

// Type DEFINITION — creates a new distinct type
type StringList []string

// TODO: Add a method Join(sep string) string on StringList
// that joins all strings with the separator

// Type ALIAS — just another name for the same type
type Text = string

// IsTypeDef demonstrates that type definitions create distinct types.
// Given an int, convert it to UserID (a defined type) and back.
type UserID int

func IsTypeDef() bool {
	var id UserID = 42
	// TODO: Check that UserID and int are different types
	// by verifying you need explicit conversion.
	// Convert id to int, compare to 42, return the result.
	_ = id
	return false
}

// AliasesAreInterchangeable shows that aliases need no conversion.
func AliasesAreInterchangeable() bool {
	var t Text = "hello"
	// TODO: Assign t directly to a string variable (no conversion needed).
	// Return true if they are equal.
	_ = t
	return false
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestStringListJoin(t *testing.T) {
	sl := StringList{"Go", "is", "fun"}
	got := sl.Join(" ")
	want := "Go is fun"
	if got != want {
		t.Errorf("Join(' ') = %q, want %q", got, want)
	}
	got2 := sl.Join("-")
	want2 := "Go-is-fun"
	if got2 != want2 {
		t.Errorf("Join('-') = %q, want %q", got2, want2)
	}
	empty := StringList{}
	if got3 := empty.Join(","); got3 != "" {
		t.Errorf("empty.Join = %q, want empty", got3)
	}
}

func TestIsTypeDef(t *testing.T) {
	if !IsTypeDef() {
		t.Error("IsTypeDef() should return true")
	}
}

func TestAliasesAreInterchangeable(t *testing.T) {
	if !AliasesAreInterchangeable() {
		t.Error("AliasesAreInterchangeable() should return true")
	}
}`,
  solution: `package main

import "fmt"

type StringList []string

func (sl StringList) Join(sep string) string {
	result := ""
	for i, s := range sl {
		if i > 0 {
			result += sep
		}
		result += s
	}
	return result
}

type Text = string

type UserID int

func IsTypeDef() bool {
	var id UserID = 42
	n := int(id) // explicit conversion required
	return n == 42
}

func AliasesAreInterchangeable() bool {
	var t Text = "hello"
	var s string = t // no conversion needed — same type
	return s == "hello"
}

var _ = fmt.Sprintf`,
  hints: [
    'type Name Type (no =) is a definition — new distinct type. type Name = Type (with =) is an alias — same type.',
    'You can add methods to type definitions but not to aliases (since aliases ARE the original type).',
    'UserID(42) and int(id) are needed for conversions between defined types and their base.'
  ],
}

export default exercise

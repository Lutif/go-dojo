import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_02_variables',
  title: 'Variables',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 2,
  description: `Go is **statically typed**: every variable has a type known at compile time. The \`var\` keyword is how you introduce one. Unlike Python or JavaScript where a name is just bound to any value at runtime, Go needs to know the type up front so it can lay out memory efficiently, pick the right machine instructions, and catch type mismatches before the program runs.

You have three ways to write a \`var\` declaration:

1. **Explicit type and value** — \`var name string = "Gopher"\`
2. **Type inferred from value** — \`var age = 10\` (Go sees \`10\` and infers \`int\`)
3. **Type only, no value** — \`var student bool\` (gets the *zero value*: \`""\` for string, \`0\` for int, \`false\` for bool)

Inside functions you'll often see the shorthand \`name := "Gopher"\` instead, but \`var\` is what you use at package scope and whenever you want to be explicit about the type or rely on the zero value. This exercise focuses on \`var\` specifically so the muscle memory sticks.

**Your task:** implement \`DeclareVariables\` so it returns three values using \`var\` declarations — a \`string\` \`"Gopher"\`, an \`int\` \`10\`, and a \`bool\` \`true\`. The function signature (multi-value return) is already provided; you just fill in the body and return the three names in order.`,
  code: `package main

func DeclareVariables() (string, int, bool) {
	// TODO: Declare variables using var and return them
	// name should be "Gopher", age should be 10, student should be true
	
	return "", 0, false
}`,
  testCode: `package main

import "testing"

func TestDeclareVariables(t *testing.T) {
	name, age, student := DeclareVariables()
	if name != "Gopher" {
		t.Errorf("name = %q, want %q", name, "Gopher")
	}
	if age != 10 {
		t.Errorf("age = %d, want %d", age, 10)
	}
	if student != true {
		t.Errorf("student = %v, want %v", student, true)
	}
}`,
  solution: `package main

func DeclareVariables() (string, int, bool) {
	var name string = "Gopher"
	var age int = 10
	var student bool = true
	return name, age, student
}`,
  hints: [
    'Syntax with explicit type: var name string = "Gopher"',
    'You can omit the type when assigning: var age = 10 — Go infers it as int.',
    'Go has three basic types you need here: string (text), int (whole numbers), bool (true/false).'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_02_variables',
  title: 'Variables',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 2,
  description: `Declare variables using the \`var\` keyword. Unlike dynamically-typed languages, Go requires you to declare the type — or assign a value so the compiler can infer it.

Syntax: \`var name string = "value"\` or \`var age = 10\` (type inferred).

Your task: declare three variables using \`var\` and return them.`,
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

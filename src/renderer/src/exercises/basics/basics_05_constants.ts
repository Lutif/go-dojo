import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_05_constants',
  title: 'Constants',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 5,
  description: `A **constant** is a name for a value that is fixed for the whole program. You declare constants with \`const\` and the compiler will not let you reassign them. Values must be **known at compile time** — literals, other constants, and constant expressions are fine, but the result of a function call (which runs later) is not. Constants help document intent ("this never changes") and can enable optimizations. You can give an explicit type (\`const Name string = "Go"\`) or let Go infer it (\`const AppName = "GoDojo"\`). A \`const (...)\` block is common when you group many related names.

**Your task:** add the three package-level constants shown in the starter comments, then return them from \`GetConstants()\`.`,
  code: `package main

// TODO: Define three constants at package level:
//   AppName  = "GoDojo"
//   Version  = 1
//   IsStable = true

func GetConstants() (string, int, bool) {
	// Return the three constants
	return "", 0, false
}`,
  testCode: `package main

import "testing"

func TestGetConstants(t *testing.T) {
	name, ver, stable := GetConstants()
	if name != "GoDojo" {
		t.Errorf("AppName = %q, want %q", name, "GoDojo")
	}
	if ver != 1 {
		t.Errorf("Version = %d, want %d", ver, 1)
	}
	if stable != true {
		t.Errorf("IsStable = %v, want %v", stable, true)
	}
}`,
  solution: `package main

const AppName = "GoDojo"
const Version = 1
const IsStable = true

func GetConstants() (string, int, bool) {
	return AppName, Version, IsStable
}`,
  hints: [
    'Use const instead of var: const AppName = "GoDojo"',
    'Constants can be declared at package level (outside functions) — unlike :=',
    'You can group constants: const (AppName = "GoDojo"; Version = 1)'
  ],
}

export default exercise

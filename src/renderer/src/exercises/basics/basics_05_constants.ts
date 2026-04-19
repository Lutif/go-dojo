import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_05_constants',
  title: 'Constants',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 5,
  description: `Constants are declared with \`const\` and cannot be changed after declaration. Their values must be known at compile time — you can't assign a function call to a constant.

Syntax: \`const Pi = 3.14159\` or \`const Name string = "Go"\`

Your task: define three constants and return them from the function.`,
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

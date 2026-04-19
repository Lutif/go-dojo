import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_03_short_declaration',
  title: 'Short Declaration',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 3,
  description: `The \`:=\` operator is Go's shorthand for declaring and initializing a variable in one step — the compiler infers the type from the right-hand side.

\`:=\` is the most common way to declare variables inside functions. You cannot use it at package level (use \`var\` there instead).

Your task: use \`:=\` to declare three variables and return them.`,
  code: `package main

func ShortDeclaration() (string, int, bool) {
	// TODO: Use := to declare city, population, and isCapital
	// city should be "Tokyo", population should be 14000000, isCapital should be true
	
	return "", 0, false
}`,
  testCode: `package main

import "testing"

func TestShortDeclaration(t *testing.T) {
	city, pop, isCap := ShortDeclaration()
	if city != "Tokyo" {
		t.Errorf("city = %q, want %q", city, "Tokyo")
	}
	if pop != 14000000 {
		t.Errorf("population = %d, want %d", pop, 14000000)
	}
	if isCap != true {
		t.Errorf("isCapital = %v, want %v", isCap, true)
	}
}`,
  solution: `package main

func ShortDeclaration() (string, int, bool) {
	city := "Tokyo"
	population := 14000000
	isCapital := true
	return city, population, isCapital
}`,
  hints: [
    'Example: city := "Tokyo" — declares city as a string and assigns "Tokyo".',
    'Unlike var, := cannot be used at package level. It only works inside functions.',
    'You can also declare multiple variables: x, y := 1, 2'
  ],
}

export default exercise

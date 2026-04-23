import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_03_short_declaration',
  title: 'Short Declaration',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 3,
  description: `The \`:=\` (short) declaration creates a new variable and assigns its first value in one step. The compiler **infers the type** from the expression on the right, so you rarely need to repeat the type in everyday code. Inside functions, \`:=\` is the usual idiom; **outside** of any function (at package level) you must use \`var\`, because short declarations are only allowed in function bodies.

A quick mental model: \`x := 1\` is like "declare \`x\` here and set it to \`1\`," where \`x\` is new in that block.

**Your task:** use \`:=\` to declare the three return values (city, population, isCapital) and return them.`,
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

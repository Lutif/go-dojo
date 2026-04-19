import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_20_runes',
  title: 'Runes',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 20,
  description: `Learn about runes, Go's way of handling Unicode characters. A rune is an alias for \`int32\` and represents a single Unicode code point.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'A rune is declared as \`r := \'A\'\` (single quotes for rune literals)',
    'Use the \`rune\` type for Unicode characters',
    'Convert between runes and strings using type conversion',
  ],
}

export default exercise

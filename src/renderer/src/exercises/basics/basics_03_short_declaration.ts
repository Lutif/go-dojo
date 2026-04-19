import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_03_short_declaration',
  title: 'Short Declaration',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 3,
  description: `Learn Go's concise \`:=\` operator for declaring and initializing variables in one step. This is the preferred way to create variables inside functions.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'The \`:=\` operator is only available inside functions, not at package level',
    'The compiler infers the type from the right-hand side value',
    'This is more concise than using \`var\` keyword with explicit type',
  ],
}

export default exercise

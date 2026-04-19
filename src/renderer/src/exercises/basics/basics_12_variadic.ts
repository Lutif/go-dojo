import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_12_variadic',
  title: 'Variadic Functions',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 12,
  description: `Understand variadic functions that accept a variable number of arguments. Use the \`...\` operator before the type to accept zero or more arguments of that type.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Declare variadic parameters with \`...Type\` syntax',
    'Variadic parameters must be the last parameter in the function',
    'Inside the function, the variadic parameter is a slice of that type',
  ],
}

export default exercise

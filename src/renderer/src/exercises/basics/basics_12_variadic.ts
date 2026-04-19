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

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use ... before the type to make a parameter variadic: func name(args ...Type)',
    'Inside the function, the variadic parameter is a slice of that type',
    'You can pass individual values or unpack a slice using ...',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-08',
  title: 'Parser — Prefix Expressions',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 108,
  description: `Implement conditionals (if-else) in the evaluator. If expressions choose based on truthiness.`,
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
    'Evaluate condition; if truthy, evaluate consequence',
    'Otherwise evaluate alternative',
    'Define truthiness: false and null are falsy, else truthy',
  ],
}

export default exercise

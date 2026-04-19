import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-09',
  title: 'Parser — Infix Expressions (Arithmetic)',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 109,
  description: `Add function evaluation with closures. Functions capture their environment.`,
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
    'Store function literals as values',
    'Create new environment for function calls',
    'Functions can reference outer variables (closures)',
  ],
}

export default exercise

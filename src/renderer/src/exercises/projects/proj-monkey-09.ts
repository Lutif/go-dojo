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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Store function literals as values',
    'Create new environment for function calls',
    'Functions can reference outer variables (closures)',
  ],
}

export default exercise

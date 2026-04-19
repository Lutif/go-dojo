import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-10',
  title: 'Parser — Comparison Operators',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 110,
  description: `Implement function calls with argument binding. Arguments bind to parameters in the function scope.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Extend environment with parameter bindings',
    'Evaluate function body in extended environment',
    'Return result of last expression in function',
  ],
}

export default exercise

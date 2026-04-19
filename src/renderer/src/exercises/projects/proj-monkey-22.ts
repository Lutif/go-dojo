import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-22',
  title: 'Evaluator — Capstone (Full Interpreter)',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 122,
  description: `Polish the interpreter with comprehensive builtins. Builtins provide standard functionality.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement useful builtin functions',
    'Add type checking functions (is_integer, is_string, etc.)',
    'Complete standard library',
  ],
}

export default exercise

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

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement useful builtin functions',
    'Add type checking functions (is_integer, is_string, etc.)',
    'Complete standard library',
  ],
}

export default exercise

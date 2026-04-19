import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-16',
  title: 'Evaluator — Prefix Expressions',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 116,
  description: `Implement hash methods and operations. Hash operations provide common functionality.`,
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
    'len(hash) returns number of keys',
    'keys(hash) returns array of keys',
    'values(hash) returns array of values',
  ],
}

export default exercise

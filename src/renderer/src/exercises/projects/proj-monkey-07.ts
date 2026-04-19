import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-07',
  title: 'Parser — Integer & Boolean Literals',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 107,
  description: `Evaluate variables and assignments. Variables store values in an environment.`,
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
    'Maintain environment mapping identifiers to values',
    'Evaluate let statements to store values',
    'Look up variables in environment',
  ],
}

export default exercise

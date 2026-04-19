import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-02',
  title: 'CLI Parser — Parse -key value Space Syntax',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 11,
  description: `Add positional argument support to the CLI parser. Positional arguments come after flags and define the main action.`,
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
    'Separate flags from positional arguments after parsing',
    'Store positional arguments in order',
    'Validate required positional arguments are provided',
  ],
}

export default exercise

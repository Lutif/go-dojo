import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-06',
  title: 'CLI Parser — Usage, Vars & Capstone',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'expert',
  order: 15,
  description: `Implement validation and error handling in the CLI parser. Good error messages help users fix issues quickly.`,
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
    'Validate required arguments are provided',
    'Check flag values are valid (numeric ranges, enums)',
    'Return clear error messages suggesting fixes',
  ],
}

export default exercise

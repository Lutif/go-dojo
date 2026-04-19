import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-03',
  title: 'Subcommands — Help Text',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 36,
  description: `Implement help for subcommands. Good help text improves usability.`,
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
    'Show subcommand description and usage',
    'List subcommand-specific flags',
    'Include examples',
  ],
}

export default exercise

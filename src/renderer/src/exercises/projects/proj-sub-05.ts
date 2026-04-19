import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-05',
  title: 'Subcommands — Todo CLI Capstone',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'expert',
  order: 38,
  description: `Implement command chaining and piping. Chaining enables complex workflows.`,
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
    'Support running multiple commands in sequence',
    'Output of one command can input to another',
    'Maintain shared context across commands',
  ],
}

export default exercise

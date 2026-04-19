import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-02',
  title: 'Subcommands — Dispatch',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 35,
  description: `Add subcommand-specific flags and arguments. Each subcommand can have its own options.`,
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
    'Parse flags after subcommand name',
    'Each subcommand defines its own flags',
    'Validate subcommand-specific arguments',
  ],
}

export default exercise

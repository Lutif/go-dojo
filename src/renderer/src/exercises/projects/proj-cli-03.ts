import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-03',
  title: 'CLI Parser — Full Parse Loop',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 12,
  description: `Implement subcommands for hierarchical CLI structure. Subcommands enable grouping related operations (like "git commit", "git push").`,
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
    'Parse first positional argument as subcommand name',
    'Route remaining arguments to subcommand handler',
    'Each subcommand has its own flags and arguments',
  ],
}

export default exercise

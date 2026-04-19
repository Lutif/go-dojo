import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-04',
  title: 'CLI Parser — FlagSet with Typed Registration',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 13,
  description: `Add usage and help generation to the CLI parser. Good help text is essential for user experience.`,
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
    'Auto-generate help from flags and descriptions',
    'Display usage when -h or -help is provided',
    'Include examples in help output',
  ],
}

export default exercise

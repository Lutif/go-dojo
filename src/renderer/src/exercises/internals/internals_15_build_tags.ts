import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_15_build_tags',
  title: 'Build Tags',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 15,
  description: `Use build tags for platform-specific code. Build tags conditionally include/exclude files during compilation.`,
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
    '// +build linux at top of file includes it only on Linux',
    'Enables single codebase supporting multiple platforms',
    'Common tags: linux, darwin, windows, amd64, arm64',
  ],
}

export default exercise

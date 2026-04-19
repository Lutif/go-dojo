import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_17_linker_flags',
  title: 'Linker Flags',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 17,
  description: `Use -ldflags to embed build information. Linker flags allow setting variables at compile time.`,
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
    'go build -ldflags "-X main.Version=1.0" sets main.Version variable',
    'Useful for embedding version, build date, git commit hash',
    'Must be an uninitialized string variable for -X to work',
  ],
}

export default exercise

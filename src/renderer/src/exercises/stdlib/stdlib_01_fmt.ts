import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_01_fmt',
  title: 'fmt Formatting',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'beginner',
  order: 1,
  description: `Learn the fmt package for formatted input/output. Fmt provides functions for printing, scanning, and formatting strings.`,
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
    '`fmt.Println()` prints with a newline',
    '`fmt.Printf()` formats strings like C\'s printf',
    '`fmt.Sprintf()` returns formatted string without printing',
  ],
}

export default exercise

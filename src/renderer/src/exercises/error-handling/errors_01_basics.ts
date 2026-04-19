import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_01_basics',
  title: 'Error Basics',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'beginner',
  order: 1,
  description: `Learn Go's error handling model where functions return error as the last value. Go treats errors as values, enabling explicit error handling.`,
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
    'Functions returning errors typically do so as the last return value',
    'Check error immediately: `if err != nil { ... }`',
    'Never ignore errors silently; always handle or propagate them',
  ],
}

export default exercise

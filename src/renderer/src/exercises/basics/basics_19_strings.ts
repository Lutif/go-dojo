import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_19_strings',
  title: 'Strings',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 19,
  description: `Work with Go's string type and basic string operations. Understand that strings are immutable sequences of bytes.`,
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
    'Strings are immutable in Go; string concatenation creates new strings',
    'Access individual characters with indexing, but this gives a byte value',
    'Use len() to get the number of bytes in a string',
  ],
}

export default exercise

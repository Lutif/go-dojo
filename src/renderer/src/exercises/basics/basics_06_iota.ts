import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_06_iota',
  title: 'Iota',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 6,
  description: `Understand Go's \`iota\` identifier for creating enumerations. \`iota\` starts at 0 and increments by 1 for each constant in a declaration block, enabling pattern-based constant generation.`,
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
    'iota starts at 0 and increments by 1 for each const declaration in the same block',
    'iota is reset when a new const block begins',
    'You can perform operations on iota values to create different sequences',
  ],
}

export default exercise

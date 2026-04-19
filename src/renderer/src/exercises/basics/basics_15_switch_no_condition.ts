import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_15_switch_no_condition',
  title: 'Switch No Condition',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 15,
  description: `Use switch without a condition as a cleaner alternative to if-else chains. This is a Go-specific pattern.`,
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
    'Write switch without an expression: switch { case condition1: ... case condition2: ... }',
    'Each case should be a boolean expression',
    'This pattern is often more readable than many if-else statements',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_20_structured_logging',
  title: 'Structured Logging',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 20,
  description: `Implement structured logging for better debugging. Structured logging outputs key-value pairs for easier parsing and analysis.`,
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
    'Log messages with key-value pairs instead of strings',
    'Include context like request ID, user ID, operation name',
    'Use slog or similar for standard structured logging',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_07_panic',
  title: 'Panic',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 7,
  description: `Understand panic for unrecoverable errors. Panic immediately terminates the current goroutine; use it only for truly exceptional situations.`,
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
    'panic() stops execution and runs deferred functions',
    'Only use panic for truly unrecoverable conditions (like invariant violations)',
    'Avoid using panic for regular error handling; return errors instead',
  ],
}

export default exercise

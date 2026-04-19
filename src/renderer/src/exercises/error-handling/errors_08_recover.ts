import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_08_recover',
  title: 'Recover',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 8,
  description: `Use recover to catch panics in deferred functions. Recover allows recovering from panics and continuing execution gracefully.`,
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
    'recover() only works in deferred functions and returns the panic value',
    'If no panic occurred, recover() returns nil',
    'Useful for preventing entire process crash; still log the panic',
  ],
}

export default exercise

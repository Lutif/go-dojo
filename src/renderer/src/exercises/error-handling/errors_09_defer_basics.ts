import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_09_defer_basics',
  title: 'Defer Basics',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'beginner',
  order: 9,
  description: `Master defer for cleanup operations. Defer ensures code runs even if the function returns early or panics.`,
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
    'defer schedules a function to run when the enclosing function returns',
    'Deferred functions execute in LIFO order (last-defer-first-to-run)',
    'Perfect for cleanup: closing files, unlocking mutexes, releasing resources',
  ],
}

export default exercise

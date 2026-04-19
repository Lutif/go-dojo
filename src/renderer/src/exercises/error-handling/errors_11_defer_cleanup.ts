import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_11_defer_cleanup',
  title: 'Defer Cleanup',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'intermediate',
  order: 11,
  description: `Use defer patterns for resource cleanup. Defer patterns are the Go way to ensure resources are always released properly.`,
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
    'Open resource, immediately defer Close() to ensure cleanup',
    'Check Close() error: it may indicate unsaved changes failed to flush',
    'Nest defers in order of dependency: close in reverse of opening',
  ],
}

export default exercise

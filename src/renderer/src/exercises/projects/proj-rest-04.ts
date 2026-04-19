import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-04',
  title: 'REST API — JSON Errors & Validation',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 31,
  description: `Add authentication and authorization. Auth protects sensitive operations.`,
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
    'Implement token-based auth (JWT)',
    'Check permissions based on user role',
    'Protect endpoints that modify data',
  ],
}

export default exercise

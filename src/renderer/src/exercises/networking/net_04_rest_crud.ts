import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_04_rest_crud',
  title: 'REST CRUD API',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'intermediate',
  order: 4,
  description: `Implement REST endpoints for CRUD operations. REST APIs use HTTP methods and paths to create a uniform interface.`,
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
    'POST to create, GET to read, PUT to update, DELETE to remove',
    'Use request.Method to determine operation',
    'Parse IDs from URL path using path parameters',
  ],
}

export default exercise

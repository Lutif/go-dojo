import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-01',
  title: 'REST API — Thread-Safe Store',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 28,
  description: `Create REST API with basic CRUD endpoints. REST APIs follow standard patterns for resource operations.`,
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
    'POST to create new resource',
    'GET to retrieve resource',
    'PUT to update resource',
    'DELETE to remove resource',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-02',
  title: 'REST API — GET and POST Handlers',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 29,
  description: `Add request validation and error handling. Good validation prevents invalid data.`,
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
    'Validate required fields present',
    'Check field values are valid (type, range)',
    'Return helpful error messages',
  ],
}

export default exercise

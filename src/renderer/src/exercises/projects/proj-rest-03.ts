import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-03',
  title: 'REST API — GET, PUT, DELETE by ID',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 30,
  description: `Implement filtering, sorting, and pagination. These features help manage large datasets.`,
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
    'Query parameters for filtering: ?name=value',
    'Sorting: ?sort=field or ?sort=-field for reverse',
    'Pagination: ?page=1&limit=10',
  ],
}

export default exercise

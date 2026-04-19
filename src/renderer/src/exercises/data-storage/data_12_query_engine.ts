import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_12_query_engine',
  title: 'Simple Query Engine',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 12,
  description: `Build a simple query engine for filtering and sorting data. Query engines execute operations like filtering, grouping, and sorting on in-memory data.`,
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
    'Parse or construct queries into executable plans',
    'Apply filters as predicates, sort using custom comparators',
    'Use goroutines to parallelize operations on large datasets',
  ],
}

export default exercise

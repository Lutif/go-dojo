import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_15_column_store',
  title: 'Column Store',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 15,
  description: `Implement a column-oriented storage for analytical queries. Column stores compress better and accelerate aggregations on specific columns.`,
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
    'Store data column-by-column instead of row-by-row',
    'Easier to compress columns of the same type',
    'Faster aggregation queries (sum, avg) when only few columns are needed',
  ],
}

export default exercise

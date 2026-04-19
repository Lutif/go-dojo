import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_11_table_driven_tests',
  title: 'Table Driven Tests',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 11,
  description: `Write table-driven tests for comprehensive coverage. Table-driven tests reduce duplication and improve clarity.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define slice of test cases with inputs and expected outputs',
    'Loop through cases, testing each one',
    'Easy to add new test cases without duplicating test logic',
  ],
}

export default exercise

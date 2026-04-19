import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_14_iterator',
  title: 'Iterator Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 14,
  description: `Implement iterator pattern for traversing collections. Iterators provide sequential access without exposing internal structure.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Iterator type wraps collection and maintains position',
    'Has Next() method returning next item and error',
    'Useful for tree traversal and custom collection types',
  ],
}

export default exercise

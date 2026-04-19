import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_09_repository',
  title: 'Repository Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 9,
  description: `Build repository pattern for data access abstraction. Repositories encapsulate data access logic.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define Repository interface with Find, Save, Delete methods',
    'Concrete implementations handle specific storage backends',
    'Enables switching storage without changing business logic',
  ],
}

export default exercise

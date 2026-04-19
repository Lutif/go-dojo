import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_06_interface_internals',
  title: 'Interface Internals',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 6,
  description: `Understand interface values and their memory representation. Interfaces store a type pointer and data pointer.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Interface value contains: pointer to type info, pointer to concrete data',
    'Nil interface is different from interface holding nil pointer',
    'Type assertions check the stored type pointer',
  ],
}

export default exercise

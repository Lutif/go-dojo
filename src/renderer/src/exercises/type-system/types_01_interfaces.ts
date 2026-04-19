import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_01_interfaces',
  title: 'Interfaces',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 1,
  description: `Learn interfaces as contracts that define method sets. Interfaces are Go's way of specifying what methods a type must have.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Interface types define a set of methods that implementing types must have',
    'Any type implementing all methods automatically satisfies the interface',
    'Use small, focused interfaces; larger ones are harder to implement',
  ],
}

export default exercise

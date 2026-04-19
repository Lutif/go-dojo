import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_02_implicit_implementation',
  title: 'Implicit Implementation',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 2,
  description: `Understand implicit interface implementation without explicit declarations. Go uses structural typing, not nominal typing like Java.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'No "implements" keyword needed; any type with matching methods satisfies interface',
    'If a type has all interface methods, it implicitly satisfies that interface',
    'Enables decoupling: writers don't need to know about interface definitions',
  ],
}

export default exercise

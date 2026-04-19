import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_11_generic_functions',
  title: 'Generic Functions',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 11,
  description: `Write generic functions using type parameters (Go 1.18+). Generics eliminate repetitive code for container operations and algorithms.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'func name[T Type](arg T) { ... } defines a function with type parameter T',
    'Type constraints restrict what types can be used for T',
    'Call with explicit type: name[int](...) or infer: name(...)',
  ],
}

export default exercise

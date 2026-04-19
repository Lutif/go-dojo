import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_16_interface_embedding',
  title: 'Interface Embedding',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 16,
  description: `Embed interfaces to combine method sets. Interface embedding composes multiple interfaces into larger interfaces.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Embedding an interface includes all its methods in the larger interface',
    'Combined interface requires implementing all embedded interface methods',
    'Useful for building rich interfaces from smaller, single-method ones',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_11_generic_pool',
  title: 'Object Pool',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'advanced',
  order: 11,
  description: `Implement a generic resource pool with reuse and cleanup. Resource pools reduce allocation overhead by reusing expensive-to-create objects.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Maintain a pool of available resources; hand out on request, return when done',
    'Pre-allocate objects at startup to avoid allocation overhead',
    'Track availability with a channel; blocking when empty',
  ],
}

export default exercise

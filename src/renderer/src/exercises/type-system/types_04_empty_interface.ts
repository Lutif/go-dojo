import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_04_empty_interface',
  title: 'Empty Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 4,
  description: `Use empty interface to accept any type. The empty interface \`interface{}\` is implemented by every type, allowing generic containers.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Empty interface \`interface{}\` matches any type',
    'Commonly used in generic containers (maps, slices of any type)',
    'Requires type assertions to use values: \`value.(Type)\`',
  ],
}

export default exercise

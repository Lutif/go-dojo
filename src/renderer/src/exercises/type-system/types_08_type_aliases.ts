import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_08_type_aliases',
  title: 'Type Aliases',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 8,
  description: `Use type aliases for alternative names. Type aliases are another name for an existing type with no semantic distinction.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define with \`type Name = ExistingType\` (note the equals sign)',
    'Aliases are interchangeable with the original type',
    'Useful for improving readability without creating a distinct type',
  ],
}

export default exercise

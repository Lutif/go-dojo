import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_06_iota',
  title: 'Iota',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 6,
  description: `Understand Go's \`iota\` identifier for creating enumerations. \`iota\` starts at 0 and increments by 1 for each constant in a declaration block, enabling pattern-based constant generation.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    '\`iota\` is only available within const blocks',
    '\`iota\` resets to 0 in each new const block',
    'You can use expressions with iota, like \`iota * 2\` to create custom patterns',
  ],
}

export default exercise

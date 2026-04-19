import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_16_for_loop',
  title: 'For Loop',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 16,
  description: `Learn Go's primary looping construct, the for loop. Go only has one loop type (while, do-while, etc. don't exist), which can be used for traditional counting loops.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Traditional for loop: \`for i := 0; i < 10; i++ { }\`',
    'Components: initialization, condition, and post statement',
    'You can omit any component: \`for i < 10 { }\` or \`for { }\`',
  ],
}

export default exercise

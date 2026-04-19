import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_18_while_loop',
  title: 'While Loop',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 18,
  description: `Learn that Go implements while-loop behavior using the for loop with only a condition. This simulates while loops from other languages.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'While loop syntax in Go: \`for condition { }\`',
    'This is equivalent to: \`for ; condition; { }\`',
    'The loop continues until the condition becomes false',
  ],
}

export default exercise

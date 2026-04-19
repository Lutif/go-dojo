import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_14_switch',
  title: 'Switch',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 14,
  description: `Master switch statements for multi-way branching. Go's switch is cleaner than C-style switches: it doesn't require \`break\` statements and can have expressions in cases.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Cases in Go automatically break, so you don\'t need break statements',
    'Use \`fallthrough\` keyword if you need to execute the next case',
    'Switch can work without an expression: \`switch { case x > 0: case x < 0: }\`',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-05',
  title: 'Subcommands — Todo CLI Capstone',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'expert',
  order: 38,
  description: `Implement command chaining and piping. Chaining enables complex workflows.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Support running multiple commands in sequence',
    'Output of one command can input to another',
    'Maintain shared context across commands',
  ],
}

export default exercise

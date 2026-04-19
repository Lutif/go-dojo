import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-04',
  title: 'Subcommands — Per-Command Flags',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 37,
  description: `Add nested subcommands (subcommand of subcommand). Nesting enables command hierarchies.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Parse multiple levels of subcommands',
    'Route through each level',
    'Each level has its own handlers',
  ],
}

export default exercise

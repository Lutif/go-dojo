import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-sub-01',
  title: 'Subcommands — Command Registry',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 34,
  description: `Implement basic subcommand routing. Subcommands enable CLI applications with multiple operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Parse first argument as subcommand name',
    'Route to appropriate handler',
    'Show help if subcommand not recognized',
  ],
}

export default exercise

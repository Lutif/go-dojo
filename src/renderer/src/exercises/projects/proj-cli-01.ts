import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-01',
  title: 'CLI Parser — Parse -key=value Syntax',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 10,
  description: `Initialize CLI parser with basic flag support. The first step builds the foundation for parsing command-line arguments.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Create a flag package or custom parser',
    'Parse common flags like -h, -help, -v, -version',
    'Return structured flags for application logic',
  ],
}

export default exercise

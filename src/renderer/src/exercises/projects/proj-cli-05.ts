import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-05',
  title: 'CLI Parser — Parse() and Lookup',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 14,
  description: `Support environment variables and config files in the CLI. Configuration sources enable flexible application setup.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Check environment variables for defaults',
    'Load config file if present (toml, yaml, json)',
    'Priority: command-line > env vars > config file > defaults',
  ],
}

export default exercise

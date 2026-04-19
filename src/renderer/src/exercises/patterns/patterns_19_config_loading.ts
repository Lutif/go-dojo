import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_19_config_loading',
  title: 'Config Loading',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 19,
  description: `Load configuration from multiple sources. Configuration patterns support environment variables, files, and defaults.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define config struct with all settings',
    'Load from environment variables first, then files, then defaults',
    'Validate config before use',
  ],
}

export default exercise

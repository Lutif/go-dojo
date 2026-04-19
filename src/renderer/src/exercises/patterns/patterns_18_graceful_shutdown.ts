import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_18_graceful_shutdown',
  title: 'Graceful Shutdown',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 18,
  description: `Implement graceful shutdown to finish in-progress work. Graceful shutdown prevents losing data and corrupting state.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Listen for SIGINT/SIGTERM signals',
    'Stop accepting new work but finish existing work',
    'Use context cancellation to signal goroutines',
  ],
}

export default exercise

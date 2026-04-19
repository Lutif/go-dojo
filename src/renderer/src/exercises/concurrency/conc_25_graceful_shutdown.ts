import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_25_graceful_shutdown',
  title: 'Graceful Shutdown',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'expert',
  order: 25,
  description: `Implement graceful shutdown to stop work cleanly. Graceful shutdown allows in-progress work to complete while rejecting new requests.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Listen for OS signals (SIGINT, SIGTERM) with signal.Notify()',
    'Stop accepting new work and wait for in-progress work to complete',
    'Use context cancellation to signal goroutines to stop',
  ],
}

export default exercise

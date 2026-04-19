import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_20_fan_in',
  title: 'Fan In',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'advanced',
  order: 20,
  description: `Combine outputs from multiple goroutines with fan-in pattern. Fan-in merges multiple input channels into a single output channel.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Launch goroutines that read from different channels',
    'Each goroutine forwards values to a shared output channel',
    'Use WaitGroup to close the output channel when all inputs are exhausted',
  ],
}

export default exercise

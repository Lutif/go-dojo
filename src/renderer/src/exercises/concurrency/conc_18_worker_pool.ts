import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_18_worker_pool',
  title: 'Worker Pool',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'advanced',
  order: 18,
  description: `Implement a worker pool pattern to limit concurrent tasks. A worker pool manages a fixed number of goroutines that process jobs from a queue.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Create a fixed number of worker goroutines that listen on a job channel',
    'Send jobs to the job channel; workers process them concurrently',
    'Use WaitGroup or channels to wait for all jobs to complete',
  ],
}

export default exercise

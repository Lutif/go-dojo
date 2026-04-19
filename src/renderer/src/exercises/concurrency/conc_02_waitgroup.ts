import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_02_waitgroup',
  title: 'WaitGroup',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'beginner',
  order: 2,
  description: `Master WaitGroup to synchronize multiple goroutines. WaitGroup allows you to wait for all goroutines in a group to complete before continuing, ensuring proper synchronization.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'WaitGroup uses Add(), Done(), and Wait() to track goroutine completion',
    'Call Add() before launching goroutines, Done() when each completes',
    'Wait() blocks until the internal counter reaches zero',
  ],
}

export default exercise

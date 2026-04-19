import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-02',
  title: 'Task Queue — Buffered Channel Queue',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 23,
  description: `Add worker pool to process queue tasks. Worker pools limit concurrency.`,
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
    'Create fixed number of worker goroutines',
    'Workers read from task queue and process tasks',
    'Coordinate between workers and queue',
  ],
}

export default exercise

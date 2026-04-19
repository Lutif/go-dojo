import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_09_select_timeout',
  title: 'Select Timeout',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 9,
  description: `Implement timeouts using select with time.After(). Timeouts are essential for preventing goroutines from hanging indefinitely waiting for channel operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use \`time.After(duration)\` in a select case to implement timeouts',
    'time.After() returns a channel that sends after the duration elapses',
    'Combine with context to handle cancellation across multiple goroutines',
  ],
}

export default exercise

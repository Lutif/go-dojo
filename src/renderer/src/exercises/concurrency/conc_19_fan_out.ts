import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_19_fan_out',
  title: 'Fan Out',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'advanced',
  order: 19,
  description: `Distribute work across multiple goroutines with fan-out pattern. Fan-out multiplies a single input stream into parallel processing channels.`,
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
    'Read from an input channel and send to multiple worker channels',
    'Each worker processes independently in parallel',
    'Use WaitGroup to wait for all workers to finish',
  ],
}

export default exercise

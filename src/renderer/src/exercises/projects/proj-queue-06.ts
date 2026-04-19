import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-06',
  title: 'Task Queue — WorkerPool Capstone',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'expert',
  order: 27,
  description: `Add monitoring and metrics to the queue. Metrics enable understanding queue health.`,
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
    'Track queue size, processing time, success rate',
    'Expose metrics endpoint',
    'Alert on anomalies (queue growing, slow processing)',
  ],
}

export default exercise

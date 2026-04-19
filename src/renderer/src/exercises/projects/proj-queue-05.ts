import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-05',
  title: 'Task Queue — Retry Logic',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 26,
  description: `Implement retry logic with exponential backoff. Retries handle transient failures.`,
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
    'Track retry count per task',
    'Exponential backoff: delay = base * (2 ^ retries)',
    'Max retries limit to prevent infinite loops',
  ],
}

export default exercise

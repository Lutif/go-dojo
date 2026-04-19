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

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Track retry count per task',
    'Exponential backoff: delay = base * (2 ^ retries)',
    'Max retries limit to prevent infinite loops',
  ],
}

export default exercise

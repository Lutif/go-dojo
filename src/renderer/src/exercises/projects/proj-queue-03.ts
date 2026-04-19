import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-03',
  title: 'Task Queue — Worker & Worker Pool',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 24,
  description: `Implement priority queue for important tasks. Priority queues order by importance.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Tasks have priority levels',
    'Higher priority tasks are processed first',
    'Use heap or sorted list to maintain order',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-04',
  title: 'Task Queue — Context Timeout per Task',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 25,
  description: `Add persistence to queue (disk/database). Persistent queues survive restarts.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Store tasks in file or database',
    'Load tasks on startup',
    'Remove tasks after successful processing',
  ],
}

export default exercise

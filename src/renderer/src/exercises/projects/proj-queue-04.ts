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

func TestImplementation(t *testing.T) {
	// Verify the implementation matches the exercise requirements
	// Refer to the exercise description and hints for specific test cases
	t.Skip("Implement test based on exercise requirements")
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Store tasks in file or database',
    'Load tasks on startup',
    'Remove tasks after successful processing',
  ],
}

export default exercise

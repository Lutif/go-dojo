import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-queue-01',
  title: 'Task Queue — Task & Result Types',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 22,
  description: `Build a basic task queue with enqueue/dequeue operations. Task queues manage asynchronous work.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use a channel or slice to store tasks',
    'Implement Enqueue to add tasks',
    'Implement Dequeue to remove tasks (FIFO)',
  ],
}

export default exercise

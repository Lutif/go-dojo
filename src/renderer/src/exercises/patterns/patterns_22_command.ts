import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_22_command',
  title: 'Command Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 22,
  description: `Implement command pattern to encapsulate actions. Commands encapsulate requests as objects for undo/redo and queueing.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Command interface with Execute() method',
    'Concrete commands implement Execute() for specific actions',
    'Enable undo by storing undo information in command',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_23_state_machine',
  title: 'State Machine',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 23,
  description: `Build state machines for complex workflows. State machines manage transitions between states based on events.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Define states and events',
    'Current state determines valid next states',
    'Handle transitions and side effects',
  ],
}

export default exercise

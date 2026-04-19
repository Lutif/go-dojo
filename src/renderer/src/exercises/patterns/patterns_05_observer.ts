import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_05_observer',
  title: 'Observer Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 5,
  description: `Build observer pattern for event notification. Observers listen for events and react when they occur.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Maintain list of observers; notify all when event occurs',
    'Observers implement callback interface (OnEvent, OnChange, etc.)',
    'Use for decoupling components that need to react to changes',
  ],
}

export default exercise

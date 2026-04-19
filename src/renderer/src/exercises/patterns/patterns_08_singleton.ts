import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_08_singleton',
  title: 'Singleton with sync.Once',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 8,
  description: `Implement singleton pattern for shared instance. Singletons ensure only one instance exists globally.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use sync.Once in init function to create single instance',
    'Export accessor function that returns singleton',
    'Goroutine-safe initialization with sync.Once',
  ],
}

export default exercise

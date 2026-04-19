import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_01_goroutines',
  title: 'Goroutines Basic',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'beginner',
  order: 1,
  description: `Learn how to launch concurrent tasks using goroutines. Goroutines are lightweight threads managed by the Go runtime that allow you to run functions concurrently with minimal overhead.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use the \`go\` keyword followed by a function call to launch a goroutine',
    'Goroutines run concurrently but you need synchronization to wait for them',
    'Without proper synchronization, main() may exit before goroutines finish',
  ],
}

export default exercise

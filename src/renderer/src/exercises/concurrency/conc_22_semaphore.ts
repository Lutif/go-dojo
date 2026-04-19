import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_22_semaphore',
  title: 'Semaphore',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'advanced',
  order: 22,
  description: `Implement semaphores to limit concurrent access to resources. A semaphore is a counter that controls access; only N goroutines can access a resource simultaneously.`,
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
    'A buffered channel acts as a simple semaphore: capacity = N concurrent accessors',
    'Before accessing: `<-sem` (acquire), after: `sem <- struct{}{}` (release)',
    'Or use weighted semaphores from golang.org/x/sync/semaphore for finer control',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_11_rwmutex',
  title: 'RWMutex',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 11,
  description: `Learn RWMutex for multiple readers and exclusive writers. RWMutex allows concurrent reads while ensuring exclusive write access for better performance in read-heavy scenarios.`,
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
    'RLock() for read-only access allows multiple concurrent readers',
    'Lock() for exclusive write access blocks all other operations',
    'RUnlock() releases read locks, Unlock() releases write locks',
  ],
}

export default exercise

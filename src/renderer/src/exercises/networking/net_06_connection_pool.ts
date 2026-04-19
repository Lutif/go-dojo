import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_06_connection_pool',
  title: 'Connection Pool',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'advanced',
  order: 6,
  description: `Implement connection pooling for efficient resource usage. Connection pools reuse connections reducing overhead.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'http.Client automatically reuses connections when Keep-Alive is enabled',
    'Limit concurrent connections with a semaphore channel',
    'Pre-create connections at startup for predictable behavior',
  ],
}

export default exercise

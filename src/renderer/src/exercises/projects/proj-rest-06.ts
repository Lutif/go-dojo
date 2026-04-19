import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-06',
  title: 'REST API — Server & Graceful Shutdown (Capstone)',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'expert',
  order: 33,
  description: `Add caching and rate limiting. These features improve performance and protect against abuse.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Cache GET responses with appropriate TTL',
    'Rate limit by IP or user',
    'Return 429 Too Many Requests when limited',
  ],
}

export default exercise

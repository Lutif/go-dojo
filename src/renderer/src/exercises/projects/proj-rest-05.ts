import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-05',
  title: 'REST API — Auth Middleware',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 32,
  description: `Implement content negotiation (JSON, XML). Content negotiation enables multiple formats.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Check Accept header for desired format',
    'Return appropriate Content-Type',
    'Support both JSON and XML responses',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-17',
  title: 'Evaluator — Arithmetic Operations',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'advanced',
  order: 117,
  description: `Add for-in loops for iteration. Loops iterate over sequences.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Parse for-in syntax: for identifier in iterable { body }',
    'Iterate over arrays, strings, and hashes',
    'Create new scope for loop variable',
  ],
}

export default exercise

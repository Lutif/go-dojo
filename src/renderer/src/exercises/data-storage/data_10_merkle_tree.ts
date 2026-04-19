import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_10_merkle_tree',
  title: 'Merkle Tree',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 10,
  description: `Build a Merkle tree for efficient data verification. Merkle trees enable quick verification of large datasets and detect tampering.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Hash pairs of data upward to form a tree structure',
    'Root hash represents the entire dataset; changes propagate upward',
    'Logarithmic verification: only need path from leaf to root',
  ],
}

export default exercise

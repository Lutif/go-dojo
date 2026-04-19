import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_05_bloom_filter',
  title: 'Bloom Filter',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'advanced',
  order: 5,
  description: `Build a Bloom filter for efficient membership testing. Bloom filters use multiple hash functions to test set membership with minimal memory.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use a bit array and multiple independent hash functions',
    'Add: hash element with each function, set corresponding bits',
    'Contains: hash element, check if all corresponding bits are set (may have false positives)',
  ],
}

export default exercise

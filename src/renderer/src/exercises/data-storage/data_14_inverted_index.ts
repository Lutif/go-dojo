import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_14_inverted_index',
  title: 'Inverted Index',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'advanced',
  order: 14,
  description: `Build an inverted index that maps search terms to document IDs where they appear. This data structure is fundamental to search engines and text analysis systems.`,
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
    'An inverted index uses a map where keys are terms and values are slices of document IDs',
    'Iterate through documents and build the index by adding each document ID to the appropriate term lists',
    'Consider how to handle case sensitivity and what constitutes a valid search term',
  ],
}

export default exercise

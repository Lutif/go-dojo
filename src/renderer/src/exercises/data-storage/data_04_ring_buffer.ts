import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_04_ring_buffer',
  title: 'Ring Buffer',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'intermediate',
  order: 4,
  description: `Create a fixed-size circular buffer for efficient streaming data. Ring buffers are used in high-performance systems for buffering streams.`,
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
    'Use a pre-allocated slice with head and tail pointers',
    'Wrap around: next position = (current + 1) % size',
    'Track if buffer is empty or full to handle edge cases',
  ],
}

export default exercise

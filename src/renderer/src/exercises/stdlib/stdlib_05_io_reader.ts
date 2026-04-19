import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_05_io_reader',
  title: 'io.Reader Interface',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 5,
  description: `Understand the io.Reader interface for reading data. Reader is a fundamental interface for data sources.`,
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
    'Reader.Read(p []byte) reads bytes into buffer, returns count',
    'Readers can be chained: file -> gzip -> json',
    'io.Copy() copies from Reader to Writer',
  ],
}

export default exercise

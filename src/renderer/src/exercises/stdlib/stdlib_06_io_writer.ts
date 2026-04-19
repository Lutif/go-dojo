import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_06_io_writer',
  title: 'io.Writer Interface',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 6,
  description: `Use io.Writer interface for writing data. Writer is the output counterpart to Reader.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Writer.Write(p []byte) writes bytes, returns count written',
    'Writers can be chained: json -> gzip -> file',
    'io.MultiWriter() writes to multiple writers at once',
  ],
}

export default exercise

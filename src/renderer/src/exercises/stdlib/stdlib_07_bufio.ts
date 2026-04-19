import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_07_bufio',
  title: 'bufio Scanner',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 7,
  description: `Use bufio for buffered I/O operations. Bufio reduces system calls by buffering data.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'bufio.Scanner reads line-by-line until EOF',
    'bufio.Writer buffers writes for efficiency',
    'bufio.NewReader wraps Reader with buffering',
  ],
}

export default exercise

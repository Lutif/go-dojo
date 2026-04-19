import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_07_select_basic',
  title: 'Select Basic',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 7,
  description: `Master select statements for multiplexing channel operations. Select allows you to wait on multiple channel operations and choose which one executes first.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Select waits on multiple channel operations and executes the first ready one',
    'Use \`case\` for each channel operation to handle',
    'If multiple cases are ready, one is chosen at random',
  ],
}

export default exercise

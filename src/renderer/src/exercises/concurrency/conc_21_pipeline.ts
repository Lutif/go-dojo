import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_21_pipeline',
  title: 'Pipeline',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'advanced',
  order: 21,
  description: `Build data processing pipelines where each stage is a goroutine. Pipelines chain operations where each stage processes output from the previous stage.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Each pipeline stage is a goroutine that reads from one channel, processes, writes to another',
    'Stages can be easily composed and reused',
    'Use WaitGroup or channels to synchronize pipeline completion',
  ],
}

export default exercise

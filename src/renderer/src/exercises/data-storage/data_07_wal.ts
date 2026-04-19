import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_07_wal',
  title: 'Write-Ahead Log',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 7,
  description: `Build a Write-Ahead Log (WAL) for durability. WAL ensures data persists by writing to disk before applying changes in memory.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Write entries to a log file before applying them to the store',
    'On crash recovery, replay the log to restore consistent state',
    'Periodically checkpoint and truncate the log to limit growth',
  ],
}

export default exercise

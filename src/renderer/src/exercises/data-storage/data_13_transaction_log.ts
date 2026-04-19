import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_13_transaction_log',
  title: 'Transaction Log',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 13,
  description: `Create a transaction log for ACID compliance. Transaction logs ensure atomicity by recording all operations before execution.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Log all operations before applying them to main storage',
    'Abort: clear pending operations without applying them',
    'Commit: apply all logged operations atomically',
  ],
}

export default exercise

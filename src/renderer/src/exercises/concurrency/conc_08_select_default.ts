import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_08_select_default',
  title: 'Select Default',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'intermediate',
  order: 8,
  description: `Learn default cases in select for non-blocking operations. The default case executes immediately if no other channel is ready, enabling non-blocking sends/receives.`,
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
    'Default case runs if no other case is ready',
    'Useful for non-blocking sends: `select { case ch <- v: ... default: ... }`',
    'Non-blocking receives: `select { case v := <-ch: ... default: ... }`',
  ],
}

export default exercise

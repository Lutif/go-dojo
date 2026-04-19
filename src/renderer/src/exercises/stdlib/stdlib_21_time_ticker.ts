import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_21_time_ticker',
  title: 'time.Ticker',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 21,
  description: `Use tickers for periodic operations. Tickers enable executing code at regular intervals.`,
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
    'time.NewTicker(duration) creates ticker',
    'Ticker.C channel sends at intervals',
    'Defer ticker.Stop() to stop the ticker',
  ],
}

export default exercise

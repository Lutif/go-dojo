import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_14_switch',
  title: 'Switch',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 14,
  description: `Master switch statements for multi-way branching. Go's switch is cleaner than C-style switches: it doesn't require \`break\` statements and can have expressions in cases.`,
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
    'Go switch statements automatically break between cases',
    'Each case value is compared for equality with the switch expression',
    'Use fallthrough keyword only if you explicitly want to continue to the next case',
  ],
}

export default exercise

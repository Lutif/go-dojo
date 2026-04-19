import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_21_health_check',
  title: 'Health Check',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 21,
  description: `Add health checks for readiness and liveness. Health checks enable orchestration systems to manage service availability.`,
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
    'Liveness: is service running and responsive?',
    'Readiness: is service ready to accept requests?',
    'Return detailed status; include dependency health',
  ],
}

export default exercise

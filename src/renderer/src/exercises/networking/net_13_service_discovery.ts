import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_13_service_discovery',
  title: 'Service Registry',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'expert',
  order: 13,
  description: `Implement service discovery for dynamic service location. Service discovery enables finding available services at runtime.`,
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
    'Maintain a registry of service locations (in memory or external)',
    'Services register on startup, deregister on shutdown',
    'Clients query registry to find service endpoints',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_08_load_balancer',
  title: 'Load Balancer',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'advanced',
  order: 8,
  description: `Implement a load balancer to distribute traffic. Load balancers direct requests to multiple backend servers.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Maintain a list of backend servers and rotate through them',
    'Track health of backends to skip unhealthy ones',
    'Use consistent hashing for predictable request routing',
  ],
}

export default exercise

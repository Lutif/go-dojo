import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_14_health_check',
  title: 'Health Check Endpoint',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'intermediate',
  order: 14,
  description: `Add health checks for service monitoring. Health checks detect failed services and enable graceful failover.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement health endpoint that returns status',
    'Regularly check health; remove unhealthy services from rotation',
    'Return 200 OK when healthy, 503 Service Unavailable when unhealthy',
  ],
}

export default exercise

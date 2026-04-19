import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_15_pubsub',
  title: 'Pub/Sub System',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'advanced',
  order: 15,
  description: `Build publish-subscribe system for event distribution. PubSub enables loose coupling through event channels.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Subscribers register interest in topics',
    'Publishers send events to topic; all subscribers notified',
    'Use channels for fan-out to multiple subscribers',
  ],
}

export default exercise

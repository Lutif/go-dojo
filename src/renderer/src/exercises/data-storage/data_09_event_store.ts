import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'acct1',
  title: 'Event Store',
  category: 'Data & Storage',
  subcategory: 'Data & Storage',
  difficulty: 'expert',
  order: 9,
  description: `Create an event store for event sourcing. Event stores append immutable events that reconstruct application state when replayed.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Append-only log: store all events in order as they occur',
    'Reconstruct state by replaying events from the beginning',
    'Snapshots reduce replay time for large event streams',
  ],
}

export default exercise

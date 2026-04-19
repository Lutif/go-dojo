import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_09_websocket',
  title: 'WebSocket Upgrade',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'advanced',
  order: 9,
  description: `Build websocket connections for bidirectional communication. Websockets enable persistent connections with two-way messaging.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'github.com/gorilla/websocket provides websocket support',
    'Upgrade HTTP connection to websocket with upgrader.Upgrade()',
    'Read/write messages with ReadMessage() and WriteMessage()',
  ],
}

export default exercise

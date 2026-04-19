import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_01_tcp_server',
  title: 'TCP Echo Server',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'intermediate',
  order: 1,
  description: `Build a basic TCP echo server. TCP servers listen for connections and handle client requests.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'net.Listen("tcp", ":port") creates a listener on the port',
    'listener.Accept() blocks until a client connects, returning a connection',
    'Handle each connection in a goroutine to serve multiple clients concurrently',
  ],
}

export default exercise

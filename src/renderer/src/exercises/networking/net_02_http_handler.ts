import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'net_02_http_handler',
  title: 'HTTP Handler',
  category: 'Networking',
  subcategory: 'Networking',
  difficulty: 'beginner',
  order: 2,
  description: `Create HTTP handlers to respond to requests. HTTP handlers are functions that process incoming HTTP requests.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'http.HandleFunc(path, handler) registers a handler for a path',
    'Handler function receives ResponseWriter and *Request',
    'Use writer.Write() or fmt.Fprintf() to send response body',
  ],
}

export default exercise

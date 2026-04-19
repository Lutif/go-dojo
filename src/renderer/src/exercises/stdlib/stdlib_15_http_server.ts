import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_15_http_server',
  title: 'HTTP Server Handler',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 15,
  description: `Create HTTP servers with http package. HTTP servers respond to web requests.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'http.HandleFunc(path, handler) registers endpoint',
    'Handler receives ResponseWriter and *Request',
    'http.ListenAndServe() starts server on port',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-rest-01',
  title: 'REST API — Thread-Safe Store',
  category: 'Projects',
  subcategory: 'Projects',
  difficulty: 'intermediate',
  order: 28,
  description: `Create REST API with basic CRUD endpoints. REST APIs follow standard patterns for resource operations.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'POST to create new resource',
    'GET to retrieve resource',
    'PUT to update resource',
    'DELETE to remove resource',
  ],
}

export default exercise

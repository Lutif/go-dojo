import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_21_string_builder',
  title: 'String Builder',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 21,
  description: `Master efficient string building with \`strings.Builder\`. Building strings with \`+\` in loops is inefficient; StringBuilder accumulates strings and builds them all at once.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestQueryBuilder(t *testing.T) {
	q := NewQueryBuilder("users").
		Where("age > 18").
		SetOrderBy("name").
		SetLimit(10).
		Build()
	
	if q.Table != "users" || q.Clause != "age > 18" {
		t.Error("builder failed")
	}
	if q.Limit != 10 {
		t.Errorf("Limit = %d, want 10", q.Limit)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'strings.Builder accumulates strings in a buffer before converting to a final string',
    'Use the Write or WriteString methods to add to the builder',
    'Call String() at the end to get the final result',
  ],
}

export default exercise

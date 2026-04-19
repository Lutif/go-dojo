import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_02_builder',
  title: 'Builder Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 2,
  description: `Implement builder pattern for complex object construction. Builders create complex objects step-by-step.`,
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
    'Create builder struct with fields for each configuration option',
    'Add methods to set each field, returning the builder for chaining',
    'Build() method constructs the final object',
  ],
}

export default exercise

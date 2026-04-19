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

func TestQueryBuilderFull(t *testing.T) {
	q := NewQueryBuilder("users").
		Where("age > 18").
		SetOrderBy("name").
		SetLimit(10).
		Build()

	if q.Table != "users" {
		t.Errorf("Table = %q, want %q", q.Table, "users")
	}
	if q.Clause != "age > 18" {
		t.Errorf("Clause = %q, want %q", q.Clause, "age > 18")
	}
	if q.OrderBy != "name" {
		t.Errorf("OrderBy = %q, want %q", q.OrderBy, "name")
	}
	if q.Limit != 10 {
		t.Errorf("Limit = %d, want 10", q.Limit)
	}
}

func TestQueryBuilderDefaults(t *testing.T) {
	q := NewQueryBuilder("products").Build()
	if q.Table != "products" {
		t.Errorf("Table = %q, want %q", q.Table, "products")
	}
	if q.Clause != "" {
		t.Errorf("Clause = %q, want empty", q.Clause)
	}
	if q.Limit != 0 {
		t.Errorf("Limit = %d, want 0", q.Limit)
	}
}

func TestQueryBuilderChaining(t *testing.T) {
	q := NewQueryBuilder("orders").Where("status = active").SetLimit(5).Build()
	if q.Clause != "status = active" {
		t.Errorf("Clause = %q, want %q", q.Clause, "status = active")
	}
	if q.Limit != 5 {
		t.Errorf("Limit = %d, want 5", q.Limit)
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

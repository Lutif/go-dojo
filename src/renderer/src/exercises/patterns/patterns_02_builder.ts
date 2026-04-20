import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_02_builder',
  title: 'Builder Pattern',
  category: 'Patterns',
  subcategory: 'Creational',
  difficulty: 'intermediate',
  order: 2,
  description: `The builder pattern constructs complex objects step by step. In Go, builders typically use method chaining (each method returns the builder) and a final \`Build()\` method:

\`\`\`go
query := NewQueryBuilder("users").
    Where("age > 18").
    SetOrderBy("name").
    SetLimit(10).
    Build()
\`\`\`

Your task: implement a SQL query builder with:

1. A \`Query\` struct with fields: \`Table\` (string), \`Clause\` (string), \`OrderBy\` (string), \`Limit\` (int)
2. A \`QueryBuilder\` struct that accumulates the query parts
3. \`NewQueryBuilder(table string) *QueryBuilder\`
4. \`Where(clause string) *QueryBuilder\` - sets the WHERE clause
5. \`SetOrderBy(field string) *QueryBuilder\` - sets ORDER BY
6. \`SetLimit(n int) *QueryBuilder\` - sets LIMIT
7. \`Build() Query\` - returns the final Query`,
  code: `package main

// TODO: Define the Query struct with exported fields:
// Table, Clause, OrderBy (all string), Limit (int)

// TODO: Define the QueryBuilder struct

// TODO: Implement NewQueryBuilder(table string) *QueryBuilder

// TODO: Implement Where(clause string) *QueryBuilder

// TODO: Implement SetOrderBy(field string) *QueryBuilder

// TODO: Implement SetLimit(n int) *QueryBuilder

// TODO: Implement Build() Query

func main() {}`,
  testCode: `package main

import "testing"

func TestQueryBuilder(t *testing.T) {
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
	if q.OrderBy != "" {
		t.Errorf("OrderBy = %q, want empty", q.OrderBy)
	}
	if q.Limit != 0 {
		t.Errorf("Limit = %d, want 0", q.Limit)
	}
}

func TestQueryBuilderPartial(t *testing.T) {
	q := NewQueryBuilder("orders").
		Where("status = 'pending'").
		SetLimit(5).
		Build()
	if q.Table != "orders" {
		t.Errorf("Table = %q, want %q", q.Table, "orders")
	}
	if q.Clause != "status = 'pending'" {
		t.Errorf("Clause = %q, want %q", q.Clause, "status = 'pending'")
	}
	if q.Limit != 5 {
		t.Errorf("Limit = %d, want 5", q.Limit)
	}
	if q.OrderBy != "" {
		t.Errorf("OrderBy = %q, want empty", q.OrderBy)
	}
}`,
  solution: `package main

type Query struct {
	Table   string
	Clause  string
	OrderBy string
	Limit   int
}

type QueryBuilder struct {
	table   string
	clause  string
	orderBy string
	limit   int
}

func NewQueryBuilder(table string) *QueryBuilder {
	return &QueryBuilder{table: table}
}

func (qb *QueryBuilder) Where(clause string) *QueryBuilder {
	qb.clause = clause
	return qb
}

func (qb *QueryBuilder) SetOrderBy(field string) *QueryBuilder {
	qb.orderBy = field
	return qb
}

func (qb *QueryBuilder) SetLimit(n int) *QueryBuilder {
	qb.limit = n
	return qb
}

func (qb *QueryBuilder) Build() Query {
	return Query{
		Table:   qb.table,
		Clause:  qb.clause,
		OrderBy: qb.orderBy,
		Limit:   qb.limit,
	}
}

func main() {}`,
  hints: [
    'Each builder method stores the value and returns the builder pointer for chaining.',
    'Build() copies accumulated values into a Query struct.',
    'The builder holds private fields; the Query has exported fields.',
  ],
}

export default exercise

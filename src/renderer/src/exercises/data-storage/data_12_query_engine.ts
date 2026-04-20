import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_12_query_engine',
  title: 'Simple Query Engine',
  category: 'Data & Storage',
  subcategory: 'Query Processing',
  difficulty: 'expert',
  order: 12,
  description: `Build a simple query engine that supports Where, OrderBy, and Limit operations on a slice of records. This mimics how databases execute queries through a pipeline of operations.

Each record is a map of string fields:

\`\`\`
type Record map[string]string
\`\`\`

The query engine uses a builder pattern with method chaining:

\`\`\`
results := NewQuery(records).
    Where("age", ">", "25").
    OrderBy("name", true).  // ascending
    Limit(10).
    Execute()
\`\`\`

Where supports these operators: "=", "!=", ">", "<", ">=", "<=". For >, <, >=, <=, compare values as integers (use strconv.Atoi; treat parse errors as 0).

Implement:
- \`NewQuery(records []Record)\` - creates a query on the given records
- \`Where(field, op, value string) *Query\` - adds a filter condition
- \`OrderBy(field string, ascending bool) *Query\` - sets sort order
- \`Limit(n int) *Query\` - limits the number of results
- \`Execute() []Record\` - runs the query pipeline and returns results`,
  code: `package main

import (
	"sort"
	"strconv"
)

// Record is a map of field names to string values.
type Record map[string]string

type filter struct {
	field string
	op    string
	value string
}

type ordering struct {
	field     string
	ascending bool
}

// Query represents a composable query on records.
type Query struct {
	// TODO: Add records, filters, ordering, and limit
}

// NewQuery creates a new query on the given records.
func NewQuery(records []Record) *Query {
	// TODO
	return nil
}

// Where adds a filter condition. Supported ops: "=", "!=", ">", "<", ">=", "<=".
func (q *Query) Where(field, op, value string) *Query {
	// TODO: Add filter and return q for chaining
	return q
}

// OrderBy sets the sort field and direction.
func (q *Query) OrderBy(field string, ascending bool) *Query {
	// TODO
	return q
}

// Limit sets the maximum number of results.
func (q *Query) Limit(n int) *Query {
	// TODO
	return q
}

// Execute runs the query: filter, sort, then limit.
func (q *Query) Execute() []Record {
	// TODO:
	// 1. Apply all Where filters
	// 2. Apply OrderBy if set
	// 3. Apply Limit if set
	return nil
}

var _ = sort.SliceStable
var _ = strconv.Atoi

func main() {}`,
  testCode: `package main

import "testing"

func sampleRecords() []Record {
	return []Record{
		{"name": "Alice", "age": "30", "city": "NYC"},
		{"name": "Bob", "age": "25", "city": "LA"},
		{"name": "Charlie", "age": "35", "city": "NYC"},
		{"name": "Diana", "age": "28", "city": "Chicago"},
		{"name": "Eve", "age": "22", "city": "LA"},
	}
}

func TestQueryWhereEquals(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("city", "=", "NYC").
		Execute()

	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %d", len(results))
	}
	for _, r := range results {
		if r["city"] != "NYC" {
			t.Errorf("expected city=NYC, got %q", r["city"])
		}
	}
}

func TestQueryWhereNotEquals(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("city", "!=", "LA").
		Execute()

	if len(results) != 3 {
		t.Fatalf("expected 3 results, got %d", len(results))
	}
}

func TestQueryWhereGreaterThan(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("age", ">", "28").
		Execute()

	if len(results) != 2 {
		t.Fatalf("expected 2 results (age>28), got %d", len(results))
	}
}

func TestQueryWhereLessThan(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("age", "<", "28").
		Execute()

	if len(results) != 2 {
		t.Fatalf("expected 2 results (age<28), got %d", len(results))
	}
}

func TestQueryWhereGTE(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("age", ">=", "28").
		Execute()

	if len(results) != 3 {
		t.Fatalf("expected 3 results (age>=28), got %d", len(results))
	}
}

func TestQueryWhereLTE(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("age", "<=", "25").
		Execute()

	if len(results) != 2 {
		t.Fatalf("expected 2 results (age<=25), got %d", len(results))
	}
}

func TestQueryOrderByAscending(t *testing.T) {
	results := NewQuery(sampleRecords()).
		OrderBy("name", true).
		Execute()

	if len(results) != 5 {
		t.Fatalf("expected 5 results, got %d", len(results))
	}
	if results[0]["name"] != "Alice" || results[4]["name"] != "Eve" {
		t.Errorf("order wrong: first=%q last=%q", results[0]["name"], results[4]["name"])
	}
}

func TestQueryOrderByDescending(t *testing.T) {
	results := NewQuery(sampleRecords()).
		OrderBy("name", false).
		Execute()

	if results[0]["name"] != "Eve" || results[4]["name"] != "Alice" {
		t.Errorf("order wrong: first=%q last=%q", results[0]["name"], results[4]["name"])
	}
}

func TestQueryLimit(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Limit(3).
		Execute()

	if len(results) != 3 {
		t.Fatalf("expected 3 results with Limit(3), got %d", len(results))
	}
}

func TestQueryCombined(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("age", ">", "24").
		OrderBy("age", true).
		Limit(2).
		Execute()

	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %d", len(results))
	}
	if results[0]["name"] != "Bob" {
		t.Errorf("first result should be Bob (age 25), got %q", results[0]["name"])
	}
	if results[1]["name"] != "Diana" {
		t.Errorf("second result should be Diana (age 28), got %q", results[1]["name"])
	}
}

func TestQueryMultipleWheres(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("age", ">", "24").
		Where("city", "=", "NYC").
		Execute()

	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %d", len(results))
	}
}

func TestQueryNoResults(t *testing.T) {
	results := NewQuery(sampleRecords()).
		Where("city", "=", "Tokyo").
		Execute()

	if len(results) != 0 {
		t.Errorf("expected 0 results, got %d", len(results))
	}
}

func TestQueryEmptyInput(t *testing.T) {
	results := NewQuery([]Record{}).Execute()
	if len(results) != 0 {
		t.Errorf("expected 0 results on empty input, got %d", len(results))
	}
}`,
  solution: `package main

import (
	"sort"
	"strconv"
)

type Record map[string]string

type filter struct {
	field string
	op    string
	value string
}

type ordering struct {
	field     string
	ascending bool
}

type Query struct {
	records  []Record
	filters  []filter
	order    *ordering
	limitN   int
	hasLimit bool
}

func NewQuery(records []Record) *Query {
	cp := make([]Record, len(records))
	copy(cp, records)
	return &Query{records: cp}
}

func (q *Query) Where(field, op, value string) *Query {
	q.filters = append(q.filters, filter{field: field, op: op, value: value})
	return q
}

func (q *Query) OrderBy(field string, ascending bool) *Query {
	q.order = &ordering{field: field, ascending: ascending}
	return q
}

func (q *Query) Limit(n int) *Query {
	q.limitN = n
	q.hasLimit = true
	return q
}

func (q *Query) Execute() []Record {
	var results []Record
	for _, r := range q.records {
		if q.matchesAll(r) {
			results = append(results, r)
		}
	}

	if q.order != nil {
		field := q.order.field
		asc := q.order.ascending
		sort.SliceStable(results, func(i, j int) bool {
			a := results[i][field]
			b := results[j][field]
			if asc {
				return a < b
			}
			return a > b
		})
	}

	if q.hasLimit && q.limitN < len(results) {
		results = results[:q.limitN]
	}

	return results
}

func (q *Query) matchesAll(r Record) bool {
	for _, f := range q.filters {
		if !matchFilter(r, f) {
			return false
		}
	}
	return true
}

func matchFilter(r Record, f filter) bool {
	val := r[f.field]
	switch f.op {
	case "=":
		return val == f.value
	case "!=":
		return val != f.value
	case ">":
		return toInt(val) > toInt(f.value)
	case "<":
		return toInt(val) < toInt(f.value)
	case ">=":
		return toInt(val) >= toInt(f.value)
	case "<=":
		return toInt(val) <= toInt(f.value)
	}
	return false
}

func toInt(s string) int {
	n, _ := strconv.Atoi(s)
	return n
}

func main() {}`,
  hints: [
    'Use a builder pattern: each method stores config and returns the Query pointer for chaining.',
    'Execute applies steps in order: filter (Where), sort (OrderBy), then truncate (Limit).',
    'For numeric comparisons (>, <, >=, <=), parse both values with strconv.Atoi. Use 0 as the default for parse errors.',
  ],
}

export default exercise

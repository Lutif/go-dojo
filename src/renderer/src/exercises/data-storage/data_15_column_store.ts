import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_15_column_store',
  title: 'Column Store',
  category: 'Data & Storage',
  subcategory: 'Columnar Storage',
  difficulty: 'expert',
  order: 15,
  description: `Implement column-oriented storage for analytical queries. Unlike row-based stores, column stores keep each column in a separate slice, enabling efficient aggregation and filtering on specific columns.

\`\`\`
Row store:      Column store:
[name, age]     names: [Alice, Bob, Charlie]
[Alice, 30]     ages:  [30, 25, 35]
[Bob, 25]
[Charlie, 35]
\`\`\`

Each column is stored as a slice of strings. Rows are identified by their index across all columns.

Implement:
- \`NewColumnStore(columns []string)\` - creates a store with named columns
- \`AddRow(values map[string]string) error\` - adds a row (must provide all columns)
- \`GetColumn(name string) ([]string, error)\` - returns all values in a column
- \`GetRow(index int) (map[string]string, error)\` - returns a row as a map
- \`FilterRows(column, op, value string) []int\` - returns row indices matching the condition
  - ops: "=", "!=", ">", "<" (numeric comparison for > and <)
- \`Count() int\` - returns the number of rows
- \`Sum(column string) (int, error)\` - sums numeric values in a column`,
  code: `package main

import (
	"errors"
	"strconv"
)

// ColumnStore stores data in column-oriented format.
type ColumnStore struct {
	// TODO: Add column names, column data, and row count
}

// NewColumnStore creates a store with the given column names.
func NewColumnStore(columns []string) *ColumnStore {
	// TODO
	return nil
}

// AddRow adds a row. The values map must contain all columns.
func (cs *ColumnStore) AddRow(values map[string]string) error {
	// TODO: Validate all columns present, append to each column
	return nil
}

// GetColumn returns all values for the given column.
func (cs *ColumnStore) GetColumn(name string) ([]string, error) {
	// TODO
	return nil, nil
}

// GetRow returns the row at the given index as a map.
func (cs *ColumnStore) GetRow(index int) (map[string]string, error) {
	// TODO
	return nil, nil
}

// FilterRows returns indices of rows matching the condition.
// Supported ops: "=", "!=", ">", "<" (> and < use numeric comparison).
func (cs *ColumnStore) FilterRows(column, op, value string) []int {
	// TODO
	return nil
}

// Count returns the number of rows.
func (cs *ColumnStore) Count() int {
	// TODO
	return 0
}

// Sum returns the sum of numeric values in the given column.
// Non-numeric values are treated as 0.
func (cs *ColumnStore) Sum(column string) (int, error) {
	// TODO
	return 0, nil
}

var _ = errors.New
var _ = strconv.Atoi

func main() {}`,
  testCode: `package main

import "testing"

func newTestStore() *ColumnStore {
	cs := NewColumnStore([]string{"name", "age", "city"})
	cs.AddRow(map[string]string{"name": "Alice", "age": "30", "city": "NYC"})
	cs.AddRow(map[string]string{"name": "Bob", "age": "25", "city": "LA"})
	cs.AddRow(map[string]string{"name": "Charlie", "age": "35", "city": "NYC"})
	cs.AddRow(map[string]string{"name": "Diana", "age": "28", "city": "Chicago"})
	return cs
}

func TestColumnStoreAddRow(t *testing.T) {
	cs := newTestStore()
	if cs.Count() != 4 {
		t.Errorf("Count() = %d, want 4", cs.Count())
	}
}

func TestColumnStoreAddRowMissingColumn(t *testing.T) {
	cs := NewColumnStore([]string{"name", "age"})
	err := cs.AddRow(map[string]string{"name": "Alice"})
	if err == nil {
		t.Error("AddRow with missing column should return error")
	}
}

func TestColumnStoreGetColumn(t *testing.T) {
	cs := newTestStore()
	names, err := cs.GetColumn("name")
	if err != nil {
		t.Fatalf("GetColumn(name) error: %v", err)
	}
	if len(names) != 4 || names[0] != "Alice" || names[2] != "Charlie" {
		t.Errorf("GetColumn(name) = %v, unexpected", names)
	}
}

func TestColumnStoreGetColumnNotFound(t *testing.T) {
	cs := newTestStore()
	_, err := cs.GetColumn("email")
	if err == nil {
		t.Error("GetColumn(email) should return error")
	}
}

func TestColumnStoreGetRow(t *testing.T) {
	cs := newTestStore()
	row, err := cs.GetRow(1)
	if err != nil {
		t.Fatalf("GetRow(1) error: %v", err)
	}
	if row["name"] != "Bob" || row["age"] != "25" || row["city"] != "LA" {
		t.Errorf("GetRow(1) = %v, unexpected", row)
	}
}

func TestColumnStoreGetRowOutOfRange(t *testing.T) {
	cs := newTestStore()
	_, err := cs.GetRow(10)
	if err == nil {
		t.Error("GetRow(10) should return error")
	}
}

func TestColumnStoreFilterEquals(t *testing.T) {
	cs := newTestStore()
	rows := cs.FilterRows("city", "=", "NYC")
	if len(rows) != 2 || rows[0] != 0 || rows[1] != 2 {
		t.Errorf("FilterRows(city = NYC) = %v, want [0 2]", rows)
	}
}

func TestColumnStoreFilterNotEquals(t *testing.T) {
	cs := newTestStore()
	rows := cs.FilterRows("city", "!=", "NYC")
	if len(rows) != 2 || rows[0] != 1 || rows[1] != 3 {
		t.Errorf("FilterRows(city != NYC) = %v, want [1 3]", rows)
	}
}

func TestColumnStoreFilterGreaterThan(t *testing.T) {
	cs := newTestStore()
	rows := cs.FilterRows("age", ">", "28")
	if len(rows) != 2 || rows[0] != 0 || rows[1] != 2 {
		t.Errorf("FilterRows(age > 28) = %v, want [0 2]", rows)
	}
}

func TestColumnStoreFilterLessThan(t *testing.T) {
	cs := newTestStore()
	rows := cs.FilterRows("age", "<", "28")
	if len(rows) != 1 || rows[0] != 1 {
		t.Errorf("FilterRows(age < 28) = %v, want [1]", rows)
	}
}

func TestColumnStoreSum(t *testing.T) {
	cs := newTestStore()
	sum, err := cs.Sum("age")
	if err != nil {
		t.Fatalf("Sum(age) error: %v", err)
	}
	if sum != 118 {
		t.Errorf("Sum(age) = %d, want 118", sum)
	}
}

func TestColumnStoreSumInvalidColumn(t *testing.T) {
	cs := newTestStore()
	_, err := cs.Sum("nonexistent")
	if err == nil {
		t.Error("Sum(nonexistent) should return error")
	}
}

func TestColumnStoreEmpty(t *testing.T) {
	cs := NewColumnStore([]string{"x"})
	if cs.Count() != 0 {
		t.Errorf("Count() = %d, want 0", cs.Count())
	}
	col, _ := cs.GetColumn("x")
	if len(col) != 0 {
		t.Errorf("GetColumn(x) on empty = %v, want []", col)
	}
}`,
  solution: `package main

import (
	"errors"
	"strconv"
)

type ColumnStore struct {
	colNames []string
	columns  map[string][]string
	rowCount int
}

func NewColumnStore(columns []string) *ColumnStore {
	cols := make(map[string][]string, len(columns))
	for _, c := range columns {
		cols[c] = nil
	}
	names := make([]string, len(columns))
	copy(names, columns)
	return &ColumnStore{
		colNames: names,
		columns:  cols,
	}
}

func (cs *ColumnStore) AddRow(values map[string]string) error {
	for _, col := range cs.colNames {
		if _, ok := values[col]; !ok {
			return errors.New("missing column: " + col)
		}
	}
	for _, col := range cs.colNames {
		cs.columns[col] = append(cs.columns[col], values[col])
	}
	cs.rowCount++
	return nil
}

func (cs *ColumnStore) GetColumn(name string) ([]string, error) {
	col, ok := cs.columns[name]
	if !ok {
		return nil, errors.New("column not found: " + name)
	}
	result := make([]string, len(col))
	copy(result, col)
	return result, nil
}

func (cs *ColumnStore) GetRow(index int) (map[string]string, error) {
	if index < 0 || index >= cs.rowCount {
		return nil, errors.New("row index out of range")
	}
	row := make(map[string]string, len(cs.colNames))
	for _, col := range cs.colNames {
		row[col] = cs.columns[col][index]
	}
	return row, nil
}

func (cs *ColumnStore) FilterRows(column, op, value string) []int {
	col, ok := cs.columns[column]
	if !ok {
		return nil
	}
	var result []int
	for i, v := range col {
		match := false
		switch op {
		case "=":
			match = v == value
		case "!=":
			match = v != value
		case ">":
			vi, _ := strconv.Atoi(v)
			target, _ := strconv.Atoi(value)
			match = vi > target
		case "<":
			vi, _ := strconv.Atoi(v)
			target, _ := strconv.Atoi(value)
			match = vi < target
		}
		if match {
			result = append(result, i)
		}
	}
	return result
}

func (cs *ColumnStore) Count() int {
	return cs.rowCount
}

func (cs *ColumnStore) Sum(column string) (int, error) {
	col, ok := cs.columns[column]
	if !ok {
		return 0, errors.New("column not found: " + column)
	}
	sum := 0
	for _, v := range col {
		n, _ := strconv.Atoi(v)
		sum += n
	}
	return sum, nil
}

func main() {}`,
  hints: [
    'Store columns as map[string][]string. Each column is a slice where index i corresponds to row i.',
    'AddRow must validate that all column names are present in the values map before appending.',
    'FilterRows iterates the specified column slice and collects indices where the condition matches.',
  ],
}

export default exercise

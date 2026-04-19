import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_14_type_sets',
  title: 'Type Sets',
  category: 'Type System',
  subcategory: 'Generics',
  difficulty: 'advanced',
  order: 14,
  description: `Type sets define which types satisfy a constraint. Advanced features:

**The \`~\` operator** matches the underlying type:
\`\`\`
type Integer interface { ~int | ~int64 }
\`\`\`
This allows custom types like \`type UserID int\` to satisfy \`Integer\`.

**Combining methods and type unions**:
\`\`\`
type Stringish interface {
    ~string
    Len() int
}
\`\`\`

Your task: use type sets with \`~\` to build flexible constraints.`,
  code: `package main

import "fmt"

// Integer matches int and any type whose underlying type is int
type Integer interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

// UserID is a custom type based on int
type UserID int

// OrderID is a custom type based on int64
type OrderID int64

// ToInt converts any Integer type to a plain int.
func ToInt[T Integer](val T) int {
	// TODO
	return 0
}

// Abs returns the absolute value of any integer type.
func Abs[T Integer](val T) T {
	// TODO
	var zero T
	return zero
}

// SumIDs sums a slice of any integer-based type and returns int64.
func SumIDs[T Integer](ids []T) int64 {
	// TODO
	return 0
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestToIntPlain(t *testing.T) {
	if got := ToInt(42); got != 42 {
		t.Errorf("ToInt(42) = %d, want 42", got)
	}
}

func TestToIntUserID(t *testing.T) {
	id := UserID(100)
	if got := ToInt(id); got != 100 {
		t.Errorf("ToInt(UserID(100)) = %d, want 100", got)
	}
}

func TestToIntOrderID(t *testing.T) {
	id := OrderID(999)
	if got := ToInt(id); got != 999 {
		t.Errorf("ToInt(OrderID(999)) = %d, want 999", got)
	}
}

func TestAbsPositive(t *testing.T) {
	if got := Abs(5); got != 5 {
		t.Errorf("Abs(5) = %d, want 5", got)
	}
}

func TestAbsNegative(t *testing.T) {
	if got := Abs(-5); got != 5 {
		t.Errorf("Abs(-5) = %d, want 5", got)
	}
}

func TestAbsUserID(t *testing.T) {
	id := UserID(-42)
	if got := Abs(id); got != 42 {
		t.Errorf("Abs(UserID(-42)) = %d, want 42", got)
	}
}

func TestSumIDs(t *testing.T) {
	ids := []UserID{1, 2, 3, 4, 5}
	if got := SumIDs(ids); got != 15 {
		t.Errorf("SumIDs = %d, want 15", got)
	}
}

func TestSumOrderIDs(t *testing.T) {
	ids := []OrderID{100, 200, 300}
	if got := SumIDs(ids); got != 600 {
		t.Errorf("SumIDs = %d, want 600", got)
	}
}`,
  solution: `package main

import "fmt"

type Integer interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

type UserID int
type OrderID int64

func ToInt[T Integer](val T) int {
	return int(val)
}

func Abs[T Integer](val T) T {
	if val < 0 {
		return -val
	}
	return val
}

func SumIDs[T Integer](ids []T) int64 {
	var total int64
	for _, id := range ids {
		total += int64(id)
	}
	return total
}

var _ = fmt.Sprintf`,
  hints: [
    'The ~ prefix matches underlying types: ~int matches int, UserID, and any type defined as int.',
    'You can convert between generic types and concrete types: int(val) works because T is constrained to ~int.',
    'For Abs, just check if val < 0 and return -val — comparison and negation work on integer constraints.'
  ],
}

export default exercise

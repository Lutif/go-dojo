import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_28_struct_methods',
  title: 'Struct Methods',
  category: 'Basics',
  subcategory: 'Structs & Pointers',
  difficulty: 'beginner',
  order: 28,
  description: `Methods are functions with a **receiver** — they're attached to a type:

\`\`\`
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

circle := Circle{Radius: 5}
fmt.Println(circle.Area())  // 78.5398...
\`\`\`

The receiver \`(c Circle)\` comes before the method name. The method can access all fields of the struct through the receiver variable.

Your task: add methods to the Counter and BankAccount types.`,
  code: `package main

import "fmt"

// Counter tracks a count value
type Counter struct {
	Value int
}

// TODO: Add a method Current() int that returns the current Value

// TODO: Add a method Increment() Counter that returns a new Counter
// with Value incremented by 1 (don't modify the original!)

// TODO: Add a method Add(n int) Counter that returns a new Counter
// with Value increased by n

// BankAccount holds a balance
type BankAccount struct {
	Owner   string
	Balance float64
}

// TODO: Add a method String() string that returns "Owner: $Balance"
// Example: "Alice: $100.50"
// Hint: use fmt.Sprintf("%.2f", ...) to format with 2 decimal places

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestCounterCurrent(t *testing.T) {
	c := Counter{Value: 42}
	if got := c.Current(); got != 42 {
		t.Errorf("Current() = %d, want 42", got)
	}
}

func TestCounterIncrement(t *testing.T) {
	c := Counter{Value: 0}
	c2 := c.Increment()
	if c2.Value != 1 {
		t.Errorf("Increment().Value = %d, want 1", c2.Value)
	}
	// Original should be unchanged (value receiver)
	if c.Value != 0 {
		t.Errorf("original Value changed to %d, should still be 0", c.Value)
	}
}

func TestCounterAdd(t *testing.T) {
	c := Counter{Value: 10}
	c2 := c.Add(5)
	if c2.Value != 15 {
		t.Errorf("Add(5).Value = %d, want 15", c2.Value)
	}
}

func TestBankAccountString(t *testing.T) {
	a := BankAccount{Owner: "Alice", Balance: 100.50}
	got := a.String()
	want := "Alice: $100.50"
	if got != want {
		t.Errorf("String() = %q, want %q", got, want)
	}
	b := BankAccount{Owner: "Bob", Balance: 0}
	got2 := b.String()
	want2 := "Bob: $0.00"
	if got2 != want2 {
		t.Errorf("String() = %q, want %q", got2, want2)
	}
}`,
  solution: `package main

import "fmt"

type Counter struct {
	Value int
}

func (c Counter) Current() int {
	return c.Value
}

func (c Counter) Increment() Counter {
	return Counter{Value: c.Value + 1}
}

func (c Counter) Add(n int) Counter {
	return Counter{Value: c.Value + n}
}

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a BankAccount) String() string {
	return fmt.Sprintf("%s: $%.2f", a.Owner, a.Balance)
}`,
  hints: [
    'Method syntax: func (c Counter) Current() int { return c.Value }',
    'A value receiver (c Counter) gets a copy — changes to c inside the method don\'t affect the original.',
    'Return a new Counter{Value: c.Value + 1} to create an incremented version without modifying the original.'
  ],
}

export default exercise

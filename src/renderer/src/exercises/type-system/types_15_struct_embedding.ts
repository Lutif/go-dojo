import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_15_struct_embedding',
  title: 'Struct Embedding',
  category: 'Type System',
  subcategory: 'Embedding',
  difficulty: 'intermediate',
  order: 15,
  description: `Go doesn't have inheritance, but uses **embedding** for composition. Embed a struct by including it without a field name:

\`\`\`
type Animal struct { Name string }
func (a Animal) Speak() string { return a.Name + " speaks" }

type Dog struct {
    Animal    // embedded — Dog gets Animal's fields and methods
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Lab"}
d.Name    // "Rex" — promoted from Animal
d.Speak() // "Rex speaks" — promoted method
\`\`\`

Your task: use struct embedding for composition.`,
  code: `package main

import "fmt"

// Base holds common fields for all entities
type Base struct {
	ID   int
	Name string
}

// TODO: Add a String() method on Base: "Name (ID: id)"
// Example: "Widget (ID: 42)"

// Product embeds Base and adds a Price field.
// TODO: Define Product with embedded Base and Price float64

// TODO: Add a PriceTag() method on Product
// Returns: "Name - $Price" with 2 decimal places
// Example: "Widget - $9.99"

// Employee embeds Base and adds Role.
// TODO: Define Employee with embedded Base and Role string

// TODO: Add a Badge() method on Employee
// Returns: "Name, Role"
// Example: "Alice, Engineer"

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestBaseString(t *testing.T) {
	b := Base{ID: 1, Name: "Test"}
	if got := b.String(); got != "Test (ID: 1)" {
		t.Errorf("Base.String() = %q, want %q", got, "Test (ID: 1)")
	}
}

func TestProductFields(t *testing.T) {
	p := Product{Base: Base{ID: 42, Name: "Widget"}, Price: 9.99}
	// Promoted fields
	if p.Name != "Widget" {
		t.Errorf("p.Name = %q, want Widget", p.Name)
	}
	if p.ID != 42 {
		t.Errorf("p.ID = %d, want 42", p.ID)
	}
}

func TestProductString(t *testing.T) {
	p := Product{Base: Base{ID: 42, Name: "Widget"}, Price: 9.99}
	// String() is promoted from Base
	if got := p.String(); got != "Widget (ID: 42)" {
		t.Errorf("Product.String() = %q, want %q", got, "Widget (ID: 42)")
	}
}

func TestProductPriceTag(t *testing.T) {
	p := Product{Base: Base{ID: 1, Name: "Gizmo"}, Price: 19.50}
	want := "Gizmo - $19.50"
	if got := p.PriceTag(); got != want {
		t.Errorf("PriceTag() = %q, want %q", got, want)
	}
}

func TestEmployeeBadge(t *testing.T) {
	e := Employee{Base: Base{ID: 1, Name: "Alice"}, Role: "Engineer"}
	want := "Alice, Engineer"
	if got := e.Badge(); got != want {
		t.Errorf("Badge() = %q, want %q", got, want)
	}
}

func TestEmployeeString(t *testing.T) {
	e := Employee{Base: Base{ID: 5, Name: "Bob"}, Role: "Manager"}
	if got := e.String(); got != "Bob (ID: 5)" {
		t.Errorf("Employee.String() = %q, want %q", got, "Bob (ID: 5)")
	}
}`,
  solution: `package main

import "fmt"

type Base struct {
	ID   int
	Name string
}

func (b Base) String() string {
	return fmt.Sprintf("%s (ID: %d)", b.Name, b.ID)
}

type Product struct {
	Base
	Price float64
}

func (p Product) PriceTag() string {
	return fmt.Sprintf("%s - $%.2f", p.Name, p.Price)
}

type Employee struct {
	Base
	Role string
}

func (e Employee) Badge() string {
	return fmt.Sprintf("%s, %s", e.Name, e.Role)
}`,
  hints: [
    'Embed with just the type name: type Product struct { Base; Price float64 }',
    'Embedded fields and methods are "promoted" — access p.Name directly instead of p.Base.Name.',
    'Promoted methods work too: p.String() calls Base.String() automatically.'
  ],
}

export default exercise

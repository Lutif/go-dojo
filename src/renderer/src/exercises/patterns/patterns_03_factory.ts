import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_03_factory',
  title: 'Factory Pattern',
  category: 'Patterns',
  subcategory: 'Creational',
  difficulty: 'intermediate',
  order: 3,
  description: `The factory pattern encapsulates object creation, returning different concrete types through a common interface. In Go, \`NewXxx\` constructor functions are idiomatic factories:

\`\`\`go
func NewShape(kind string) Shape {
    switch kind {
    case "circle":
        return &Circle{}
    case "rectangle":
        return &Rectangle{}
    }
    return nil
}
\`\`\`

Your task:

1. Define a \`Shape\` interface with methods \`Name() string\` and \`Area()\` float64
2. Implement \`Circle\` with a \`radius\` float64 field (area = 3.14159 * r * r)
3. Implement \`Rectangle\` with \`width\` and \`height\` float64 fields (area = w * h)
4. Implement \`NewShape(kind string) Shape\` factory that creates:
   - \`"circle"\` -> Circle with radius 1.0
   - \`"rectangle"\` -> Rectangle with width 2.0, height 3.0
   - anything else -> nil`,
  code: `package main

// TODO: Define the Shape interface with Name() string and Area() float64

// TODO: Define Circle struct with radius float64
// Implement Name() returning "circle"
// Implement Area() returning 3.14159 * radius * radius

// TODO: Define Rectangle struct with width, height float64
// Implement Name() returning "rectangle"
// Implement Area() returning width * height

// TODO: Implement NewShape(kind string) Shape
// "circle" -> Circle{radius: 1.0}
// "rectangle" -> Rectangle{width: 2.0, height: 3.0}
// default -> nil

func main() {}`,
  testCode: `package main

import (
	"math"
	"testing"
)

func TestFactoryCircle(t *testing.T) {
	s := NewShape("circle")
	if s == nil {
		t.Fatal("NewShape returned nil for circle")
	}
	if s.Name() != "circle" {
		t.Errorf("Name() = %q, want %q", s.Name(), "circle")
	}
	expected := 3.14159 * 1.0 * 1.0
	if math.Abs(s.Area()-expected) > 0.001 {
		t.Errorf("Area() = %f, want %f", s.Area(), expected)
	}
}

func TestFactoryRectangle(t *testing.T) {
	s := NewShape("rectangle")
	if s == nil {
		t.Fatal("NewShape returned nil for rectangle")
	}
	if s.Name() != "rectangle" {
		t.Errorf("Name() = %q, want %q", s.Name(), "rectangle")
	}
	expected := 2.0 * 3.0
	if math.Abs(s.Area()-expected) > 0.001 {
		t.Errorf("Area() = %f, want %f", s.Area(), expected)
	}
}

func TestFactoryUnknown(t *testing.T) {
	s := NewShape("triangle")
	if s != nil {
		t.Errorf("expected nil for unknown shape, got %v", s)
	}
}`,
  solution: `package main

type Shape interface {
	Name() string
	Area() float64
}

type Circle struct {
	radius float64
}

func (c *Circle) Name() string    { return "circle" }
func (c *Circle) Area() float64   { return 3.14159 * c.radius * c.radius }

type Rectangle struct {
	width  float64
	height float64
}

func (r *Rectangle) Name() string  { return "rectangle" }
func (r *Rectangle) Area() float64 { return r.width * r.height }

func NewShape(kind string) Shape {
	switch kind {
	case "circle":
		return &Circle{radius: 1.0}
	case "rectangle":
		return &Rectangle{width: 2.0, height: 3.0}
	default:
		return nil
	}
}

func main() {}`,
  hints: [
    'Use a switch statement in NewShape to decide which struct to create.',
    'Return pointer types (*Circle, *Rectangle) to satisfy the Shape interface.',
    'The default case should return nil for unknown shape kinds.',
  ],
}

export default exercise

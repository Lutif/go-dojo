import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_01_interfaces',
  title: 'Interfaces',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'beginner',
  order: 1,
  description: `An interface defines a set of method signatures. Any type that implements all those methods automatically satisfies the interface — no \`implements\` keyword needed.

\`\`\`
type Shape interface {
    Area() float64
}
\`\`\`

Any type with an \`Area() float64\` method satisfies \`Shape\`. This is Go's way of achieving polymorphism.

Your task: define the \`Shape\` interface and two types that implement it.`,
  code: `package main

import "math"

// TODO: Define a Shape interface with an Area() float64 method

// Circle has a Radius
type Circle struct {
	Radius float64
}

// TODO: Implement Area() for Circle
// Formula: math.Pi * r * r

// Rectangle has Width and Height
type Rectangle struct {
	Width, Height float64
}

// TODO: Implement Area() for Rectangle
// Formula: width * height

// TotalArea takes a slice of Shapes and returns the sum of their areas
func TotalArea(shapes []Shape) float64 {
	// TODO
	return 0
}

var _ = math.Pi`,
  testCode: `package main

import (
	"math"
	"testing"
)

func TestCircleArea(t *testing.T) {
	c := Circle{Radius: 5}
	want := math.Pi * 25
	if got := c.Area(); got != want {
		t.Errorf("Circle{5}.Area() = %f, want %f", got, want)
	}
}

func TestRectangleArea(t *testing.T) {
	r := Rectangle{Width: 4, Height: 6}
	if got := r.Area(); got != 24 {
		t.Errorf("Rectangle{4,6}.Area() = %f, want 24", got)
	}
}

func TestTotalArea(t *testing.T) {
	shapes := []Shape{
		Circle{Radius: 1},
		Rectangle{Width: 2, Height: 3},
	}
	want := math.Pi + 6.0
	got := TotalArea(shapes)
	if math.Abs(got-want) > 0.0001 {
		t.Errorf("TotalArea = %f, want %f", got, want)
	}
}

func TestInterfaceSatisfaction(t *testing.T) {
	// Verify both types satisfy Shape
	var s Shape
	s = Circle{Radius: 1}
	_ = s
	s = Rectangle{Width: 1, Height: 1}
	_ = s
}`,
  solution: `package main

import "math"

type Shape interface {
	Area() float64
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func TotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}`,
  hints: [
    'Define an interface: type Shape interface { Area() float64 }',
    'Implement with a method: func (c Circle) Area() float64 { return math.Pi * c.Radius * c.Radius }',
    'TotalArea can loop over []Shape and call Area() on each — polymorphism in action.'
  ],
}

export default exercise

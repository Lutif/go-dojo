import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_27_structs',
  title: 'Structs',
  category: 'Basics',
  subcategory: 'Structs & Pointers',
  difficulty: 'beginner',
  order: 27,
  description: `A **struct** is a user-defined type made of a fixed set of **fields**, each with a name and a type. It is how you model records (a rectangle with width/height, a person with a name) without classes or inheritance. You create a value with a struct literal, optionally using field names for clarity, and you read and write with dot notation. Fields whose names **start with an upper-case letter** are **exported** (visible in other packages); unexported field names are package-private, like many languages’ access rules, but the rule is a naming convention, not a keyword.

\`\`\`
type Person struct {
    Name string
    Age  int
}

p := Person{Name: "Alice", Age: 30}
fmt.Println(p.Name)
\`\`\`

**Your task:** define \`Rectangle\` and \`Person\` as described, and implement the helpers in the file.`,
  code: `package main

import "fmt"

// TODO: Define a Rectangle struct with Width and Height (both float64)

// Area returns the area of the rectangle
func Area(r Rectangle) float64 {
	// TODO
	return 0
}

// TODO: Define a Person struct with Name (string) and Age (int)

// Describe returns "Name is Age years old"
func Describe(p Person) string {
	// TODO
	return ""
}

// NewRectangle creates a Rectangle from width and height.
// If either dimension is negative, set it to 0.
func NewRectangle(w, h float64) Rectangle {
	// TODO
	return Rectangle{}
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestArea(t *testing.T) {
	r := Rectangle{Width: 5, Height: 3}
	got := Area(r)
	if got != 15 {
		t.Errorf("Area({5,3}) = %f, want 15", got)
	}
	r2 := Rectangle{Width: 0, Height: 10}
	if got2 := Area(r2); got2 != 0 {
		t.Errorf("Area({0,10}) = %f, want 0", got2)
	}
}

func TestDescribe(t *testing.T) {
	p := Person{Name: "Alice", Age: 30}
	got := Describe(p)
	want := "Alice is 30 years old"
	if got != want {
		t.Errorf("Describe = %q, want %q", got, want)
	}
}

func TestNewRectangle(t *testing.T) {
	r := NewRectangle(5, 3)
	if r.Width != 5 || r.Height != 3 {
		t.Errorf("NewRectangle(5,3) = %v, want {5,3}", r)
	}
	r2 := NewRectangle(-1, 5)
	if r2.Width != 0 {
		t.Errorf("NewRectangle(-1,5).Width = %f, want 0", r2.Width)
	}
	r3 := NewRectangle(3, -2)
	if r3.Height != 0 {
		t.Errorf("NewRectangle(3,-2).Height = %f, want 0", r3.Height)
	}
}`,
  solution: `package main

import "fmt"

type Rectangle struct {
	Width  float64
	Height float64
}

func Area(r Rectangle) float64 {
	return r.Width * r.Height
}

type Person struct {
	Name string
	Age  int
}

func Describe(p Person) string {
	return fmt.Sprintf("%s is %d years old", p.Name, p.Age)
}

func NewRectangle(w, h float64) Rectangle {
	if w < 0 {
		w = 0
	}
	if h < 0 {
		h = 0
	}
	return Rectangle{Width: w, Height: h}
}`,
  hints: [
    'Define a struct with: type Rectangle struct { Width float64; Height float64 }',
    'Access fields with dot notation: r.Width, r.Height',
    'Use named fields when creating: Rectangle{Width: 5, Height: 3} — this is clearer than positional Rectangle{5, 3}.'
  ],
}

export default exercise

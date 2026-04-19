import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_09_stringer_interface',
  title: 'Stringer Interface',
  category: 'Type System',
  subcategory: 'Types',
  difficulty: 'beginner',
  order: 9,
  description: `The \`fmt.Stringer\` interface has a single method:
\`\`\`
type Stringer interface {
    String() string
}
\`\`\`

When you pass a value to \`fmt.Println\`, \`fmt.Sprintf("%v")\`, etc., Go checks if it implements \`Stringer\` and calls \`String()\` to format it.

This is how you control how your types are printed.

Your task: implement \`String()\` methods for custom types.`,
  code: `package main

import "fmt"

// Point represents a 2D coordinate
type Point struct {
	X, Y int
}

// TODO: Implement String() for Point
// Format: "(X, Y)"  e.g. "(3, 4)"

// Color represents an RGB color
type Color struct {
	R, G, B uint8
}

// TODO: Implement String() for Color
// Format: "#RRGGBB" in hex  e.g. Color{255, 0, 128} → "#ff0080"
// Hint: use fmt.Sprintf("#%02x%02x%02x", ...)

// Weekday is a custom type for days
type Weekday int

const (
	Sunday Weekday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
	Saturday
)

// TODO: Implement String() for Weekday
// Return the day name: "Sunday", "Monday", etc.
// Return "Unknown" for invalid values.

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestPointString(t *testing.T) {
	tests := []struct {
		p    Point
		want string
	}{
		{Point{3, 4}, "(3, 4)"},
		{Point{0, 0}, "(0, 0)"},
		{Point{-1, 10}, "(-1, 10)"},
	}
	for _, tt := range tests {
		if got := tt.p.String(); got != tt.want {
			t.Errorf("Point%v.String() = %q, want %q", tt.p, got, tt.want)
		}
	}
}

func TestColorString(t *testing.T) {
	tests := []struct {
		c    Color
		want string
	}{
		{Color{255, 0, 128}, "#ff0080"},
		{Color{0, 0, 0}, "#000000"},
		{Color{255, 255, 255}, "#ffffff"},
	}
	for _, tt := range tests {
		if got := tt.c.String(); got != tt.want {
			t.Errorf("Color.String() = %q, want %q", got, tt.want)
		}
	}
}

func TestWeekdayString(t *testing.T) {
	tests := []struct {
		d    Weekday
		want string
	}{
		{Sunday, "Sunday"},
		{Friday, "Friday"},
		{Saturday, "Saturday"},
		{Weekday(99), "Unknown"},
	}
	for _, tt := range tests {
		if got := tt.d.String(); got != tt.want {
			t.Errorf("Weekday(%d).String() = %q, want %q", tt.d, got, tt.want)
		}
	}
}`,
  solution: `package main

import "fmt"

type Point struct {
	X, Y int
}

func (p Point) String() string {
	return fmt.Sprintf("(%d, %d)", p.X, p.Y)
}

type Color struct {
	R, G, B uint8
}

func (c Color) String() string {
	return fmt.Sprintf("#%02x%02x%02x", c.R, c.G, c.B)
}

type Weekday int

const (
	Sunday Weekday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
	Saturday
)

func (d Weekday) String() string {
	names := [...]string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
	if d < Sunday || d > Saturday {
		return "Unknown"
	}
	return names[d]
}`,
  hints: [
    'Implement func (p Point) String() string { return fmt.Sprintf("(%d, %d)", p.X, p.Y) }',
    'For hex formatting: %02x pads with zeros to 2 digits. fmt.Sprintf("#%02x%02x%02x", r, g, b)',
    'For Weekday, use an array of names indexed by the Weekday value: names[d]'
  ],
}

export default exercise

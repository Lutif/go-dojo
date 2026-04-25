import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_05_type_switch',
  title: 'Type Switch',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'intermediate',
  order: 5,
  description: `A type switch is like a regular switch but tests types instead of values:

\`\`\`
switch v := x.(type) {
case int:
    fmt.Println("int:", v)
case string:
    fmt.Println("string:", v)
default:
    fmt.Println("unknown")
}
\`\`\`

Inside each case, \`v\` is automatically the matched concrete type — no extra assertion needed.

Your task: use type switches to handle multiple types.`,
  code: `package main

import "fmt"

// Area calculates the area of a shape passed as interface{}.
// Supported shapes:
//   Circle{Radius float64}       → math.Pi * r²
//   Rect{Width, Height float64}  → w * h
//   Triangle{Base, Height float64} → 0.5 * b * h
// Returns -1 for unknown shapes.

type Circle struct{ Radius float64 }
type Rect struct{ Width, Height float64 }
type Triangle struct{ Base, Height float64 }

func Area(shape interface{}) float64 {
	// TODO: Use a type switch
	return -1
}

// Len returns the "length" of a value:
//   string → number of characters (runes)
//   []int  → number of elements
//   int    → number of digits
//   other  → -1
func Len(val interface{}) int {
	// TODO: Use a type switch
	return -1
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"math"
	"testing"
)

func TestAreaCircle(t *testing.T) {
	got := Area(Circle{Radius: 5})
	want := math.Pi * 25
	if math.Abs(got-want) > 0.001 {
		t.Errorf("Area(Circle{5}) = %f, want %f", got, want)
	}
}

func TestAreaRect(t *testing.T) {
	if got := Area(Rect{3, 4}); got != 12 {
		t.Errorf("Area(Rect{3,4}) = %f, want 12", got)
	}
}

func TestAreaTriangle(t *testing.T) {
	if got := Area(Triangle{6, 4}); got != 12 {
		t.Errorf("Area(Triangle{6,4}) = %f, want 12", got)
	}
}

func TestAreaUnknown(t *testing.T) {
	if got := Area("not a shape"); got != -1 {
		t.Errorf("Area(string) = %f, want -1", got)
	}
}

func TestLen(t *testing.T) {
	tests := []struct {
		val  interface{}
		want int
	}{
		{"hello", 5},
		{"世界", 2},
		{[]int{1, 2, 3}, 3},
		{42, 2},
		{1000, 4},
		{7, 1},
		{3.14, -1},
	}
	for _, tt := range tests {
		got := Len(tt.val)
		if got != tt.want {
			t.Errorf("Len(%v) = %d, want %d", tt.val, got, tt.want)
		}
	}
}`,
  solution: `package main

import (
	"fmt"
	"math"
)

type Circle struct{ Radius float64 }
type Rect struct{ Width, Height float64 }
type Triangle struct{ Base, Height float64 }

func Area(shape interface{}) float64 {
	switch s := shape.(type) {
	case Circle:
		return math.Pi * s.Radius * s.Radius
	case Rect:
		return s.Width * s.Height
	case Triangle:
		return 0.5 * s.Base * s.Height
	default:
		return -1
	}
}

func Len(val interface{}) int {
	switch v := val.(type) {
	case string:
		return len([]rune(v))
	case []int:
		return len(v)
	case int:
		count := 0
		if v == 0 {
			return 1
		}
		for v > 0 {
			v /= 10
			count++
		}
		return count
	default:
		return -1
	}
}

var _ = fmt.Sprintf`,
  hints: [
    'switch s := shape.(type) { case Circle: ... } — s is automatically a Circle inside that case.',
    'For Len with strings, use len([]rune(v)) to count Unicode characters correctly.',
    'For counting digits of an int, divide by 10 repeatedly until 0.'
  ],
}

export default exercise

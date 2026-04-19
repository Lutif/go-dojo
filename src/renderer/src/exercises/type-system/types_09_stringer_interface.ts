import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_09_stringer_interface',
  title: 'Stringer Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 9,
  description: `Implement the Stringer interface for custom string representations. Stringer defines how a type is converted to a string.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestPointString(t *testing.T) {
	p := Point{3, 4}
	if p.String() != "(3, 4)" {
		t.Errorf("Expected '(3, 4)', got %q", p.String())
	}
}

func TestPointOrigin(t *testing.T) {
	p := Point{0, 0}
	if p.String() != "(0, 0)" {
		t.Errorf("Expected '(0, 0)', got %q", p.String())
	}
}

func TestFormatPoint(t *testing.T) {
	p := Point{-1, 5}
	result := FormatPoint(p)
	if result != "(-1, 5)" {
		t.Errorf("Expected '(-1, 5)', got %q", result)
	}
}

func TestWeekdaySunday(t *testing.T) {
	if Sunday.String() != "Sunday" {
		t.Errorf("Expected 'Sunday', got %q", Sunday.String())
	}
}

func TestWeekdayFriday(t *testing.T) {
	if Friday.String() != "Friday" {
		t.Errorf("Expected 'Friday', got %q", Friday.String())
	}
}

func TestWeekdayUnknown(t *testing.T) {
	d := Weekday(99)
	if d.String() != "Unknown" {
		t.Errorf("Expected 'Unknown', got %q", d.String())
	}
}

func TestFormatWeekday(t *testing.T) {
	result := FormatWeekday(Wednesday)
	if result != "Wednesday" {
		t.Errorf("Expected 'Wednesday', got %q", result)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement String() string method to satisfy Stringer',
    'Used by fmt.Print when the value is formatted',
    'Enables readable output without explicit conversions',
  ],
}

export default exercise

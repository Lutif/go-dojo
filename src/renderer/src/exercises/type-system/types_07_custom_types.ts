import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_07_custom_types',
  title: 'Custom Types',
  category: 'Type System',
  subcategory: 'Types',
  difficulty: 'beginner',
  order: 7,
  description: `You can create new named types based on existing ones with \`type\`:

\`\`\`
type Celsius float64
type Fahrenheit float64
\`\`\`

Even though both are based on \`float64\`, they're distinct types — you can't accidentally mix them. You can also add methods to custom types (but not to built-in types directly).

Your task: create custom types with meaningful semantics and methods.`,
  code: `package main

// TODO: Define a Celsius type based on float64

// TODO: Define a Fahrenheit type based on float64

// TODO: Add a ToFahrenheit() method on Celsius
// Formula: F = C*9/5 + 32

// TODO: Add a ToCelsius() method on Fahrenheit
// Formula: C = (F-32) * 5/9

// TODO: Define a Meters type based on float64

// TODO: Define a Feet type based on float64

// TODO: Add a ToFeet() method on Meters
// Formula: feet = meters * 3.28084

// TODO: Add a ToMeters() method on Feet
// Formula: meters = feet / 3.28084`,
  testCode: `package main

import (
	"math"
	"testing"
)

func TestCelsiusToFahrenheit(t *testing.T) {
	tests := []struct {
		c    Celsius
		want Fahrenheit
	}{
		{0, 32},
		{100, 212},
		{-40, -40},
	}
	for _, tt := range tests {
		got := tt.c.ToFahrenheit()
		if math.Abs(float64(got-tt.want)) > 0.01 {
			t.Errorf("Celsius(%v).ToFahrenheit() = %v, want %v", tt.c, got, tt.want)
		}
	}
}

func TestFahrenheitToCelsius(t *testing.T) {
	tests := []struct {
		f    Fahrenheit
		want Celsius
	}{
		{32, 0},
		{212, 100},
		{-40, -40},
	}
	for _, tt := range tests {
		got := tt.f.ToCelsius()
		if math.Abs(float64(got-tt.want)) > 0.01 {
			t.Errorf("Fahrenheit(%v).ToCelsius() = %v, want %v", tt.f, got, tt.want)
		}
	}
}

func TestMetersToFeet(t *testing.T) {
	m := Meters(1)
	got := m.ToFeet()
	if math.Abs(float64(got)-3.28084) > 0.01 {
		t.Errorf("Meters(1).ToFeet() = %v, want ~3.28", got)
	}
}

func TestFeetToMeters(t *testing.T) {
	f := Feet(3.28084)
	got := f.ToMeters()
	if math.Abs(float64(got)-1.0) > 0.01 {
		t.Errorf("Feet(3.28084).ToMeters() = %v, want ~1.0", got)
	}
}`,
  solution: `package main

type Celsius float64
type Fahrenheit float64

func (c Celsius) ToFahrenheit() Fahrenheit {
	return Fahrenheit(c*9/5 + 32)
}

func (f Fahrenheit) ToCelsius() Celsius {
	return Celsius((f - 32) * 5 / 9)
}

type Meters float64
type Feet float64

func (m Meters) ToFeet() Feet {
	return Feet(m * 3.28084)
}

func (f Feet) ToMeters() Meters {
	return Meters(f / 3.28084)
}`,
  hints: [
    'type Celsius float64 creates a new type. You need explicit conversion: Fahrenheit(value) to create the return value.',
    'Methods on custom types: func (c Celsius) ToFahrenheit() Fahrenheit { ... }',
    'Celsius and Fahrenheit are distinct types even though both are float64 underneath — the compiler prevents mixing them.'
  ],
}

export default exercise

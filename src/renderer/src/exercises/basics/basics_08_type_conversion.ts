import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_08_type_conversion',
  title: 'Type Conversion',
  category: 'Basics',
  subcategory: 'Types',
  difficulty: 'beginner',
  order: 8,
  description: `Go requires **explicit** type conversions — it never converts types implicitly (no automatic int-to-float promotion).

Syntax: \`targetType(value)\`
- \`float64(42)\` → 42.0
- \`int(3.99)\` → 3 (truncates, doesn't round)

To convert numbers to/from strings, use the \`strconv\` package (covered later). For now, focus on numeric conversions.

Your task: implement the conversion functions below.`,
  code: `package main

// IntToFloat converts an int to float64
func IntToFloat(n int) float64 {
	// TODO: Convert n to float64
	return 0
}

// FloatToInt converts a float64 to int (truncates decimal)
func FloatToInt(f float64) int {
	// TODO: Convert f to int
	return 0
}

// IntToInt32 converts an int to int32
func IntToInt32(n int) int32 {
	// TODO: Convert n to int32
	return 0
}`,
  testCode: `package main

import "testing"

func TestIntToFloat(t *testing.T) {
	got := IntToFloat(42)
	if got != 42.0 {
		t.Errorf("IntToFloat(42) = %f, want 42.0", got)
	}
}

func TestFloatToInt(t *testing.T) {
	got := FloatToInt(3.99)
	if got != 3 {
		t.Errorf("FloatToInt(3.99) = %d, want 3 (truncated)", got)
	}
	got2 := FloatToInt(-2.7)
	if got2 != -2 {
		t.Errorf("FloatToInt(-2.7) = %d, want -2 (truncated toward zero)", got2)
	}
}

func TestIntToInt32(t *testing.T) {
	got := IntToInt32(100)
	if got != 100 {
		t.Errorf("IntToInt32(100) = %d, want 100", got)
	}
}`,
  solution: `package main

func IntToFloat(n int) float64 {
	return float64(n)
}

func FloatToInt(f float64) int {
	return int(f)
}

func IntToInt32(n int) int32 {
	return int32(n)
}`,
  hints: [
    'Use the type name as a function: float64(n) converts n to a float64.',
    'Converting float to int truncates the decimal part — it does NOT round. 3.99 becomes 3.',
    'Go won\'t let you assign an int to a float64 variable without explicit conversion, even though no data is lost.'
  ],
}

export default exercise

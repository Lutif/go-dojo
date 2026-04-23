import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_08_type_conversion',
  title: 'Type Conversion',
  category: 'Basics',
  subcategory: 'Types',
  difficulty: 'beginner',
  order: 8,
  description: `Unlike some languages, Go will **not** silently widen or narrow types for you — \`3\` and \`3.0\` are different types, and mixing them without a conversion is a compile error. That keeps programs predictable: you always see where precision might change. Conversions use the form \`TargetType(value)\`. For example \`float64(42)\` becomes \`42.0\`, and \`int(3.99)\` **truncates** toward zero to \`3\` (it does not round). Converting between string and number types needs \`strconv\` (you will use that later); here, practice only numeric casts.

**Your task:** fill in \`IntToFloat\`, \`FloatToInt\`, and \`IntToInt32\` as specified in the comments.`,
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

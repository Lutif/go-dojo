import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_10_multiple_returns',
  title: 'Multiple Returns',
  category: 'Basics',
  subcategory: 'Functions',
  difficulty: 'beginner',
  order: 10,
  description: `Go functions can return multiple values. This is most commonly used to return a result alongside an error, but it's useful anytime a function naturally produces more than one piece of data.

\`\`\`
func Divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
\`\`\`

Your task: implement functions that return multiple values.`,
  code: `package main

import "errors"

// Swap returns its two arguments in reverse order
func Swap(a, b string) (string, string) {
	// TODO
	return "", ""
}

// MinMax returns the smaller and larger of two integers
func MinMax(a, b int) (int, int) {
	// TODO: return (min, max)
	return 0, 0
}

// SafeDivide divides a by b, returning an error if b is zero
func SafeDivide(a, b float64) (float64, error) {
	// TODO: return result and nil, or 0 and an error
	return 0, nil
}`,
  testCode: `package main

import "testing"

func TestSwap(t *testing.T) {
	a, b := Swap("hello", "world")
	if a != "world" || b != "hello" {
		t.Errorf("Swap(hello, world) = (%q, %q), want (world, hello)", a, b)
	}
}

func TestMinMax(t *testing.T) {
	min, max := MinMax(3, 7)
	if min != 3 || max != 7 {
		t.Errorf("MinMax(3,7) = (%d,%d), want (3,7)", min, max)
	}
	min2, max2 := MinMax(10, 2)
	if min2 != 2 || max2 != 10 {
		t.Errorf("MinMax(10,2) = (%d,%d), want (2,10)", min2, max2)
	}
	min3, max3 := MinMax(5, 5)
	if min3 != 5 || max3 != 5 {
		t.Errorf("MinMax(5,5) = (%d,%d), want (5,5)", min3, max3)
	}
}

func TestSafeDivide(t *testing.T) {
	result, err := SafeDivide(10, 3)
	if err != nil {
		t.Errorf("SafeDivide(10,3) unexpected error: %v", err)
	}
	expected := 10.0 / 3.0
	if result != expected {
		t.Errorf("SafeDivide(10,3) = %f, want %f", result, expected)
	}
	_, err2 := SafeDivide(10, 0)
	if err2 == nil {
		t.Error("SafeDivide(10,0) should return an error")
	}
}`,
  solution: `package main

import "errors"

func Swap(a, b string) (string, string) {
	return b, a
}

func MinMax(a, b int) (int, int) {
	if a < b {
		return a, b
	}
	return b, a
}

func SafeDivide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("cannot divide by zero")
	}
	return a / b, nil
}`,
  hints: [
    'Swap is simple: just return b, a.',
    'For MinMax, use an if statement to compare a and b, then return them in the right order.',
    'For SafeDivide, use errors.New("message") to create an error. Return nil for the error when the operation succeeds.'
  ],
}

export default exercise

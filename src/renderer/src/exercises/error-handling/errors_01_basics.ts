import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_01_basics',
  title: 'Error Basics',
  category: 'Error Handling',
  subcategory: 'Errors',
  difficulty: 'beginner',
  order: 1,
  description: `Go handles errors by returning them as values — typically the last return value. The caller checks \`if err != nil\` and decides what to do.

\`\`\`
result, err := doSomething()
if err != nil {
    // handle error
}
\`\`\`

Create errors with \`errors.New("message")\` or \`fmt.Errorf("format %s", val)\`.

Your task: write functions that return and handle errors properly.`,
  code: `package main

import (
	"errors"
	"fmt"
	"strconv"
)

// Divide returns a/b, or an error if b is zero.
func Divide(a, b float64) (float64, error) {
	// TODO: Return error for division by zero
	return 0, nil
}

// ParseAge converts a string to an int age.
// Returns an error if the string is not a valid number
// or if the age is negative.
func ParseAge(s string) (int, error) {
	// TODO: Use strconv.Atoi to parse, check for errors and negatives
	return 0, nil
}

// ProcessValues divides a by b, then converts the result to a string.
// Returns both the string result and any error from Divide.
// This demonstrates error propagation.
func ProcessValues(a, b float64) (string, error) {
	// TODO: Call Divide, propagate error if any, format result
	return "", nil
}

var _ = errors.New
var _ = fmt.Sprintf
var _ = strconv.Atoi`,
  testCode: `package main

import "testing"

func TestDivide(t *testing.T) {
	result, err := Divide(10, 3)
	if err != nil {
		t.Fatalf("Divide(10,3) unexpected error: %v", err)
	}
	expected := 10.0 / 3.0
	if result != expected {
		t.Errorf("Divide(10,3) = %f, want %f", result, expected)
	}
}

func TestDivideByZero(t *testing.T) {
	_, err := Divide(10, 0)
	if err == nil {
		t.Error("Divide(10,0) should return an error")
	}
}

func TestParseAge(t *testing.T) {
	age, err := ParseAge("25")
	if err != nil || age != 25 {
		t.Errorf("ParseAge('25') = (%d, %v), want (25, nil)", age, err)
	}
}

func TestParseAgeInvalid(t *testing.T) {
	_, err := ParseAge("abc")
	if err == nil {
		t.Error("ParseAge('abc') should return an error")
	}
}

func TestParseAgeNegative(t *testing.T) {
	_, err := ParseAge("-5")
	if err == nil {
		t.Error("ParseAge('-5') should return an error")
	}
}

func TestProcessValues(t *testing.T) {
	result, err := ProcessValues(10, 4)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != "2.50" {
		t.Errorf("ProcessValues(10,4) = %q, want %q", result, "2.50")
	}
}

func TestProcessValuesError(t *testing.T) {
	_, err := ProcessValues(10, 0)
	if err == nil {
		t.Error("ProcessValues(10,0) should propagate divide error")
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
	"strconv"
)

func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func ParseAge(s string) (int, error) {
	age, err := strconv.Atoi(s)
	if err != nil {
		return 0, fmt.Errorf("invalid age: %s", s)
	}
	if age < 0 {
		return 0, fmt.Errorf("age cannot be negative: %d", age)
	}
	return age, nil
}

func ProcessValues(a, b float64) (string, error) {
	result, err := Divide(a, b)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%.2f", result), nil
}`,
  hints: [
    'Create errors with errors.New("message") — don\'t forget to import "errors".',
    'Always check errors immediately: if err != nil { return 0, err }',
    'To propagate: call a function, check its error, return it if non-nil. This is the most common Go pattern.'
  ],
}

export default exercise

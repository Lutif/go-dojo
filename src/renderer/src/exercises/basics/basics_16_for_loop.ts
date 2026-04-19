import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_16_for_loop',
  title: 'For Loop',
  category: 'Basics',
  subcategory: 'Loops',
  difficulty: 'beginner',
  order: 16,
  description: `Go has only one loop keyword: \`for\`. It replaces \`for\`, \`while\`, and \`do-while\` from other languages.

**C-style for loop:**
\`\`\`
for i := 0; i < 10; i++ {
    // runs 10 times
}
\`\`\`

Note: no parentheses around the three clauses, and braces are always required.

Your task: use C-style for loops to implement the functions below.`,
  code: `package main

// SumRange returns the sum of integers from 1 to n (inclusive).
// If n <= 0, return 0.
func SumRange(n int) int {
	// TODO: Use a for loop
	return 0
}

// Factorial returns n! (n factorial).
// 0! = 1, 1! = 1, 5! = 120
func Factorial(n int) int {
	// TODO: Use a for loop
	return 0
}`,
  testCode: `package main

import "testing"

func TestSumRange(t *testing.T) {
	tests := []struct {
		n, want int
	}{
		{5, 15},
		{10, 55},
		{1, 1},
		{0, 0},
		{-3, 0},
	}
	for _, tt := range tests {
		got := SumRange(tt.n)
		if got != tt.want {
			t.Errorf("SumRange(%d) = %d, want %d", tt.n, got, tt.want)
		}
	}
}

func TestFactorial(t *testing.T) {
	tests := []struct {
		n, want int
	}{
		{0, 1},
		{1, 1},
		{5, 120},
		{10, 3628800},
	}
	for _, tt := range tests {
		got := Factorial(tt.n)
		if got != tt.want {
			t.Errorf("Factorial(%d) = %d, want %d", tt.n, got, tt.want)
		}
	}
}`,
  solution: `package main

func SumRange(n int) int {
	sum := 0
	for i := 1; i <= n; i++ {
		sum += i
	}
	return sum
}

func Factorial(n int) int {
	result := 1
	for i := 2; i <= n; i++ {
		result *= i
	}
	return result
}`,
  hints: [
    'C-style for loop: for i := 1; i <= n; i++ { sum += i }',
    'For Factorial, start result at 1 and multiply: result *= i for i from 2 to n.',
    'When n <= 0, the loop condition is immediately false and the loop body never executes.'
  ],
}

export default exercise

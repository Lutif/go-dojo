import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_16_for_loop',
  title: 'For Loop',
  category: 'Basics',
  subcategory: 'Loops',
  difficulty: 'beginner',
  order: 16,
  description: `There is no separate \`while\` or \`do\` keyword in Go: **every** loop is written with \`for\`. The familiar three-part form (init; condition; post) works like in C — the init runs once, the condition is checked before each iteration, the post runs at the end of each iteration. No parentheses are required (or expected) around the three parts, and the body is always in braces. You will use other \`for\` shapes in the next lessons; this one is what you use for indexed counting, accumulators, and "repeat N times" patterns.

\`\`\`
for i := 0; i < 10; i++ {
    // runs 10 times
}
\`\`\`

**Your task:** use a C-style \`for\` in \`SumRange\` and \`Factorial\` to match the comment behavior.`,
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

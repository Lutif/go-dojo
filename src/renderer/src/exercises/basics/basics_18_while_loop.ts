import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_18_while_loop',
  title: 'While Loop',
  category: 'Basics',
  subcategory: 'Loops',
  difficulty: 'beginner',
  order: 18,
  description: `Go doesn't have a \`while\` keyword. Instead, use \`for\` with just a condition:

\`\`\`
n := 1
for n < 100 {
    n *= 2
}
// n is now 128
\`\`\`

For infinite loops, use \`for { ... }\` with a \`break\` to exit.

Your task: implement the functions using while-style for loops.`,
  code: `package main

// CollatzSteps counts the number of steps to reach 1
// using the Collatz sequence:
//   if n is even: n = n / 2
//   if n is odd:  n = 3*n + 1
// Returns the number of steps. For n=1, returns 0.
func CollatzSteps(n int) int {
	// TODO: Use a while-style for loop
	return 0
}

// Digits returns the number of digits in a positive integer.
// Example: Digits(42) returns 2, Digits(1000) returns 4
func Digits(n int) int {
	// TODO: Use a while-style for loop
	// Hint: keep dividing by 10
	return 0
}`,
  testCode: `package main

import "testing"

func TestCollatzSteps(t *testing.T) {
	tests := []struct {
		n, want int
	}{
		{1, 0},
		{2, 1},
		{6, 8},
		{27, 111},
	}
	for _, tt := range tests {
		got := CollatzSteps(tt.n)
		if got != tt.want {
			t.Errorf("CollatzSteps(%d) = %d, want %d", tt.n, got, tt.want)
		}
	}
}

func TestDigits(t *testing.T) {
	tests := []struct {
		n, want int
	}{
		{1, 1},
		{9, 1},
		{10, 2},
		{42, 2},
		{999, 3},
		{1000, 4},
	}
	for _, tt := range tests {
		got := Digits(tt.n)
		if got != tt.want {
			t.Errorf("Digits(%d) = %d, want %d", tt.n, got, tt.want)
		}
	}
}`,
  solution: `package main

func CollatzSteps(n int) int {
	steps := 0
	for n != 1 {
		if n%2 == 0 {
			n = n / 2
		} else {
			n = 3*n + 1
		}
		steps++
	}
	return steps
}

func Digits(n int) int {
	count := 0
	for n > 0 {
		n /= 10
		count++
	}
	return count
}`,
  hints: [
    'While-style: for n != 1 { ... } — keeps looping until n equals 1.',
    'For Collatz, check if n is even with n%2 == 0, then apply the appropriate rule.',
    'For Digits, divide n by 10 repeatedly and count how many times you can do it before reaching 0.'
  ],
}

export default exercise

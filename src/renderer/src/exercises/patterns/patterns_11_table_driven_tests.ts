import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_11_table_driven_tests',
  title: 'Table Driven Tests',
  category: 'Patterns',
  subcategory: 'Testing',
  difficulty: 'intermediate',
  order: 11,
  description: `Table-driven tests are Go's idiomatic approach to testing functions with many input/output combinations. Instead of writing separate test functions, you define a slice of test cases and loop through them:

\`\`\`go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"zero", 0, 0, 0},
        {"negative", -1, -2, -3},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
\`\`\`

Your task: implement three functions and write their table-driven tests in the test file.

1. Implement \`FizzBuzz(n int) string\`:
   - Returns "FizzBuzz" if divisible by both 3 and 5
   - Returns "Fizz" if divisible by 3 only
   - Returns "Buzz" if divisible by 5 only
   - Returns the number as a string otherwise (use \`fmt.Sprintf\`)

2. Implement \`Fibonacci(n int) int\`:
   - Returns the nth Fibonacci number (0-indexed: F(0)=0, F(1)=1, F(2)=1, F(3)=2, ...)

3. Implement \`IsPalindrome(s string) bool\`:
   - Returns true if the string reads the same forwards and backwards (case-sensitive)`,
  code: `package main

import "fmt"

// Ensure fmt is used
var _ = fmt.Sprintf

// TODO: Implement FizzBuzz(n int) string
// - Divisible by 15 -> "FizzBuzz"
// - Divisible by 3  -> "Fizz"
// - Divisible by 5  -> "Buzz"
// - Otherwise       -> number as string (fmt.Sprintf("%d", n))

// TODO: Implement Fibonacci(n int) int
// F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)

// TODO: Implement IsPalindrome(s string) bool
// Check if s reads the same forwards and backwards

func main() {}`,
  testCode: `package main

import "testing"

func TestFizzBuzz(t *testing.T) {
	tests := []struct {
		name string
		n    int
		want string
	}{
		{"one", 1, "1"},
		{"two", 2, "2"},
		{"fizz_3", 3, "Fizz"},
		{"four", 4, "4"},
		{"buzz_5", 5, "Buzz"},
		{"fizz_6", 6, "Fizz"},
		{"seven", 7, "7"},
		{"buzz_10", 10, "Buzz"},
		{"fizzbuzz_15", 15, "FizzBuzz"},
		{"fizzbuzz_30", 30, "FizzBuzz"},
		{"fizz_9", 9, "Fizz"},
		{"buzz_20", 20, "Buzz"},
		{"fizzbuzz_45", 45, "FizzBuzz"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := FizzBuzz(tt.n)
			if got != tt.want {
				t.Errorf("FizzBuzz(%d) = %q, want %q", tt.n, got, tt.want)
			}
		})
	}
}

func TestFibonacci(t *testing.T) {
	tests := []struct {
		name string
		n    int
		want int
	}{
		{"fib_0", 0, 0},
		{"fib_1", 1, 1},
		{"fib_2", 2, 1},
		{"fib_3", 3, 2},
		{"fib_4", 4, 3},
		{"fib_5", 5, 5},
		{"fib_6", 6, 8},
		{"fib_7", 7, 13},
		{"fib_10", 10, 55},
		{"fib_15", 15, 610},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := Fibonacci(tt.n)
			if got != tt.want {
				t.Errorf("Fibonacci(%d) = %d, want %d", tt.n, got, tt.want)
			}
		})
	}
}

func TestIsPalindrome(t *testing.T) {
	tests := []struct {
		name string
		s    string
		want bool
	}{
		{"empty", "", true},
		{"single_char", "a", true},
		{"racecar", "racecar", true},
		{"madam", "madam", true},
		{"hello", "hello", false},
		{"ab", "ab", false},
		{"aba", "aba", true},
		{"abba", "abba", true},
		{"abca", "abca", false},
		{"case_sensitive", "Racecar", false},
		{"spaces_matter", "a b a", true},
		{"noon", "noon", true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := IsPalindrome(tt.s)
			if got != tt.want {
				t.Errorf("IsPalindrome(%q) = %v, want %v", tt.s, got, tt.want)
			}
		})
	}
}`,
  solution: `package main

import "fmt"

func FizzBuzz(n int) string {
	if n%15 == 0 {
		return "FizzBuzz"
	}
	if n%3 == 0 {
		return "Fizz"
	}
	if n%5 == 0 {
		return "Buzz"
	}
	return fmt.Sprintf("%d", n)
}

func Fibonacci(n int) int {
	if n <= 0 {
		return 0
	}
	if n == 1 {
		return 1
	}
	a, b := 0, 1
	for i := 2; i <= n; i++ {
		a, b = b, a+b
	}
	return b
}

func IsPalindrome(s string) bool {
	runes := []rune(s)
	n := len(runes)
	for i := 0; i < n/2; i++ {
		if runes[i] != runes[n-1-i] {
			return false
		}
	}
	return true
}

func main() {}`,
  hints: [
    'FizzBuzz: check divisibility by 15 first (both 3 and 5), then 3, then 5.',
    'Fibonacci: use an iterative approach with two variables a and b, starting at 0 and 1.',
    'IsPalindrome: convert to []rune and compare characters from both ends moving inward.',
    'The tests use t.Run(name, func(t *testing.T){...}) for named subtests.',
  ],
}

export default exercise

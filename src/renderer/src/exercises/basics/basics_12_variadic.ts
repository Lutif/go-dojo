import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_12_variadic',
  title: 'Variadic Functions',
  category: 'Basics',
  subcategory: 'Functions',
  difficulty: 'beginner',
  order: 12,
  description: `A **variadic** parameter is written as the last parameter with \`...Type\` — callers may pass **zero, one, or many** arguments, and the function body sees a **slice** of that element type (for example \`...int\` becomes \`[]int\` inside the function). That is how you write helpers like "sum or join any number of things" without a separate overload for every arity. You can also unpack an existing slice at the call site with the same three dots: \`Sum(list...)\` if \`list\` is a \`[]int\` and \`Sum\` takes \`...int\`.

\`\`\`
func PrintAll(args ...string) {
    for _, s := range args {
        fmt.Println(s)
    }
}
PrintAll("a", "b", "c")
\`\`\`

**Your task:** implement \`Sum\` and \`JoinWith\` using a variadic parameter in the right place in each signature.`,
  code: `package main

// Sum returns the sum of all provided integers.
// It should return 0 if no arguments are given.
func Sum(nums ...int) int {
	// TODO
	return 0
}

// JoinWith joins all strings with the given separator.
// Example: JoinWith("-", "a", "b", "c") returns "a-b-c"
func JoinWith(sep string, parts ...string) string {
	// TODO
	return ""
}`,
  testCode: `package main

import "testing"

func TestSum(t *testing.T) {
	tests := []struct {
		name string
		nums []int
		want int
	}{
		{"multiple", []int{1, 2, 3, 4, 5}, 15},
		{"single", []int{42}, 42},
		{"none", []int{}, 0},
		{"negatives", []int{-1, -2, 3}, 0},
	}
	for _, tt := range tests {
		got := Sum(tt.nums...)
		if got != tt.want {
			t.Errorf("Sum(%v) = %d, want %d", tt.nums, got, tt.want)
		}
	}
}

func TestJoinWith(t *testing.T) {
	got := JoinWith("-", "a", "b", "c")
	if got != "a-b-c" {
		t.Errorf("JoinWith(-,a,b,c) = %q, want %q", got, "a-b-c")
	}
	got2 := JoinWith(", ", "Go", "is", "fun")
	if got2 != "Go, is, fun" {
		t.Errorf("JoinWith(', ',Go,is,fun) = %q, want %q", got2, "Go, is, fun")
	}
	got3 := JoinWith("-", "solo")
	if got3 != "solo" {
		t.Errorf("JoinWith(-,solo) = %q, want %q", got3, "solo")
	}
	got4 := JoinWith("-")
	if got4 != "" {
		t.Errorf("JoinWith(-) = %q, want empty string", got4)
	}
}`,
  solution: `package main

func Sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func JoinWith(sep string, parts ...string) string {
	result := ""
	for i, p := range parts {
		if i > 0 {
			result += sep
		}
		result += p
	}
	return result
}`,
  hints: [
    'The variadic parameter nums ...int becomes a []int slice inside the function — loop over it with for range.',
    'For JoinWith, add the separator before each part except the first (when i > 0).',
    'You can mix regular and variadic parameters, but the variadic must be last: func(sep string, parts ...string)'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_22_math_rand',
  title: 'math/rand',
  category: 'Standard Library',
  subcategory: 'Math',
  difficulty: 'beginner',
  order: 22,
  description: `The \`math/rand\` package generates pseudo-random numbers:

\`\`\`
n := rand.Intn(100)         // [0, 100)
f := rand.Float64()         // [0.0, 1.0)
perm := rand.Perm(5)        // random permutation of [0,1,2,3,4]

// Custom source for reproducible sequences
src := rand.NewSource(42)
r := rand.New(src)
r.Intn(10)                  // deterministic with seed 42
\`\`\`

Go 1.20+ automatically seeds the global source, so \`rand.Seed()\` is no longer needed.

**Note:** \`math/rand\` is NOT cryptographically secure. Use \`crypto/rand\` for security-sensitive work.

Your task: use random number generation for common tasks.`,
  code: `package main

import (
	"math/rand"
)

// RollDice returns a random number between 1 and sides (inclusive).
func RollDice(sides int) int {
	// TODO
	return 0
}

// Shuffle returns a new slice with elements in random order.
// Do not modify the original slice.
func Shuffle(items []string) []string {
	// TODO: Use rand.Perm or rand.Shuffle
	return nil
}

// RandomString generates a random string of length n using the given charset.
// Use the provided *rand.Rand for deterministic output.
func RandomString(r *rand.Rand, n int, charset string) string {
	// TODO: Pick random chars from charset
	return ""
}

// WeightedChoice picks a random index based on weights.
// weights[i] is the relative probability of choosing index i.
// Use the provided *rand.Rand.
func WeightedChoice(r *rand.Rand, weights []float64) int {
	// TODO: Compute cumulative weights, pick a random point
	return 0
}

var _ = rand.Intn`,
  testCode: `package main

import (
	"math/rand"
	"testing"
)

func TestRollDice(t *testing.T) {
	for i := 0; i < 100; i++ {
		got := RollDice(6)
		if got < 1 || got > 6 {
			t.Fatalf("RollDice(6) = %d, out of range [1,6]", got)
		}
	}
}

func TestRollDice20(t *testing.T) {
	for i := 0; i < 100; i++ {
		got := RollDice(20)
		if got < 1 || got > 20 {
			t.Fatalf("RollDice(20) = %d, out of range [1,20]", got)
		}
	}
}

func TestShuffle(t *testing.T) {
	original := []string{"a", "b", "c", "d", "e"}
	shuffled := Shuffle(original)

	if len(shuffled) != len(original) {
		t.Fatalf("length changed: %d vs %d", len(shuffled), len(original))
	}

	// Check original is not modified
	if original[0] != "a" || original[4] != "e" {
		t.Error("original slice was modified")
	}

	// Check all elements present
	seen := map[string]bool{}
	for _, s := range shuffled {
		seen[s] = true
	}
	for _, s := range original {
		if !seen[s] {
			t.Errorf("missing element %q", s)
		}
	}
}

func TestRandomString(t *testing.T) {
	r := rand.New(rand.NewSource(42))
	got := RandomString(r, 10, "abc")
	if len(got) != 10 {
		t.Fatalf("length = %d, want 10", len(got))
	}
	for _, c := range got {
		if c != 'a' && c != 'b' && c != 'c' {
			t.Errorf("unexpected char %c", c)
		}
	}
}

func TestRandomStringDeterministic(t *testing.T) {
	r1 := rand.New(rand.NewSource(99))
	r2 := rand.New(rand.NewSource(99))
	s1 := RandomString(r1, 20, "abcdef")
	s2 := RandomString(r2, 20, "abcdef")
	if s1 != s2 {
		t.Errorf("same seed produced different strings: %q vs %q", s1, s2)
	}
}

func TestWeightedChoice(t *testing.T) {
	r := rand.New(rand.NewSource(42))
	weights := []float64{1, 0, 0}
	// Weight 1 only on index 0
	for i := 0; i < 50; i++ {
		got := WeightedChoice(r, weights)
		if got != 0 {
			t.Fatalf("expected 0, got %d", got)
		}
	}
}

func TestWeightedChoiceDistribution(t *testing.T) {
	r := rand.New(rand.NewSource(42))
	weights := []float64{0, 0, 1}
	for i := 0; i < 50; i++ {
		got := WeightedChoice(r, weights)
		if got != 2 {
			t.Fatalf("expected 2, got %d", got)
		}
	}
}`,
  solution: `package main

import (
	"math/rand"
)

func RollDice(sides int) int {
	return rand.Intn(sides) + 1
}

func Shuffle(items []string) []string {
	result := make([]string, len(items))
	copy(result, items)
	rand.Shuffle(len(result), func(i, j int) {
		result[i], result[j] = result[j], result[i]
	})
	return result
}

func RandomString(r *rand.Rand, n int, charset string) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = charset[r.Intn(len(charset))]
	}
	return string(b)
}

func WeightedChoice(r *rand.Rand, weights []float64) int {
	total := 0.0
	for _, w := range weights {
		total += w
	}
	pick := r.Float64() * total
	cumulative := 0.0
	for i, w := range weights {
		cumulative += w
		if pick < cumulative {
			return i
		}
	}
	return len(weights) - 1
}

var _ = rand.Intn`,
  hints: [
    'RollDice: rand.Intn(sides) gives [0, sides). Add 1 to get [1, sides].',
    'Shuffle: copy the slice first, then use rand.Shuffle with a swap function.',
    'WeightedChoice: sum all weights, pick a random float in [0, total), walk cumulative sums to find the chosen index.'
  ],
}

export default exercise

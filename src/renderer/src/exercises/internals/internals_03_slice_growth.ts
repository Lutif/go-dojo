import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_03_slice_growth',
  title: 'Slice Growth',
  category: 'Internals',
  subcategory: 'Memory',
  difficulty: 'advanced',
  order: 3,
  description: `When \`append\` exceeds a slice's capacity, Go allocates a new, larger backing array:

\`\`\`
s := make([]int, 0, 2)  // cap=2
s = append(s, 1, 2)     // cap=2, fits
s = append(s, 3)         // cap grows! new allocation
\`\`\`

Growth strategy (Go 1.21+):
- Small slices: roughly double
- Large slices (>256): grow by ~25% + 192

Pre-allocating with \`make([]T, 0, expectedSize)\` avoids repeated reallocations.

Your task: observe and predict slice growth behavior.`,
  code: `package main

// GrowthCapacities appends n elements one-at-a-time to an empty slice,
// recording the capacity each time it changes.
// Return the list of distinct capacities observed.
func GrowthCapacities(n int) []int {
	// TODO: Start with nil slice, append 1..n, track cap changes
	return nil
}

// CountAllocations counts how many times the backing array changes
// when appending n elements one-at-a-time to an empty slice.
func CountAllocations(n int) int {
	// TODO: Compare cap before and after each append
	return 0
}

// PreallocatedAppend appends n elements to a pre-allocated slice.
// Returns the number of backing array changes (should be 0).
func PreallocatedAppend(n int) int {
	// TODO: make([]int, 0, n) then append
	return 0
}`,
  testCode: `package main

import "testing"

func TestGrowthCapacities(t *testing.T) {
	caps := GrowthCapacities(10)
	if len(caps) < 2 {
		t.Fatalf("expected multiple capacity changes, got %d", len(caps))
	}
	// First cap should be small
	if caps[0] > 2 {
		t.Errorf("first cap = %d, expected <= 2", caps[0])
	}
	// Each cap should be larger than previous
	for i := 1; i < len(caps); i++ {
		if caps[i] <= caps[i-1] {
			t.Errorf("caps[%d]=%d <= caps[%d]=%d", i, caps[i], i-1, caps[i-1])
		}
	}
}

func TestCountAllocations(t *testing.T) {
	allocs := CountAllocations(100)
	if allocs < 5 || allocs > 20 {
		t.Errorf("expected 5-20 allocations for 100 elements, got %d", allocs)
	}
}

func TestPreallocatedAppend(t *testing.T) {
	allocs := PreallocatedAppend(100)
	if allocs != 0 {
		t.Errorf("preallocated should have 0 reallocations, got %d", allocs)
	}
}

func TestGrowthCapacitiesLarge(t *testing.T) {
	caps := GrowthCapacities(1000)
	last := caps[len(caps)-1]
	if last < 1000 {
		t.Errorf("final cap %d < 1000", last)
	}
}`,
  solution: `package main

func GrowthCapacities(n int) []int {
	var s []int
	var caps []int
	lastCap := 0
	for i := 0; i < n; i++ {
		s = append(s, i)
		if cap(s) != lastCap {
			lastCap = cap(s)
			caps = append(caps, lastCap)
		}
	}
	return caps
}

func CountAllocations(n int) int {
	var s []int
	count := 0
	lastCap := 0
	for i := 0; i < n; i++ {
		s = append(s, i)
		if cap(s) != lastCap {
			lastCap = cap(s)
			count++
		}
	}
	return count
}

func PreallocatedAppend(n int) int {
	s := make([]int, 0, n)
	count := 0
	lastCap := cap(s)
	for i := 0; i < n; i++ {
		s = append(s, i)
		if cap(s) != lastCap {
			lastCap = cap(s)
			count++
		}
	}
	return count
}`,
  hints: [
    'GrowthCapacities: append in a loop, track cap(s) after each append. Record when it changes.',
    'CountAllocations: same loop, just count how many times cap changes.',
    'PreallocatedAppend: make([]int, 0, n) gives enough capacity upfront — zero reallocations.'
  ],
}

export default exercise

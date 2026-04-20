import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_05_bloom_filter',
  title: 'Bloom Filter',
  category: 'Data & Storage',
  subcategory: 'Probabilistic Structures',
  difficulty: 'advanced',
  order: 5,
  description: `Build a Bloom filter for space-efficient membership testing. A Bloom filter can tell you "definitely not in set" or "probably in set" -- it never has false negatives but may have false positives.

It works by using multiple hash functions to set bits in a bit array:

\`\`\`
type BloomFilter struct {
    bits    []bool
    size    uint
    hashFns int   // number of hash functions
}
\`\`\`

\`Add(item)\` hashes the item with each hash function and sets those bit positions. \`Contains(item)\` checks if all corresponding bits are set.

Use a simple hashing strategy: for hash function i, compute \`hash(item, i)\` using \`hash/fnv\` with the seed mixed in:

\`\`\`
func hashN(item string, seed int, size uint) uint {
    h := fnv.New64a()
    h.Write([]byte(item))
    h.Write([]byte{byte(seed)})
    return uint(h.Sum64()) % size
}
\`\`\`

Implement:
- \`NewBloomFilter(size uint, hashFns int)\` - creates a filter
- \`Add(item string)\` - adds an item
- \`Contains(item string) bool\` - tests membership (may have false positives)`,
  code: `package main

import "hash/fnv"

// BloomFilter is a probabilistic set membership data structure.
type BloomFilter struct {
	// TODO: Add bits slice, size, and hashFns count
}

// NewBloomFilter creates a Bloom filter with the given bit size and number of hash functions.
func NewBloomFilter(size uint, hashFns int) *BloomFilter {
	// TODO
	return nil
}

// Add inserts an item into the Bloom filter.
func (bf *BloomFilter) Add(item string) {
	// TODO: For each hash function, compute position and set bit
}

// Contains checks if an item might be in the set.
// Returns true if all hash positions are set (may be false positive).
// Returns false if any position is not set (definitely not in set).
func (bf *BloomFilter) Contains(item string) bool {
	// TODO: Check all hash positions
	return false
}

// hashN computes the nth hash of an item, returning a position in the bit array.
func hashN(item string, seed int, size uint) uint {
	// TODO: Use fnv.New64a(), write item bytes and seed byte, return mod size
	return 0
}

var _ = fnv.New64a

func main() {}`,
  testCode: `package main

import "testing"

func TestBloomAddContains(t *testing.T) {
	bf := NewBloomFilter(1000, 3)
	bf.Add("hello")
	bf.Add("world")

	if !bf.Contains("hello") {
		t.Error("Contains(hello) should be true")
	}
	if !bf.Contains("world") {
		t.Error("Contains(world) should be true")
	}
}

func TestBloomDefinitelyNot(t *testing.T) {
	bf := NewBloomFilter(1000, 3)
	bf.Add("apple")
	bf.Add("banana")

	// Items never added should (almost certainly) not be found with a large filter
	if bf.Contains("cherry") {
		t.Log("false positive for cherry (rare but possible)")
	}
	if bf.Contains("grape") {
		t.Log("false positive for grape (rare but possible)")
	}
}

func TestBloomNoFalseNegatives(t *testing.T) {
	bf := NewBloomFilter(10000, 5)
	items := []string{"alpha", "beta", "gamma", "delta", "epsilon",
		"zeta", "eta", "theta", "iota", "kappa"}
	for _, item := range items {
		bf.Add(item)
	}
	for _, item := range items {
		if !bf.Contains(item) {
			t.Errorf("Contains(%q) = false, bloom filters must not have false negatives", item)
		}
	}
}

func TestBloomEmptyFilter(t *testing.T) {
	bf := NewBloomFilter(100, 3)
	if bf.Contains("anything") {
		t.Error("empty filter should not contain anything")
	}
}

func TestBloomFalsePositiveRate(t *testing.T) {
	bf := NewBloomFilter(10000, 5)
	for i := 0; i < 100; i++ {
		bf.Add(string(rune('A' + i)))
	}

	falsePositives := 0
	tests := 10000
	for i := 0; i < tests; i++ {
		// test items we never added (use large offset to avoid collisions)
		item := "nonexistent_" + string(rune(i+5000))
		if bf.Contains(item) {
			falsePositives++
		}
	}

	rate := float64(falsePositives) / float64(tests)
	if rate > 0.1 {
		t.Errorf("false positive rate %.2f is too high (expected < 0.10)", rate)
	}
}`,
  solution: `package main

import "hash/fnv"

type BloomFilter struct {
	bits    []bool
	size    uint
	hashFns int
}

func NewBloomFilter(size uint, hashFns int) *BloomFilter {
	return &BloomFilter{
		bits:    make([]bool, size),
		size:    size,
		hashFns: hashFns,
	}
}

func (bf *BloomFilter) Add(item string) {
	for i := 0; i < bf.hashFns; i++ {
		pos := hashN(item, i, bf.size)
		bf.bits[pos] = true
	}
}

func (bf *BloomFilter) Contains(item string) bool {
	for i := 0; i < bf.hashFns; i++ {
		pos := hashN(item, i, bf.size)
		if !bf.bits[pos] {
			return false
		}
	}
	return true
}

func hashN(item string, seed int, size uint) uint {
	h := fnv.New64a()
	h.Write([]byte(item))
	h.Write([]byte{byte(seed)})
	return uint(h.Sum64()) % size
}

func main() {}`,
  hints: [
    'The bits field is a []bool slice of the given size. Each hash function sets one position.',
    'hashN: create fnv.New64a(), write the item bytes, then write byte(seed) to differentiate hash functions.',
    'Contains must check ALL hash positions. If any is false, the item is definitely not in the set.',
  ],
}

export default exercise

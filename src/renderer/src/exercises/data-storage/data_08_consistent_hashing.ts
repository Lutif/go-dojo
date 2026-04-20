import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_08_consistent_hashing',
  title: 'Consistent Hashing',
  category: 'Data & Storage',
  subcategory: 'Distributed Systems',
  difficulty: 'expert',
  order: 8,
  description: `Implement a consistent hashing ring for distributing keys across nodes. Consistent hashing minimizes key remapping when nodes are added or removed, making it fundamental to distributed caches and databases.

The ring maps both nodes and keys to positions on a circular hash space. Each real node gets multiple virtual nodes (replicas) for better distribution:

\`\`\`
type Ring struct {
    nodes       map[uint32]string   // hash -> node name
    sortedKeys  []uint32            // sorted hash values
    replicas    int                 // virtual nodes per real node
}
\`\`\`

A key maps to the first node clockwise from its hash position. Use \`crc32.ChecksumIEEE\` for hashing.

Implement:
- \`NewRing(replicas int)\` - creates a ring with the given number of virtual nodes per real node
- \`AddNode(name string)\` - adds a node with its virtual nodes
- \`RemoveNode(name string)\` - removes a node and its virtual nodes
- \`GetNode(key string) string\` - returns the node responsible for the given key
- \`NodeCount() int\` - returns the number of distinct real nodes`,
  code: `package main

import (
	"hash/crc32"
	"sort"
	"strconv"
)

// Ring is a consistent hashing ring.
type Ring struct {
	// TODO: Add nodes map (hash -> node name), sortedKeys, and replicas count
}

// NewRing creates a consistent hashing ring with the given number of replicas.
func NewRing(replicas int) *Ring {
	// TODO
	return nil
}

// AddNode adds a node with virtual nodes to the ring.
// Virtual node keys are formed as: name + "-" + strconv.Itoa(i) for i in 0..replicas-1
func (r *Ring) AddNode(name string) {
	// TODO: Hash each virtual node key and add to ring
}

// RemoveNode removes a node and all its virtual nodes from the ring.
func (r *Ring) RemoveNode(name string) {
	// TODO: Remove all virtual node hashes, rebuild sortedKeys
}

// GetNode returns the node responsible for the given key.
// Returns "" if the ring is empty.
func (r *Ring) GetNode(key string) string {
	// TODO: Hash the key, binary search for first node >= hash
	return ""
}

// NodeCount returns the number of distinct real nodes on the ring.
func (r *Ring) NodeCount() int {
	// TODO
	return 0
}

// hashKey computes the hash of a string.
func hashKey(key string) uint32 {
	return crc32.ChecksumIEEE([]byte(key))
}

var _ = sort.SearchInts
var _ = strconv.Itoa

func main() {}`,
  testCode: `package main

import "testing"

func TestRingAddAndGet(t *testing.T) {
	ring := NewRing(10)
	ring.AddNode("node-A")
	ring.AddNode("node-B")
	ring.AddNode("node-C")

	if ring.NodeCount() != 3 {
		t.Errorf("NodeCount() = %d, want 3", ring.NodeCount())
	}

	// Every key should map to some node
	for _, key := range []string{"user:1", "user:2", "order:100", "session:xyz"} {
		node := ring.GetNode(key)
		if node == "" {
			t.Errorf("GetNode(%q) returned empty string", key)
		}
	}
}

func TestRingConsistency(t *testing.T) {
	ring := NewRing(50)
	ring.AddNode("A")
	ring.AddNode("B")
	ring.AddNode("C")

	// Same key should always map to same node
	node1 := ring.GetNode("test-key")
	node2 := ring.GetNode("test-key")
	if node1 != node2 {
		t.Errorf("same key mapped to different nodes: %q vs %q", node1, node2)
	}
}

func TestRingDistribution(t *testing.T) {
	ring := NewRing(100)
	ring.AddNode("A")
	ring.AddNode("B")
	ring.AddNode("C")

	counts := map[string]int{}
	for i := 0; i < 1000; i++ {
		key := "key-" + string(rune(i))
		node := ring.GetNode(key)
		counts[node]++
	}

	// Each node should get some keys (not all to one)
	if len(counts) < 2 {
		t.Errorf("poor distribution: only %d nodes received keys", len(counts))
	}
}

func TestRingRemoveNode(t *testing.T) {
	ring := NewRing(10)
	ring.AddNode("A")
	ring.AddNode("B")
	ring.AddNode("C")

	ring.RemoveNode("B")
	if ring.NodeCount() != 2 {
		t.Errorf("after remove NodeCount() = %d, want 2", ring.NodeCount())
	}

	// All keys should still map to A or C
	for i := 0; i < 100; i++ {
		key := "item-" + string(rune(i))
		node := ring.GetNode(key)
		if node != "A" && node != "C" {
			t.Errorf("GetNode(%q) = %q, want A or C", key, node)
		}
	}
}

func TestRingMinimalRemapping(t *testing.T) {
	ring := NewRing(50)
	ring.AddNode("A")
	ring.AddNode("B")

	keys := make([]string, 100)
	before := make([]string, 100)
	for i := range keys {
		keys[i] = "k-" + string(rune(i+100))
		before[i] = ring.GetNode(keys[i])
	}

	ring.AddNode("C") // add a third node

	remapped := 0
	for i, key := range keys {
		after := ring.GetNode(key)
		if after != before[i] {
			remapped++
		}
	}

	// With consistent hashing, only a fraction should remap
	if remapped > 60 {
		t.Errorf("too many keys remapped: %d/100 (expected much less)", remapped)
	}
}

func TestRingEmpty(t *testing.T) {
	ring := NewRing(10)
	if ring.GetNode("key") != "" {
		t.Error("GetNode on empty ring should return empty string")
	}
	if ring.NodeCount() != 0 {
		t.Errorf("NodeCount on empty ring = %d, want 0", ring.NodeCount())
	}
}`,
  solution: `package main

import (
	"hash/crc32"
	"sort"
	"strconv"
)

type Ring struct {
	nodes      map[uint32]string
	sortedKeys []uint32
	replicas   int
	realNodes  map[string]bool
}

func NewRing(replicas int) *Ring {
	return &Ring{
		nodes:     make(map[uint32]string),
		replicas:  replicas,
		realNodes: make(map[string]bool),
	}
}

func (r *Ring) AddNode(name string) {
	r.realNodes[name] = true
	for i := 0; i < r.replicas; i++ {
		h := hashKey(name + "-" + strconv.Itoa(i))
		r.nodes[h] = name
		r.sortedKeys = append(r.sortedKeys, h)
	}
	sort.Slice(r.sortedKeys, func(i, j int) bool {
		return r.sortedKeys[i] < r.sortedKeys[j]
	})
}

func (r *Ring) RemoveNode(name string) {
	delete(r.realNodes, name)
	for i := 0; i < r.replicas; i++ {
		h := hashKey(name + "-" + strconv.Itoa(i))
		delete(r.nodes, h)
	}
	// rebuild sortedKeys
	r.sortedKeys = r.sortedKeys[:0]
	for h := range r.nodes {
		r.sortedKeys = append(r.sortedKeys, h)
	}
	sort.Slice(r.sortedKeys, func(i, j int) bool {
		return r.sortedKeys[i] < r.sortedKeys[j]
	})
}

func (r *Ring) GetNode(key string) string {
	if len(r.sortedKeys) == 0 {
		return ""
	}
	h := hashKey(key)
	idx := sort.Search(len(r.sortedKeys), func(i int) bool {
		return r.sortedKeys[i] >= h
	})
	if idx >= len(r.sortedKeys) {
		idx = 0 // wrap around
	}
	return r.nodes[r.sortedKeys[idx]]
}

func (r *Ring) NodeCount() int {
	return len(r.realNodes)
}

func hashKey(key string) uint32 {
	return crc32.ChecksumIEEE([]byte(key))
}

func main() {}`,
  hints: [
    'Create virtual nodes by hashing name + "-" + strconv.Itoa(i) for i in 0..replicas-1.',
    'Keep sortedKeys sorted. Use sort.Search (binary search) to find the first hash >= the key hash.',
    'If the search index equals len(sortedKeys), wrap around to index 0 (circular ring).',
  ],
}

export default exercise

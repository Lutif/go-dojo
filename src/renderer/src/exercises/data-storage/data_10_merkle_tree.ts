import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_10_merkle_tree',
  title: 'Merkle Tree',
  category: 'Data & Storage',
  subcategory: 'Integrity Verification',
  difficulty: 'expert',
  order: 10,
  description: `Build a Merkle tree for efficient data integrity verification. Merkle trees are used in Git, blockchains, and distributed systems to detect data tampering.

A Merkle tree is a binary tree where:
- Leaf nodes contain the hash of a data block
- Internal nodes contain the hash of their two children's hashes concatenated
- The root hash represents the entire dataset

\`\`\`
         root = H(H01 + H23)
        /                  \\
   H01 = H(H0+H1)     H23 = H(H2+H3)
    /       \\           /       \\
  H0=H(d0)  H1=H(d1)  H2=H(d2)  H3=H(d3)
\`\`\`

If the number of data blocks is odd, duplicate the last block. Use \`crypto/sha256\` for hashing.

Implement:
- \`NewMerkleTree(data []string)\` - builds a tree from data blocks
- \`RootHash() string\` - returns the hex-encoded root hash
- \`Verify(data []string) bool\` - checks if the given data matches the root hash
- \`FindDifferences(other *MerkleTree) []int\` - returns indices of leaf nodes that differ`,
  code: `package main

import (
	"crypto/sha256"
	"fmt"
)

// MerkleNode represents a node in the Merkle tree.
type MerkleNode struct {
	Left  *MerkleNode
	Right *MerkleNode
	Hash  string
}

// MerkleTree is a binary hash tree for data integrity verification.
type MerkleTree struct {
	Root   *MerkleNode
	Leaves []*MerkleNode
}

// NewMerkleTree builds a Merkle tree from data blocks.
// If the number of blocks is odd, duplicate the last block.
func NewMerkleTree(data []string) *MerkleTree {
	// TODO:
	// 1. Create leaf nodes by hashing each data block
	// 2. If odd number, duplicate the last leaf
	// 3. Pair up nodes and hash pairs until one root remains
	return nil
}

// RootHash returns the hex-encoded root hash.
func (mt *MerkleTree) RootHash() string {
	// TODO
	return ""
}

// Verify builds a new tree from the given data and checks if the root hash matches.
func (mt *MerkleTree) Verify(data []string) bool {
	// TODO
	return false
}

// FindDifferences compares leaf hashes with another tree and returns
// indices of leaves that differ. Both trees must have the same number of leaves.
func (mt *MerkleTree) FindDifferences(other *MerkleTree) []int {
	// TODO: Compare leaf hashes at each index
	return nil
}

// hashData hashes a string and returns its hex-encoded SHA-256 hash.
func hashData(data string) string {
	h := sha256.Sum256([]byte(data))
	return fmt.Sprintf("%x", h)
}

// hashPair concatenates two hashes and returns the hash of the result.
func hashPair(left, right string) string {
	// TODO
	return ""
}

func main() {}`,
  testCode: `package main

import "testing"

func TestMerkleTreeBuild(t *testing.T) {
	tree := NewMerkleTree([]string{"a", "b", "c", "d"})
	if tree.Root == nil {
		t.Fatal("root should not be nil")
	}
	if tree.RootHash() == "" {
		t.Fatal("root hash should not be empty")
	}
	if len(tree.Leaves) != 4 {
		t.Errorf("Leaves count = %d, want 4", len(tree.Leaves))
	}
}

func TestMerkleTreeConsistentHash(t *testing.T) {
	data := []string{"hello", "world", "foo", "bar"}
	tree1 := NewMerkleTree(data)
	tree2 := NewMerkleTree(data)

	if tree1.RootHash() != tree2.RootHash() {
		t.Error("same data should produce same root hash")
	}
}

func TestMerkleTreeDifferentData(t *testing.T) {
	tree1 := NewMerkleTree([]string{"a", "b", "c", "d"})
	tree2 := NewMerkleTree([]string{"a", "b", "c", "e"})

	if tree1.RootHash() == tree2.RootHash() {
		t.Error("different data should produce different root hashes")
	}
}

func TestMerkleTreeVerify(t *testing.T) {
	data := []string{"block1", "block2", "block3", "block4"}
	tree := NewMerkleTree(data)

	if !tree.Verify(data) {
		t.Error("Verify with same data should return true")
	}
	if tree.Verify([]string{"block1", "block2", "block3", "TAMPERED"}) {
		t.Error("Verify with tampered data should return false")
	}
}

func TestMerkleTreeOddData(t *testing.T) {
	tree := NewMerkleTree([]string{"a", "b", "c"})
	if tree.Root == nil {
		t.Fatal("tree with odd data should still build")
	}
	if tree.RootHash() == "" {
		t.Fatal("root hash should not be empty")
	}
}

func TestMerkleTreeFindDifferences(t *testing.T) {
	tree1 := NewMerkleTree([]string{"a", "b", "c", "d"})
	tree2 := NewMerkleTree([]string{"a", "X", "c", "Y"})

	diffs := tree1.FindDifferences(tree2)
	if len(diffs) != 2 {
		t.Fatalf("FindDifferences got %d diffs, want 2", len(diffs))
	}
	if diffs[0] != 1 || diffs[1] != 3 {
		t.Errorf("diffs = %v, want [1, 3]", diffs)
	}
}

func TestMerkleTreeNoDifferences(t *testing.T) {
	data := []string{"x", "y", "z", "w"}
	tree1 := NewMerkleTree(data)
	tree2 := NewMerkleTree(data)

	diffs := tree1.FindDifferences(tree2)
	if len(diffs) != 0 {
		t.Errorf("FindDifferences on identical trees = %v, want []", diffs)
	}
}

func TestMerkleTreeSingleElement(t *testing.T) {
	tree := NewMerkleTree([]string{"only"})
	if tree.RootHash() == "" {
		t.Error("single element tree should have a root hash")
	}
	if !tree.Verify([]string{"only"}) {
		t.Error("Verify with same single element should return true")
	}
}`,
  solution: `package main

import (
	"crypto/sha256"
	"fmt"
)

type MerkleNode struct {
	Left  *MerkleNode
	Right *MerkleNode
	Hash  string
}

type MerkleTree struct {
	Root   *MerkleNode
	Leaves []*MerkleNode
}

func NewMerkleTree(data []string) *MerkleTree {
	if len(data) == 0 {
		return &MerkleTree{}
	}

	var leaves []*MerkleNode
	for _, d := range data {
		leaves = append(leaves, &MerkleNode{Hash: hashData(d)})
	}

	// Duplicate last if odd
	if len(leaves)%2 != 0 {
		leaves = append(leaves, &MerkleNode{Hash: leaves[len(leaves)-1].Hash})
	}

	mt := &MerkleTree{Leaves: leaves}

	nodes := make([]*MerkleNode, len(leaves))
	copy(nodes, leaves)

	for len(nodes) > 1 {
		if len(nodes)%2 != 0 {
			nodes = append(nodes, nodes[len(nodes)-1])
		}
		var next []*MerkleNode
		for i := 0; i < len(nodes); i += 2 {
			parent := &MerkleNode{
				Left:  nodes[i],
				Right: nodes[i+1],
				Hash:  hashPair(nodes[i].Hash, nodes[i+1].Hash),
			}
			next = append(next, parent)
		}
		nodes = next
	}

	mt.Root = nodes[0]
	return mt
}

func (mt *MerkleTree) RootHash() string {
	if mt.Root == nil {
		return ""
	}
	return mt.Root.Hash
}

func (mt *MerkleTree) Verify(data []string) bool {
	other := NewMerkleTree(data)
	return mt.RootHash() == other.RootHash()
}

func (mt *MerkleTree) FindDifferences(other *MerkleTree) []int {
	var diffs []int
	n := len(mt.Leaves)
	if len(other.Leaves) < n {
		n = len(other.Leaves)
	}
	for i := 0; i < n; i++ {
		if mt.Leaves[i].Hash != other.Leaves[i].Hash {
			diffs = append(diffs, i)
		}
	}
	return diffs
}

func hashData(data string) string {
	h := sha256.Sum256([]byte(data))
	return fmt.Sprintf("%x", h)
}

func hashPair(left, right string) string {
	combined := left + right
	h := sha256.Sum256([]byte(combined))
	return fmt.Sprintf("%x", h)
}

func main() {}`,
  hints: [
    'Build bottom-up: create leaf nodes first, then pair them up, hash each pair, and repeat until one root remains.',
    'hashPair concatenates two hex hashes and hashes the result with sha256.',
    'FindDifferences just compares leaf hashes at each index -- no tree traversal needed.',
  ],
}

export default exercise

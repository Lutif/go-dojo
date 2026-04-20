import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_06_skip_list',
  title: 'Skip List',
  category: 'Data & Storage',
  subcategory: 'Search Structures',
  difficulty: 'expert',
  order: 6,
  description: `Implement a simple skip list -- a probabilistic data structure that provides O(log n) search, insert, and delete on sorted data, simpler than balanced trees.

A skip list is a layered linked list. The bottom layer (level 0) contains all elements in sorted order. Higher levels act as "express lanes" that skip over elements:

\`\`\`
Level 2:  head -----------------> 5 ----------------------> nil
Level 1:  head -------> 3 ------> 5 -------> 8 ----------> nil
Level 0:  head -> 1 -> 3 -> 4 -> 5 -> 7 -> 8 -> 9 -> 10 -> nil
\`\`\`

Each node has a \`next\` slice where \`next[i]\` points to the next node at level i. When inserting, a random level is chosen (coin flip, max level capped).

Implement:
- \`NewSkipList()\` - creates an empty skip list
- \`Insert(key int, value string)\` - inserts or updates a key-value pair
- \`Search(key int) (string, bool)\` - finds a value by key
- \`Delete(key int) bool\` - removes a key, returns true if it existed`,
  code: `package main

import "math/rand"

const maxLevel = 16

// skipNode represents a node in the skip list.
type skipNode struct {
	key   int
	value string
	next  []*skipNode // next[i] is the next node at level i
}

// SkipList is a probabilistic sorted data structure.
type SkipList struct {
	head  *skipNode
	level int // current max level in use
}

// NewSkipList creates an empty skip list.
func NewSkipList() *SkipList {
	// TODO: Create head sentinel with maxLevel next pointers
	return nil
}

// randomLevel returns a random level for a new node (1 to maxLevel).
// Each level has a 50% chance of being promoted.
func randomLevel() int {
	lvl := 1
	for lvl < maxLevel && rand.Float64() < 0.5 {
		lvl++
	}
	return lvl
}

// Insert adds or updates a key-value pair.
func (sl *SkipList) Insert(key int, value string) {
	// TODO:
	// 1. Find update[i] = the last node at level i before the insertion point
	// 2. If key exists, update value
	// 3. Otherwise, create node with random level and splice into each level
}

// Search finds a value by key.
func (sl *SkipList) Search(key int) (string, bool) {
	// TODO: Traverse from top level down, following next pointers
	return "", false
}

// Delete removes a key from the skip list. Returns true if it existed.
func (sl *SkipList) Delete(key int) bool {
	// TODO:
	// 1. Find update[i] for each level
	// 2. If key found, unlink from each level
	// 3. Reduce sl.level if top levels are now empty
	return false
}

var _ = rand.Float64

func main() {}`,
  testCode: `package main

import (
	"math/rand"
	"testing"
)

func TestSkipListInsertSearch(t *testing.T) {
	sl := NewSkipList()
	sl.Insert(3, "three")
	sl.Insert(1, "one")
	sl.Insert(5, "five")
	sl.Insert(2, "two")

	tests := []struct {
		key  int
		want string
	}{
		{1, "one"}, {2, "two"}, {3, "three"}, {5, "five"},
	}
	for _, tt := range tests {
		val, ok := sl.Search(tt.key)
		if !ok || val != tt.want {
			t.Errorf("Search(%d) = (%q, %v), want (%q, true)", tt.key, val, ok, tt.want)
		}
	}
}

func TestSkipListSearchMiss(t *testing.T) {
	sl := NewSkipList()
	sl.Insert(1, "one")
	_, ok := sl.Search(99)
	if ok {
		t.Error("Search(99) should return false")
	}
}

func TestSkipListUpdate(t *testing.T) {
	sl := NewSkipList()
	sl.Insert(1, "one")
	sl.Insert(1, "ONE")
	val, ok := sl.Search(1)
	if !ok || val != "ONE" {
		t.Errorf("after update Search(1) = (%q, %v), want (ONE, true)", val, ok)
	}
}

func TestSkipListDelete(t *testing.T) {
	sl := NewSkipList()
	sl.Insert(1, "one")
	sl.Insert(2, "two")
	sl.Insert(3, "three")

	if !sl.Delete(2) {
		t.Error("Delete(2) should return true")
	}
	if sl.Delete(2) {
		t.Error("Delete(2) again should return false")
	}
	_, ok := sl.Search(2)
	if ok {
		t.Error("Search(2) should return false after delete")
	}

	val, ok := sl.Search(1)
	if !ok || val != "one" {
		t.Errorf("Search(1) = (%q, %v), want (one, true)", val, ok)
	}
	val, ok = sl.Search(3)
	if !ok || val != "three" {
		t.Errorf("Search(3) = (%q, %v), want (three, true)", val, ok)
	}
}

func TestSkipListManyElements(t *testing.T) {
	rand.Seed(42)
	sl := NewSkipList()
	for i := 0; i < 100; i++ {
		sl.Insert(i, "v")
	}
	for i := 0; i < 100; i++ {
		_, ok := sl.Search(i)
		if !ok {
			t.Errorf("Search(%d) should return true", i)
		}
	}
	for i := 0; i < 50; i++ {
		sl.Delete(i * 2) // delete evens
	}
	for i := 0; i < 100; i++ {
		_, ok := sl.Search(i)
		if i%2 == 0 && ok {
			t.Errorf("Search(%d) should be false (deleted)", i)
		}
		if i%2 == 1 && !ok {
			t.Errorf("Search(%d) should be true", i)
		}
	}
}

func TestSkipListEmpty(t *testing.T) {
	sl := NewSkipList()
	_, ok := sl.Search(1)
	if ok {
		t.Error("Search on empty list should return false")
	}
	if sl.Delete(1) {
		t.Error("Delete on empty list should return false")
	}
}`,
  solution: `package main

import "math/rand"

const maxLevel = 16

type skipNode struct {
	key   int
	value string
	next  []*skipNode
}

type SkipList struct {
	head  *skipNode
	level int
}

func NewSkipList() *SkipList {
	return &SkipList{
		head:  &skipNode{next: make([]*skipNode, maxLevel)},
		level: 1,
	}
}

func randomLevel() int {
	lvl := 1
	for lvl < maxLevel && rand.Float64() < 0.5 {
		lvl++
	}
	return lvl
}

func (sl *SkipList) Insert(key int, value string) {
	update := make([]*skipNode, maxLevel)
	current := sl.head
	for i := sl.level - 1; i >= 0; i-- {
		for current.next[i] != nil && current.next[i].key < key {
			current = current.next[i]
		}
		update[i] = current
	}

	if current.next[0] != nil && current.next[0].key == key {
		current.next[0].value = value
		return
	}

	lvl := randomLevel()
	if lvl > sl.level {
		for i := sl.level; i < lvl; i++ {
			update[i] = sl.head
		}
		sl.level = lvl
	}

	newNode := &skipNode{
		key:   key,
		value: value,
		next:  make([]*skipNode, lvl),
	}
	for i := 0; i < lvl; i++ {
		newNode.next[i] = update[i].next[i]
		update[i].next[i] = newNode
	}
}

func (sl *SkipList) Search(key int) (string, bool) {
	current := sl.head
	for i := sl.level - 1; i >= 0; i-- {
		for current.next[i] != nil && current.next[i].key < key {
			current = current.next[i]
		}
	}
	current = current.next[0]
	if current != nil && current.key == key {
		return current.value, true
	}
	return "", false
}

func (sl *SkipList) Delete(key int) bool {
	update := make([]*skipNode, maxLevel)
	current := sl.head
	for i := sl.level - 1; i >= 0; i-- {
		for current.next[i] != nil && current.next[i].key < key {
			current = current.next[i]
		}
		update[i] = current
	}

	target := current.next[0]
	if target == nil || target.key != key {
		return false
	}

	for i := 0; i < sl.level; i++ {
		if update[i].next[i] != target {
			break
		}
		update[i].next[i] = target.next[i]
	}

	for sl.level > 1 && sl.head.next[sl.level-1] == nil {
		sl.level--
	}
	return true
}

func main() {}`,
  hints: [
    'The head node is a sentinel with maxLevel next pointers, all initially nil.',
    'To find insertion point: start from the highest level, move right while next.key < target, then drop down. Record the last node at each level in an update array.',
    'When inserting with a random level higher than current, set update[i] = head for those new levels and update sl.level.',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_30_pointers_and_structs',
  title: 'Pointers and Structs',
  category: 'Basics',
  subcategory: 'Structs & Pointers',
  difficulty: 'beginner',
  order: 30,
  description: `When the receiver of a method is a **value**, the call passes a **copy** of the struct, so a field change inside the method is lost unless you return a new struct. When the receiver is a **pointer** (\`func (c *Counter) ...\`), the call passes the address, so the method can update the same \`Counter\` the variable refers to. Go is forgiving at call time: you may write \`c.Increment()\` even if \`c\` is a \`Counter\` value, not a pointer — the compiler will pass \`&c\` when a pointer receiver is needed. A wide rule: use pointer receivers for methods that **mutate** the receiver, or when the type is large—consistency in a type helps readers.

\`\`\`
type Counter struct { N int }

func (c *Counter) Increment() {
    c.N++
}
\`\`\`

**Your task:** implement the pointer-receiver methods for \`Stack\` and \`Player\` in the file so the tests pass.`,
  code: `package main

import "fmt"

// Stack is a simple integer stack.
type Stack struct {
	items []int
}

// TODO: Add a Push method with pointer receiver that adds an item.
// func (s *Stack) Push(val int)

// TODO: Add a Pop method with pointer receiver that removes and
// returns the top item, and a bool indicating if the stack was non-empty.
// func (s *Stack) Pop() (int, bool)

// TODO: Add a Len method (value receiver is fine here) that returns
// the number of items.
// func (s Stack) Len() int

// Player has a name and score
type Player struct {
	Name  string
	Score int
}

// TODO: Add an AddPoints method with pointer receiver that adds
// points to the player's score.
// func (p *Player) AddPoints(points int)

// TODO: Add a Reset method with pointer receiver that sets
// score back to 0.
// func (p *Player) Reset()

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestStack(t *testing.T) {
	var s Stack
	if s.Len() != 0 {
		t.Errorf("new stack Len = %d, want 0", s.Len())
	}
	s.Push(10)
	s.Push(20)
	s.Push(30)
	if s.Len() != 3 {
		t.Errorf("after 3 pushes, Len = %d, want 3", s.Len())
	}
	val, ok := s.Pop()
	if !ok || val != 30 {
		t.Errorf("Pop = (%d, %v), want (30, true)", val, ok)
	}
	val2, ok2 := s.Pop()
	if !ok2 || val2 != 20 {
		t.Errorf("Pop = (%d, %v), want (20, true)", val2, ok2)
	}
	val3, ok3 := s.Pop()
	if !ok3 || val3 != 10 {
		t.Errorf("Pop = (%d, %v), want (10, true)", val3, ok3)
	}
	_, ok4 := s.Pop()
	if ok4 {
		t.Error("Pop on empty stack should return false")
	}
}

func TestPlayer(t *testing.T) {
	p := Player{Name: "Alice", Score: 0}
	p.AddPoints(10)
	p.AddPoints(25)
	if p.Score != 35 {
		t.Errorf("Score = %d, want 35", p.Score)
	}
	p.Reset()
	if p.Score != 0 {
		t.Errorf("after Reset, Score = %d, want 0", p.Score)
	}
}`,
  solution: `package main

import "fmt"

type Stack struct {
	items []int
}

func (s *Stack) Push(val int) {
	s.items = append(s.items, val)
}

func (s *Stack) Pop() (int, bool) {
	if len(s.items) == 0 {
		return 0, false
	}
	val := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return val, true
}

func (s Stack) Len() int {
	return len(s.items)
}

type Player struct {
	Name  string
	Score int
}

func (p *Player) AddPoints(points int) {
	p.Score += points
}

func (p *Player) Reset() {
	p.Score = 0
}

var _ = fmt.Sprintf`,
  hints: [
    'Pointer receiver: func (s *Stack) Push(val int) { s.items = append(s.items, val) }',
    'For Pop, get the last element with s.items[len(s.items)-1], then shrink with s.items[:len(s.items)-1].',
    'Len() can use a value receiver (s Stack) since it only reads data, never modifies.'
  ],
}

export default exercise

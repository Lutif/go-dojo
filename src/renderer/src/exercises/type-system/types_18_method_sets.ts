import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_18_method_sets',
  title: 'Method Sets',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'advanced',
  order: 18,
  description: `The **method set** determines which interfaces a type satisfies:

- **Value type** \`T\`: only value receiver methods \`func (t T)\`
- **Pointer type** \`*T\`: both value AND pointer receiver methods

This means:
\`\`\`
type Incrementer interface { Increment() }
type Counter struct { N int }
func (c *Counter) Increment() { c.N++ }  // pointer receiver

var i Incrementer = Counter{}    // COMPILE ERROR
var i Incrementer = &Counter{}   // OK — *Counter has Increment()
\`\`\`

Your task: understand which types satisfy interfaces based on receiver types.`,
  code: `package main

import "fmt"

type Talker interface {
	Talk() string
}

type Muter interface {
	Mute()
}

type TalkMuter interface {
	Talker
	Muter
}

type Speaker struct {
	Name  string
	muted bool
}

// Talk has a VALUE receiver — available on both Speaker and *Speaker
func (s Speaker) Talk() string {
	if s.muted {
		return "..."
	}
	return s.Name + " says hello"
}

// Mute has a POINTER receiver — only available on *Speaker
func (s *Speaker) Mute() {
	s.muted = true
}

// CanTalk demonstrates value receivers satisfying interfaces.
// Create a Speaker value (not pointer) and assign to Talker.
func CanTalk() string {
	// TODO: Create a Speaker{Name: "Alice"} and assign to a Talker variable.
	// Call Talk() and return the result.
	return ""
}

// CanTalkAndMute demonstrates that TalkMuter requires a pointer.
// Returns the Talk() result after calling Mute().
func CanTalkAndMute() string {
	// TODO: Create a &Speaker{Name: "Bob"} and assign to TalkMuter.
	// Call Mute(), then return Talk().
	return ""
}

// MaketalkerSlice returns Talker interface values from Speakers.
// Both values and pointers satisfy Talker (since Talk has value receiver).
func MakeTalkerSlice() []string {
	speakers := []Speaker{
		{Name: "Alice"},
		{Name: "Bob"},
	}
	// TODO: Create a []Talker from speakers (use both value and pointer)
	// Return a slice of Talk() results
	_ = speakers
	return nil
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"reflect"
	"testing"
)

func TestCanTalk(t *testing.T) {
	got := CanTalk()
	if got != "Alice says hello" {
		t.Errorf("CanTalk() = %q, want %q", got, "Alice says hello")
	}
}

func TestCanTalkAndMute(t *testing.T) {
	got := CanTalkAndMute()
	if got != "..." {
		t.Errorf("CanTalkAndMute() = %q, want %q (should be muted)", got, "...")
	}
}

func TestMakeTalkerSlice(t *testing.T) {
	got := MakeTalkerSlice()
	want := []string{"Alice says hello", "Bob says hello"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("MakeTalkerSlice() = %v, want %v", got, want)
	}
}

func TestValueDoesNotSatisfyTalkMuter(t *testing.T) {
	// This test verifies understanding — *Speaker satisfies TalkMuter, Speaker does not.
	var tm TalkMuter = &Speaker{Name: "Test"}
	tm.Mute()
	if got := tm.Talk(); got != "..." {
		t.Errorf("after Mute, Talk() = %q, want '...'", got)
	}
}`,
  solution: `package main

import "fmt"

type Talker interface {
	Talk() string
}

type Muter interface {
	Mute()
}

type TalkMuter interface {
	Talker
	Muter
}

type Speaker struct {
	Name  string
	muted bool
}

func (s Speaker) Talk() string {
	if s.muted {
		return "..."
	}
	return s.Name + " says hello"
}

func (s *Speaker) Mute() {
	s.muted = true
}

func CanTalk() string {
	var t Talker = Speaker{Name: "Alice"}
	return t.Talk()
}

func CanTalkAndMute() string {
	var tm TalkMuter = &Speaker{Name: "Bob"}
	tm.Mute()
	return tm.Talk()
}

func MakeTalkerSlice() []string {
	speakers := []Speaker{
		{Name: "Alice"},
		{Name: "Bob"},
	}
	talkers := make([]Talker, len(speakers))
	for i := range speakers {
		talkers[i] = speakers[i]
	}
	results := make([]string, len(talkers))
	for i, t := range talkers {
		results[i] = t.Talk()
	}
	return results
}

var _ = fmt.Sprintf`,
  hints: [
    'Value receiver methods are in the method set of both T and *T. Pointer receiver methods are only in *T.',
    'Speaker (value) satisfies Talker (Talk has value receiver). Only *Speaker satisfies TalkMuter (Mute has pointer receiver).',
    'When assigning to an interface, use & to get a pointer if needed: var tm TalkMuter = &Speaker{...}'
  ],
}

export default exercise

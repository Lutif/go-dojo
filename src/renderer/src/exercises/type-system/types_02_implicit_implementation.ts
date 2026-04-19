import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_02_implicit_implementation',
  title: 'Implicit Implementation',
  category: 'Type System',
  subcategory: 'Interfaces',
  difficulty: 'beginner',
  order: 2,
  description: `Go uses **structural typing** (duck typing) — if a type has the right methods, it satisfies an interface automatically. There's no \`implements\` keyword.

This means:
- You can define an interface *after* creating the types
- Types from other packages can satisfy your interface without knowing about it
- Small interfaces (1-2 methods) are preferred because they're easier to satisfy

Your task: create types that implicitly satisfy the provided interfaces.`,
  code: `package main

import "fmt"

// These interfaces are already defined for you:
type Greeter interface {
	Greet() string
}

type Farewell interface {
	Goodbye() string
}

// TODO: Define an EnglishSpeaker struct (no fields needed)
// It should satisfy both Greeter and Farewell:
//   Greet()   → "Hello!"
//   Goodbye() → "Goodbye!"

// TODO: Define a SpanishSpeaker struct (no fields needed)
// It should satisfy both Greeter and Farewell:
//   Greet()   → "¡Hola!"
//   Goodbye() → "¡Adiós!"

// SayHello accepts any Greeter and returns its greeting
func SayHello(g Greeter) string {
	// TODO
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestEnglishGreeter(t *testing.T) {
	var g Greeter = EnglishSpeaker{}
	if got := g.Greet(); got != "Hello!" {
		t.Errorf("EnglishSpeaker.Greet() = %q, want %q", got, "Hello!")
	}
}

func TestEnglishFarewell(t *testing.T) {
	var f Farewell = EnglishSpeaker{}
	if got := f.Goodbye(); got != "Goodbye!" {
		t.Errorf("EnglishSpeaker.Goodbye() = %q, want %q", got, "Goodbye!")
	}
}

func TestSpanishGreeter(t *testing.T) {
	var g Greeter = SpanishSpeaker{}
	if got := g.Greet(); got != "¡Hola!" {
		t.Errorf("SpanishSpeaker.Greet() = %q, want %q", got, "¡Hola!")
	}
}

func TestSpanishFarewell(t *testing.T) {
	var f Farewell = SpanishSpeaker{}
	if got := f.Goodbye(); got != "¡Adiós!" {
		t.Errorf("SpanishSpeaker.Goodbye() = %q, want %q", got, "¡Adiós!")
	}
}

func TestSayHello(t *testing.T) {
	if got := SayHello(EnglishSpeaker{}); got != "Hello!" {
		t.Errorf("SayHello(English) = %q, want %q", got, "Hello!")
	}
	if got := SayHello(SpanishSpeaker{}); got != "¡Hola!" {
		t.Errorf("SayHello(Spanish) = %q, want %q", got, "¡Hola!")
	}
}`,
  solution: `package main

import "fmt"

type Greeter interface {
	Greet() string
}

type Farewell interface {
	Goodbye() string
}

type EnglishSpeaker struct{}

func (e EnglishSpeaker) Greet() string   { return "Hello!" }
func (e EnglishSpeaker) Goodbye() string { return "Goodbye!" }

type SpanishSpeaker struct{}

func (s SpanishSpeaker) Greet() string   { return "¡Hola!" }
func (s SpanishSpeaker) Goodbye() string { return "¡Adiós!" }

func SayHello(g Greeter) string {
	return g.Greet()
}

var _ = fmt.Sprintf`,
  hints: [
    'Just add the methods — no "implements" needed. EnglishSpeaker satisfies Greeter as soon as it has a Greet() string method.',
    'A type can satisfy multiple interfaces at once. EnglishSpeaker satisfies both Greeter and Farewell.',
    'SayHello receives a Greeter interface — just call g.Greet() on whatever is passed in.'
  ],
}

export default exercise

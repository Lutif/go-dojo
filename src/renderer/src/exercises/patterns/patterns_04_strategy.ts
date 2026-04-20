import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_04_strategy',
  title: 'Strategy Pattern',
  category: 'Patterns',
  subcategory: 'Behavioral',
  difficulty: 'intermediate',
  order: 4,
  description: `The strategy pattern defines a family of interchangeable algorithms behind a common interface. A context object delegates work to a chosen strategy:

\`\`\`go
type Sorter interface {
    Sort([]int) []int
}

type Processor struct {
    strategy Sorter
}
\`\`\`

Your task: implement a text compression system with:

1. A \`Compressor\` interface with \`Compress(data string) string\`
2. \`NoopCompressor\` - returns data unchanged
3. \`UpperCompressor\` - returns strings.ToUpper(data)
4. \`RepeatCompressor\` - returns data + data (doubles it)
5. A \`Processor\` struct with a \`compressor\` field and method \`Process(data string) string\` that delegates to the compressor
6. \`NewProcessor(c Compressor) *Processor\``,
  code: `package main

import "strings"

// Ensure strings is used
var _ = strings.ToUpper

// TODO: Define Compressor interface with Compress(data string) string

// TODO: Implement NoopCompressor (returns data unchanged)

// TODO: Implement UpperCompressor (returns strings.ToUpper(data))

// TODO: Implement RepeatCompressor (returns data + data)

// TODO: Define Processor struct with compressor field
// and Process(data string) string method

// TODO: Implement NewProcessor(c Compressor) *Processor

func main() {}`,
  testCode: `package main

import "testing"

func TestNoopCompressor(t *testing.T) {
	p := NewProcessor(&NoopCompressor{})
	result := p.Process("hello")
	if result != "hello" {
		t.Errorf("NoopCompressor: got %q, want %q", result, "hello")
	}
}

func TestUpperCompressor(t *testing.T) {
	p := NewProcessor(&UpperCompressor{})
	result := p.Process("hello")
	if result != "HELLO" {
		t.Errorf("UpperCompressor: got %q, want %q", result, "HELLO")
	}
}

func TestRepeatCompressor(t *testing.T) {
	p := NewProcessor(&RepeatCompressor{})
	result := p.Process("ab")
	if result != "abab" {
		t.Errorf("RepeatCompressor: got %q, want %q", result, "abab")
	}
}

func TestStrategySwap(t *testing.T) {
	p1 := NewProcessor(&UpperCompressor{})
	p2 := NewProcessor(&RepeatCompressor{})

	r1 := p1.Process("go")
	r2 := p2.Process("go")

	if r1 != "GO" {
		t.Errorf("upper: got %q, want %q", r1, "GO")
	}
	if r2 != "gogo" {
		t.Errorf("repeat: got %q, want %q", r2, "gogo")
	}
}`,
  solution: `package main

import "strings"

type Compressor interface {
	Compress(data string) string
}

type NoopCompressor struct{}

func (n *NoopCompressor) Compress(data string) string {
	return data
}

type UpperCompressor struct{}

func (u *UpperCompressor) Compress(data string) string {
	return strings.ToUpper(data)
}

type RepeatCompressor struct{}

func (r *RepeatCompressor) Compress(data string) string {
	return data + data
}

type Processor struct {
	compressor Compressor
}

func NewProcessor(c Compressor) *Processor {
	return &Processor{compressor: c}
}

func (p *Processor) Process(data string) string {
	return p.compressor.Compress(data)
}

func main() {}`,
  hints: [
    'Each strategy struct implements the Compressor interface with its own Compress logic.',
    'Processor stores a Compressor and delegates Process() to it.',
    'strings.ToUpper converts a string to uppercase.',
  ],
}

export default exercise

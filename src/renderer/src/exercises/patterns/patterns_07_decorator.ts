import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_07_decorator',
  title: 'Decorator Pattern',
  category: 'Patterns',
  subcategory: 'Behavioral',
  difficulty: 'intermediate',
  order: 7,
  description: `The decorator pattern wraps an object to add behavior while keeping the same interface. Unlike middleware (which wraps functions), decorators wrap struct instances:

\`\`\`go
type Logger interface {
    Log(msg string) string
}

type TimestampLogger struct {
    inner Logger
}
\`\`\`

Your task: build a text formatter system:

1. Define a \`Formatter\` interface with \`Format(text string) string\`
2. \`PlainFormatter\` - returns text unchanged
3. \`BracketDecorator\` - wraps inner Formatter, adds "[" and "]" around the result
4. \`QuoteDecorator\` - wraps inner Formatter, adds double quotes around the result
5. Each decorator should have a constructor: \`NewBracketDecorator(f Formatter)\` and \`NewQuoteDecorator(f Formatter)\`

Decorators can be stacked: \`NewBracketDecorator(NewQuoteDecorator(&PlainFormatter{}))\``,
  code: `package main

// TODO: Define Formatter interface with Format(text string) string

// TODO: Implement PlainFormatter (returns text unchanged)

// TODO: Implement BracketDecorator with inner Formatter field
// Format wraps inner.Format(text) with "[" and "]"
// Implement NewBracketDecorator(f Formatter) *BracketDecorator

// TODO: Implement QuoteDecorator with inner Formatter field
// Format wraps inner.Format(text) with double quotes
// Implement NewQuoteDecorator(f Formatter) *QuoteDecorator

func main() {}`,
  testCode: `package main

import "testing"

func TestPlainFormatter(t *testing.T) {
	f := &PlainFormatter{}
	result := f.Format("hello")
	if result != "hello" {
		t.Errorf("got %q, want %q", result, "hello")
	}
}

func TestBracketDecorator(t *testing.T) {
	f := NewBracketDecorator(&PlainFormatter{})
	result := f.Format("hello")
	if result != "[hello]" {
		t.Errorf("got %q, want %q", result, "[hello]")
	}
}

func TestQuoteDecorator(t *testing.T) {
	f := NewQuoteDecorator(&PlainFormatter{})
	result := f.Format("hello")
	expected := "\"hello\""
	if result != expected {
		t.Errorf("got %q, want %q", result, expected)
	}
}

func TestStackedDecorators(t *testing.T) {
	f := NewBracketDecorator(NewQuoteDecorator(&PlainFormatter{}))
	result := f.Format("go")
	expected := "[\"go\"]"
	if result != expected {
		t.Errorf("got %q, want %q", result, expected)
	}
}

func TestDoubleStackedDecorators(t *testing.T) {
	f := NewQuoteDecorator(NewBracketDecorator(NewQuoteDecorator(&PlainFormatter{})))
	result := f.Format("x")
	expected := "\"[\"x\"]\""
	if result != expected {
		t.Errorf("got %q, want %q", result, expected)
	}
}`,
  solution: `package main

type Formatter interface {
	Format(text string) string
}

type PlainFormatter struct{}

func (p *PlainFormatter) Format(text string) string {
	return text
}

type BracketDecorator struct {
	inner Formatter
}

func NewBracketDecorator(f Formatter) *BracketDecorator {
	return &BracketDecorator{inner: f}
}

func (b *BracketDecorator) Format(text string) string {
	return "[" + b.inner.Format(text) + "]"
}

type QuoteDecorator struct {
	inner Formatter
}

func NewQuoteDecorator(f Formatter) *QuoteDecorator {
	return &QuoteDecorator{inner: f}
}

func (q *QuoteDecorator) Format(text string) string {
	return "\"" + q.inner.Format(text) + "\""
}

func main() {}`,
  hints: [
    'Each decorator stores an inner Formatter and calls inner.Format(text) inside its own Format.',
    'BracketDecorator wraps the result with "[" and "]".',
    'Decorators compose: the outermost decorator calls the next one, which calls the next, down to PlainFormatter.',
  ],
}

export default exercise

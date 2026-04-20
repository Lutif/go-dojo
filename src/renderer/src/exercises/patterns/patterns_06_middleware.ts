import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_06_middleware',
  title: 'Middleware Chain',
  category: 'Patterns',
  subcategory: 'Behavioral',
  difficulty: 'advanced',
  order: 6,
  description: `The middleware pattern wraps a handler with additional behavior, forming a processing chain. Each middleware can act before and/or after the next handler:

\`\`\`go
type Handler func(request string) string
type Middleware func(Handler) Handler
\`\`\`

Your task:

1. Define \`Handler\` as \`func(string) string\`
2. Define \`Middleware\` as \`func(Handler) Handler\`
3. Implement \`PrefixMiddleware(prefix string) Middleware\` - prepends prefix + ":" to the request before passing to the next handler
4. Implement \`SuffixMiddleware(suffix string) Middleware\` - appends ":" + suffix to the result from the next handler
5. Implement \`Chain(h Handler, middlewares ...Middleware) Handler\` - applies middlewares in order (first middleware is outermost)`,
  code: `package main

// TODO: Define Handler as func(string) string

// TODO: Define Middleware as func(Handler) Handler

// TODO: Implement PrefixMiddleware(prefix string) Middleware
// It should prepend prefix + ":" to the request before calling next handler

// TODO: Implement SuffixMiddleware(suffix string) Middleware
// It should append ":" + suffix to the result after calling next handler

// TODO: Implement Chain(h Handler, middlewares ...Middleware) Handler
// Apply middlewares so the first one is outermost (wraps everything)

func main() {}`,
  testCode: `package main

import "testing"

func TestPrefixMiddleware(t *testing.T) {
	base := Handler(func(s string) string { return s })
	wrapped := PrefixMiddleware("PRE")(base)
	result := wrapped("hello")
	if result != "PRE:hello" {
		t.Errorf("got %q, want %q", result, "PRE:hello")
	}
}

func TestSuffixMiddleware(t *testing.T) {
	base := Handler(func(s string) string { return s })
	wrapped := SuffixMiddleware("END")(base)
	result := wrapped("hello")
	if result != "hello:END" {
		t.Errorf("got %q, want %q", result, "hello:END")
	}
}

func TestChain(t *testing.T) {
	base := Handler(func(s string) string { return "[" + s + "]" })
	chained := Chain(base,
		PrefixMiddleware("A"),
		SuffixMiddleware("Z"),
	)
	result := chained("x")
	// A prepends to request: "A:x"
	// base wraps: "[A:x]"
	// Z appends to result: "[A:x]:Z"
	if result != "[A:x]:Z" {
		t.Errorf("got %q, want %q", result, "[A:x]:Z")
	}
}

func TestChainOrder(t *testing.T) {
	base := Handler(func(s string) string { return s })
	chained := Chain(base,
		PrefixMiddleware("1"),
		PrefixMiddleware("2"),
	)
	result := chained("x")
	// middleware 1 is outermost: prepends "1:" first
	// then middleware 2 prepends "2:" to "1:x" -> "2:1:x"
	// Wait: Chain applies first middleware outermost.
	// So 1 wraps 2 wraps base.
	// Execution: 1 prepends "1:" to input -> "1:x", passes to 2
	// 2 prepends "2:" to "1:x" -> "2:1:x", passes to base
	// base returns "2:1:x"
	if result != "2:1:x" {
		t.Errorf("got %q, want %q", result, "2:1:x")
	}
}

func TestEmptyChain(t *testing.T) {
	base := Handler(func(s string) string { return s + "!" })
	chained := Chain(base)
	result := chained("hi")
	if result != "hi!" {
		t.Errorf("got %q, want %q", result, "hi!")
	}
}`,
  solution: `package main

type Handler func(string) string
type Middleware func(Handler) Handler

func PrefixMiddleware(prefix string) Middleware {
	return func(next Handler) Handler {
		return func(s string) string {
			return next(prefix + ":" + s)
		}
	}
}

func SuffixMiddleware(suffix string) Middleware {
	return func(next Handler) Handler {
		return func(s string) string {
			return next(s) + ":" + suffix
		}
	}
}

func Chain(h Handler, middlewares ...Middleware) Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}
	return h
}

func main() {}`,
  hints: [
    'PrefixMiddleware returns a Middleware that returns a Handler modifying the input before calling next.',
    'SuffixMiddleware modifies the output after calling next.',
    'Chain applies middlewares in reverse order so the first middleware listed is outermost.',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_17_context_values',
  title: 'Context Values',
  category: 'Concurrency',
  subcategory: 'Context',
  difficulty: 'intermediate',
  order: 17,
  description: `\`context.WithValue\` attaches key-value data to a context:

\`\`\`
type contextKey string

const userKey contextKey = "user"

ctx := context.WithValue(parent, userKey, "alice")
user := ctx.Value(userKey).(string)  // "alice"
\`\`\`

Rules for context values:
- Define **unexported custom types** for keys to avoid collisions
- Use for **request-scoped** data: request IDs, auth tokens, trace IDs
- **Don't** use for function parameters — pass those explicitly
- Values are **immutable** — WithValue creates a new context

Your task: use context values for request-scoped metadata.`,
  code: `package main

import (
	"context"
	"fmt"
)

// Define unexported key types to avoid collisions
type requestIDKey struct{}
type userKey struct{}

// WithRequestID returns a new context with the given request ID attached.
func WithRequestID(ctx context.Context, id string) context.Context {
	// TODO: Use context.WithValue
	return ctx
}

// GetRequestID extracts the request ID from context.
// Returns ("", false) if not set.
func GetRequestID(ctx context.Context) (string, bool) {
	// TODO
	return "", false
}

// WithUser returns a new context with the given username attached.
func WithUser(ctx context.Context, username string) context.Context {
	// TODO
	return ctx
}

// GetUser extracts the username from context.
func GetUser(ctx context.Context) (string, bool) {
	// TODO
	return "", false
}

// FormatLog creates a log message with request ID and user from context.
// Format: "[req-id] user: message" (or "[unknown] anonymous: message" if not set)
func FormatLog(ctx context.Context, message string) string {
	// TODO
	return ""
}

var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"context"
	"testing"
)

func TestWithRequestID(t *testing.T) {
	ctx := WithRequestID(context.Background(), "abc-123")
	id, ok := GetRequestID(ctx)
	if !ok || id != "abc-123" {
		t.Errorf("GetRequestID = (%q, %v), want (abc-123, true)", id, ok)
	}
}

func TestGetRequestIDMissing(t *testing.T) {
	ctx := context.Background()
	_, ok := GetRequestID(ctx)
	if ok {
		t.Error("should return false when not set")
	}
}

func TestWithUser(t *testing.T) {
	ctx := WithUser(context.Background(), "alice")
	user, ok := GetUser(ctx)
	if !ok || user != "alice" {
		t.Errorf("GetUser = (%q, %v), want (alice, true)", user, ok)
	}
}

func TestGetUserMissing(t *testing.T) {
	_, ok := GetUser(context.Background())
	if ok {
		t.Error("should return false when not set")
	}
}

func TestContextValuesStack(t *testing.T) {
	ctx := context.Background()
	ctx = WithRequestID(ctx, "req-1")
	ctx = WithUser(ctx, "bob")

	id, _ := GetRequestID(ctx)
	user, _ := GetUser(ctx)
	if id != "req-1" || user != "bob" {
		t.Errorf("got id=%q user=%q", id, user)
	}
}

func TestFormatLogFull(t *testing.T) {
	ctx := WithRequestID(context.Background(), "req-42")
	ctx = WithUser(ctx, "alice")
	got := FormatLog(ctx, "hello")
	want := "[req-42] alice: hello"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestFormatLogEmpty(t *testing.T) {
	ctx := context.Background()
	got := FormatLog(ctx, "hello")
	want := "[unknown] anonymous: hello"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestFormatLogPartial(t *testing.T) {
	ctx := WithRequestID(context.Background(), "req-1")
	got := FormatLog(ctx, "test")
	want := "[req-1] anonymous: test"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}`,
  solution: `package main

import (
	"context"
	"fmt"
)

type requestIDKey struct{}
type userKey struct{}

func WithRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey{}, id)
}

func GetRequestID(ctx context.Context) (string, bool) {
	id, ok := ctx.Value(requestIDKey{}).(string)
	return id, ok
}

func WithUser(ctx context.Context, username string) context.Context {
	return context.WithValue(ctx, userKey{}, username)
}

func GetUser(ctx context.Context) (string, bool) {
	user, ok := ctx.Value(userKey{}).(string)
	return user, ok
}

func FormatLog(ctx context.Context, message string) string {
	id, ok := GetRequestID(ctx)
	if !ok {
		id = "unknown"
	}
	user, ok := GetUser(ctx)
	if !ok {
		user = "anonymous"
	}
	return fmt.Sprintf("[%s] %s: %s", id, user, message)
}

var _ = fmt.Sprintf`,
  hints: [
    'Use context.WithValue(ctx, requestIDKey{}, id) with the unexported struct key type. This prevents key collisions between packages.',
    'To extract: val, ok := ctx.Value(requestIDKey{}).(string). The type assertion with ok pattern handles the case where the value is not set.',
    'FormatLog: call GetRequestID and GetUser, use defaults if not found, then fmt.Sprintf the result.'
  ],
}

export default exercise

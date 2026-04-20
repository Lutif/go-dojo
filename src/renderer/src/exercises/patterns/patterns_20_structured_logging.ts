import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_20_structured_logging',
  title: 'Structured Logging',
  category: 'Patterns',
  subcategory: 'Application Patterns',
  difficulty: 'intermediate',
  order: 20,
  description: `Build a structured logger that outputs key-value pairs with log levels.

Structured logging makes logs machine-parseable while remaining human-readable. Each log entry has a level, message, and optional key-value fields.

Log levels (in order of severity):

  LevelDebug = 0
  LevelInfo  = 1
  LevelWarn  = 2
  LevelError = 3

Your tasks:

1. Define a \`Logger\` struct with:
   - \`level\` (int) - minimum level to output
   - \`output\` (*bytes.Buffer) - where to write logs
   - \`fields\` (map[string]string) - default fields added to every entry

2. Implement \`NewLogger(level int, output *bytes.Buffer) *Logger\`.

3. Implement \`(l *Logger) With(key, value string) *Logger\`:
   - Returns a NEW Logger that has all existing fields plus the new key-value pair
   - Does not modify the original logger
   - The new logger shares the same output and level

4. Implement \`(l *Logger) Log(level int, msg string, keyvals ...string)\`:
   - If level < logger's minimum level, do nothing
   - Write a line in format: \`level=LEVEL msg=MESSAGE key1=val1 key2=val2\\n\`
   - Level names: "DEBUG", "INFO", "WARN", "ERROR"
   - Include default fields first, then keyvals from the call
   - keyvals are alternating key-value pairs: key1, val1, key2, val2

5. Add convenience methods:
   - \`Debug(msg string, keyvals ...string)\`
   - \`Info(msg string, keyvals ...string)\`
   - \`Warn(msg string, keyvals ...string)\`
   - \`Error(msg string, keyvals ...string)\``,
  code: `package main

import "bytes"

// Log levels
const (
	LevelDebug = 0
	LevelInfo  = 1
	LevelWarn  = 2
	LevelError = 3
)

// TODO: Define Logger struct with level, output (*bytes.Buffer), fields (map[string]string)

// TODO: Implement NewLogger(level int, output *bytes.Buffer) *Logger

// TODO: Implement (l *Logger) With(key, value string) *Logger
// Returns a new Logger with the additional field (does not modify original)

// TODO: Implement (l *Logger) Log(level int, msg string, keyvals ...string)
// Format: level=LEVEL msg=MESSAGE key1=val1 key2=val2

// TODO: Implement convenience methods: Debug, Info, Warn, Error

var _ bytes.Buffer

func main() {}`,
  testCode: `package main

import (
	"bytes"
	"strings"
	"testing"
)

func TestBasicLogging(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelDebug, &buf)

	log.Info("server started", "port", "8080")
	output := buf.String()

	if !strings.Contains(output, "level=INFO") {
		t.Errorf("expected level=INFO, got %q", output)
	}
	if !strings.Contains(output, "msg=server started") {
		t.Errorf("expected msg=server started, got %q", output)
	}
	if !strings.Contains(output, "port=8080") {
		t.Errorf("expected port=8080, got %q", output)
	}
}

func TestLogLevelFiltering(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelWarn, &buf)

	log.Debug("debug msg")
	log.Info("info msg")
	if buf.Len() != 0 {
		t.Errorf("expected no output for below-level logs, got %q", buf.String())
	}

	log.Warn("warn msg")
	if !strings.Contains(buf.String(), "level=WARN") {
		t.Errorf("expected WARN log, got %q", buf.String())
	}
}

func TestAllLevels(t *testing.T) {
	tests := []struct {
		level    int
		method   string
		expected string
	}{
		{LevelDebug, "debug", "level=DEBUG"},
		{LevelInfo, "info", "level=INFO"},
		{LevelWarn, "warn", "level=WARN"},
		{LevelError, "error", "level=ERROR"},
	}

	for _, tt := range tests {
		var buf bytes.Buffer
		log := NewLogger(LevelDebug, &buf)

		switch tt.method {
		case "debug":
			log.Debug("test")
		case "info":
			log.Info("test")
		case "warn":
			log.Warn("test")
		case "error":
			log.Error("test")
		}

		if !strings.Contains(buf.String(), tt.expected) {
			t.Errorf("expected %s, got %q", tt.expected, buf.String())
		}
	}
}

func TestWithFields(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelDebug, &buf)
	reqLog := log.With("request_id", "abc123")

	reqLog.Info("handling request", "path", "/api")
	output := buf.String()

	if !strings.Contains(output, "request_id=abc123") {
		t.Errorf("expected request_id=abc123, got %q", output)
	}
	if !strings.Contains(output, "path=/api") {
		t.Errorf("expected path=/api, got %q", output)
	}
}

func TestWithDoesNotModifyOriginal(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelDebug, &buf)
	_ = log.With("extra", "field")

	log.Info("original")
	output := buf.String()

	if strings.Contains(output, "extra=field") {
		t.Error("With() should not modify the original logger")
	}
}

func TestMultipleWithCalls(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelDebug, &buf)

	child := log.With("service", "api").With("version", "v2")
	child.Info("hello")
	output := buf.String()

	if !strings.Contains(output, "service=api") {
		t.Errorf("expected service=api, got %q", output)
	}
	if !strings.Contains(output, "version=v2") {
		t.Errorf("expected version=v2, got %q", output)
	}
}

func TestNoKeyvals(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelDebug, &buf)

	log.Info("just a message")
	output := strings.TrimSpace(buf.String())

	if output != "level=INFO msg=just a message" {
		t.Errorf("expected 'level=INFO msg=just a message', got %q", output)
	}
}

func TestMultipleLogEntries(t *testing.T) {
	var buf bytes.Buffer
	log := NewLogger(LevelDebug, &buf)

	log.Info("first")
	log.Info("second")

	lines := strings.Split(strings.TrimSpace(buf.String()), "\n")
	if len(lines) != 2 {
		t.Errorf("expected 2 lines, got %d: %q", len(lines), buf.String())
	}
}`,
  solution: `package main

import (
	"bytes"
	"fmt"
)

const (
	LevelDebug = 0
	LevelInfo  = 1
	LevelWarn  = 2
	LevelError = 3
)

type Logger struct {
	level  int
	output *bytes.Buffer
	fields map[string]string
}

func NewLogger(level int, output *bytes.Buffer) *Logger {
	return &Logger{
		level:  level,
		output: output,
		fields: make(map[string]string),
	}
}

func (l *Logger) With(key, value string) *Logger {
	newFields := make(map[string]string, len(l.fields)+1)
	for k, v := range l.fields {
		newFields[k] = v
	}
	newFields[key] = value
	return &Logger{
		level:  l.level,
		output: l.output,
		fields: newFields,
	}
}

func levelName(level int) string {
	switch level {
	case LevelDebug:
		return "DEBUG"
	case LevelInfo:
		return "INFO"
	case LevelWarn:
		return "WARN"
	case LevelError:
		return "ERROR"
	default:
		return "UNKNOWN"
	}
}

func (l *Logger) Log(level int, msg string, keyvals ...string) {
	if level < l.level {
		return
	}

	entry := fmt.Sprintf("level=%s msg=%s", levelName(level), msg)

	for k, v := range l.fields {
		entry += fmt.Sprintf(" %s=%s", k, v)
	}

	for i := 0; i+1 < len(keyvals); i += 2 {
		entry += fmt.Sprintf(" %s=%s", keyvals[i], keyvals[i+1])
	}

	fmt.Fprintln(l.output, entry)
}

func (l *Logger) Debug(msg string, keyvals ...string) {
	l.Log(LevelDebug, msg, keyvals...)
}

func (l *Logger) Info(msg string, keyvals ...string) {
	l.Log(LevelInfo, msg, keyvals...)
}

func (l *Logger) Warn(msg string, keyvals ...string) {
	l.Log(LevelWarn, msg, keyvals...)
}

func (l *Logger) Error(msg string, keyvals ...string) {
	l.Log(LevelError, msg, keyvals...)
}

func main() {}`,
  hints: [
    'Use a map[string]string for fields. In With(), copy all existing fields to a new map and add the new pair.',
    'The Log method should format: level=NAME msg=MESSAGE, then append default fields, then keyvals pairs.',
    'keyvals come in pairs: keyvals[0]=key, keyvals[1]=value, keyvals[2]=key, etc. Loop with i += 2.',
    'Use fmt.Fprintln to write to the buffer, which adds a trailing newline automatically.',
  ],
}

export default exercise

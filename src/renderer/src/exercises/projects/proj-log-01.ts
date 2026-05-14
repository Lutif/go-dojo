import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-log-01',
  title: 'Structured Logger — Log Entry & Levels',
  category: 'Projects',
  subcategory: 'Structured Logger',
  difficulty: 'intermediate',
  order: 143,
  projectId: 'proj-log',
  projectTitle: 'Structured Logger',
  step: 1,
  totalSteps: 6,
  description: `Build a production-quality structured logging system from scratch! In this first step, define the
core types and implement basic level-filtered logging.

**Requirements:**
- Define a \`Level\` type using iota: \`DEBUG\`, \`INFO\`, \`WARN\`, \`ERROR\`
- Define a \`Field\` struct with \`Key\` and \`Value\` string fields
- Define an \`Entry\` struct with \`Level\`, \`Message\`, \`Timestamp\` (time.Time), and \`Fields\` (map[string]string)
- Implement \`NewLogger(minLevel Level) *Logger\`
- Implement \`Debug\`, \`Info\`, \`Warn\`, \`Error\` methods: \`(msg string, fields ...Field)\`
  - Each creates an Entry only if the method's level >= the logger's minimum level
  - Timestamp should be set to the current time
  - Fields from the variadic args are stored in the Entry's Fields map
- Implement \`Entries() []Entry\` to retrieve all logged entries`,
  code: `package main

import "time"

// Level represents the severity of a log entry.
type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

// Field is a key-value pair attached to a log entry.
type Field struct {
	Key   string
	Value string
}

// Entry represents a single log entry.
type Entry struct {
	Level     Level
	Message   string
	Timestamp time.Time
	Fields    map[string]string
}

// Logger collects log entries filtered by minimum level.
type Logger struct {
	// TODO: add fields
}

// NewLogger creates a Logger that only records entries at minLevel or above.
func NewLogger(minLevel Level) *Logger {
	// TODO: implement
	return nil
}

// Debug logs a message at DEBUG level.
func (l *Logger) Debug(msg string, fields ...Field) {
	// TODO: implement
}

// Info logs a message at INFO level.
func (l *Logger) Info(msg string, fields ...Field) {
	// TODO: implement
}

// Warn logs a message at WARN level.
func (l *Logger) Warn(msg string, fields ...Field) {
	// TODO: implement
}

// Error logs a message at ERROR level.
func (l *Logger) Error(msg string, fields ...Field) {
	// TODO: implement
}

// Entries returns all logged entries.
func (l *Logger) Entries() []Entry {
	// TODO: implement
	return nil
}

func main() {}
`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestNewLogger(t *testing.T) {
	l := NewLogger(INFO)
	if l == nil {
		t.Fatal("NewLogger returned nil")
	}
	entries := l.Entries()
	if len(entries) != 0 {
		t.Errorf("expected 0 entries, got %d", len(entries))
	}
}

func TestInfoLogging(t *testing.T) {
	l := NewLogger(DEBUG)
	l.Info("hello")
	entries := l.Entries()
	if len(entries) != 1 {
		t.Fatalf("expected 1 entry, got %d", len(entries))
	}
	if entries[0].Message != "hello" {
		t.Errorf("expected message %q, got %q", "hello", entries[0].Message)
	}
	if entries[0].Level != INFO {
		t.Errorf("expected level INFO, got %d", entries[0].Level)
	}
}

func TestLevelFiltering(t *testing.T) {
	l := NewLogger(WARN)
	l.Debug("debug msg")
	l.Info("info msg")
	l.Warn("warn msg")
	l.Error("error msg")
	entries := l.Entries()
	if len(entries) != 2 {
		t.Fatalf("expected 2 entries (WARN+ERROR), got %d", len(entries))
	}
	if entries[0].Message != "warn msg" {
		t.Errorf("expected first entry %q, got %q", "warn msg", entries[0].Message)
	}
	if entries[1].Message != "error msg" {
		t.Errorf("expected second entry %q, got %q", "error msg", entries[1].Message)
	}
}

func TestAllLevels(t *testing.T) {
	l := NewLogger(DEBUG)
	l.Debug("d")
	l.Info("i")
	l.Warn("w")
	l.Error("e")
	entries := l.Entries()
	if len(entries) != 4 {
		t.Fatalf("expected 4 entries, got %d", len(entries))
	}
	expected := []Level{DEBUG, INFO, WARN, ERROR}
	for i, e := range entries {
		if e.Level != expected[i] {
			t.Errorf("entry %d: expected level %d, got %d", i, expected[i], e.Level)
		}
	}
}

func TestFieldsAttached(t *testing.T) {
	l := NewLogger(DEBUG)
	l.Info("request", Field{Key: "method", Value: "GET"}, Field{Key: "path", Value: "/api"})
	entries := l.Entries()
	if len(entries) != 1 {
		t.Fatalf("expected 1 entry, got %d", len(entries))
	}
	if entries[0].Fields["method"] != "GET" {
		t.Errorf("expected method=GET, got %q", entries[0].Fields["method"])
	}
	if entries[0].Fields["path"] != "/api" {
		t.Errorf("expected path=/api, got %q", entries[0].Fields["path"])
	}
}

func TestTimestampPopulated(t *testing.T) {
	before := time.Now()
	l := NewLogger(DEBUG)
	l.Info("timed")
	after := time.Now()
	entries := l.Entries()
	if len(entries) != 1 {
		t.Fatalf("expected 1 entry, got %d", len(entries))
	}
	ts := entries[0].Timestamp
	if ts.Before(before) || ts.After(after) {
		t.Errorf("timestamp %v not between %v and %v", ts, before, after)
	}
}

func TestErrorLevelOnly(t *testing.T) {
	l := NewLogger(ERROR)
	l.Debug("d")
	l.Info("i")
	l.Warn("w")
	l.Error("e")
	entries := l.Entries()
	if len(entries) != 1 {
		t.Fatalf("expected 1 entry, got %d", len(entries))
	}
	if entries[0].Level != ERROR {
		t.Errorf("expected ERROR level, got %d", entries[0].Level)
	}
}

func TestNoFields(t *testing.T) {
	l := NewLogger(DEBUG)
	l.Info("bare")
	entries := l.Entries()
	if len(entries) != 1 {
		t.Fatalf("expected 1 entry, got %d", len(entries))
	}
	if len(entries[0].Fields) != 0 {
		t.Errorf("expected 0 fields, got %d", len(entries[0].Fields))
	}
}
`,
  solution: `package main

import "time"

// Level represents the severity of a log entry.
type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

// Field is a key-value pair attached to a log entry.
type Field struct {
	Key   string
	Value string
}

// Entry represents a single log entry.
type Entry struct {
	Level     Level
	Message   string
	Timestamp time.Time
	Fields    map[string]string
}

// Logger collects log entries filtered by minimum level.
type Logger struct {
	minLevel Level
	entries  []Entry
}

// NewLogger creates a Logger that only records entries at minLevel or above.
func NewLogger(minLevel Level) *Logger {
	return &Logger{
		minLevel: minLevel,
		entries:  []Entry{},
	}
}

func (l *Logger) log(level Level, msg string, fields []Field) {
	if level < l.minLevel {
		return
	}
	fmap := make(map[string]string)
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	l.entries = append(l.entries, Entry{
		Level:     level,
		Message:   msg,
		Timestamp: time.Now(),
		Fields:    fmap,
	})
}

// Debug logs a message at DEBUG level.
func (l *Logger) Debug(msg string, fields ...Field) {
	l.log(DEBUG, msg, fields)
}

// Info logs a message at INFO level.
func (l *Logger) Info(msg string, fields ...Field) {
	l.log(INFO, msg, fields)
}

// Warn logs a message at WARN level.
func (l *Logger) Warn(msg string, fields ...Field) {
	l.log(WARN, msg, fields)
}

// Error logs a message at ERROR level.
func (l *Logger) Error(msg string, fields ...Field) {
	l.log(ERROR, msg, fields)
}

// Entries returns all logged entries.
func (l *Logger) Entries() []Entry {
	return l.entries
}

func main() {}
`,
  hints: [
    'Use iota for the Level constants: DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3',
    'In the log helper, compare level >= l.minLevel to decide whether to record',
    'Convert the variadic Field slice into a map[string]string for the Entry',
    'Use time.Now() to set the Timestamp when creating each Entry',
  ],
}

export default exercise

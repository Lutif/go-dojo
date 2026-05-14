import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-log-02',
  title: 'Structured Logger — Formatted Output',
  category: 'Projects',
  subcategory: 'Structured Logger',
  difficulty: 'intermediate',
  order: 144,
  projectId: 'proj-log',
  step: 2,
  totalSteps: 6,
  description: `Add formatted text output to the logger. Entries should be written to an io.Writer in a
human-readable format.

**Requirements:**
- Add \`NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger\`
  - When a writer is set, each log call writes the formatted entry to the writer
- Format: \`[LEVEL] YYYY-MM-DD HH:MM:SS message key1=val1 key2=val2\\n\`
  - Use Go time format \`2006-01-02 15:04:05\`
  - Level names: DEBUG, INFO, WARN, ERROR (padded to 5 chars: "DEBUG", "INFO ", "WARN ", "ERROR")
  - Fields are sorted alphabetically by key for stable output
- Implement \`FormatEntry(e Entry) string\` as a standalone function
- Previous step's types and Entries() remain available`,
  code: `package main

import (
	"fmt"
	"io"
	"sort"
	"strings"
	"time"
)

type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

type Field struct {
	Key   string
	Value string
}

type Entry struct {
	Level     Level
	Message   string
	Timestamp time.Time
	Fields    map[string]string
}

type Logger struct {
	minLevel Level
	entries  []Entry
	writer   io.Writer
}

// NewLogger creates a Logger that only records entries at minLevel or above.
func NewLogger(minLevel Level) *Logger {
	return &Logger{minLevel: minLevel, entries: []Entry{}}
}

// NewLoggerWithOutput creates a Logger that writes formatted entries to w.
func NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger {
	// TODO: implement
	return nil
}

func (l *Logger) log(level Level, msg string, fields []Field) {
	if level < l.minLevel {
		return
	}
	fmap := make(map[string]string)
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	entry := Entry{
		Level:     level,
		Message:   msg,
		Timestamp: time.Now(),
		Fields:    fmap,
	}
	l.entries = append(l.entries, entry)
	// TODO: if writer is set, write FormatEntry(entry) to it
}

func (l *Logger) Debug(msg string, fields ...Field) { l.log(DEBUG, msg, fields) }
func (l *Logger) Info(msg string, fields ...Field)  { l.log(INFO, msg, fields) }
func (l *Logger) Warn(msg string, fields ...Field)  { l.log(WARN, msg, fields) }
func (l *Logger) Error(msg string, fields ...Field) { l.log(ERROR, msg, fields) }

func (l *Logger) Entries() []Entry { return l.entries }

// levelName returns the padded display name for a level.
func levelName(lv Level) string {
	switch lv {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO "
	case WARN:
		return "WARN "
	case ERROR:
		return "ERROR"
	default:
		return "?????"
	}
}

// FormatEntry formats a log entry as a human-readable string.
// Format: [LEVEL] YYYY-MM-DD HH:MM:SS message key1=val1 key2=val2
func FormatEntry(e Entry) string {
	// TODO: implement
	// 1. Format level with levelName()
	// 2. Format timestamp with "2006-01-02 15:04:05"
	// 3. Sort field keys alphabetically
	// 4. Build "key=value" pairs
	// 5. Combine into final string
	return ""
}

// Ensure fmt, sort, strings imports are used
var _ = fmt.Sprintf
var _ = sort.Strings
var _ = strings.Join

func main() {}
`,
  testCode: `package main

import (
	"bytes"
	"strings"
	"testing"
	"time"
)

func TestFormatEntryBasic(t *testing.T) {
	ts, _ := time.Parse("2006-01-02 15:04:05", "2024-03-15 10:30:00")
	e := Entry{
		Level:     INFO,
		Message:   "server started",
		Timestamp: ts,
		Fields:    map[string]string{},
	}
	got := FormatEntry(e)
	expected := "[INFO ] 2024-03-15 10:30:00 server started"
	if strings.TrimSpace(got) != expected {
		t.Errorf("expected %q, got %q", expected, strings.TrimSpace(got))
	}
}

func TestFormatEntryWithFields(t *testing.T) {
	ts, _ := time.Parse("2006-01-02 15:04:05", "2024-03-15 10:30:00")
	e := Entry{
		Level:     WARN,
		Message:   "high latency",
		Timestamp: ts,
		Fields:    map[string]string{"duration": "500ms", "api": "/health"},
	}
	got := FormatEntry(e)
	expected := "[WARN ] 2024-03-15 10:30:00 high latency api=/health duration=500ms"
	if strings.TrimSpace(got) != expected {
		t.Errorf("expected %q, got %q", expected, strings.TrimSpace(got))
	}
}

func TestFormatEntryFieldsSorted(t *testing.T) {
	ts, _ := time.Parse("2006-01-02 15:04:05", "2024-01-01 00:00:00")
	e := Entry{
		Level:     DEBUG,
		Message:   "test",
		Timestamp: ts,
		Fields:    map[string]string{"z": "1", "a": "2", "m": "3"},
	}
	got := FormatEntry(e)
	if !strings.Contains(got, "a=2 m=3 z=1") {
		t.Errorf("fields not sorted alphabetically: %q", got)
	}
}

func TestLoggerWithOutput(t *testing.T) {
	var buf bytes.Buffer
	l := NewLoggerWithOutput(DEBUG, &buf)
	if l == nil {
		t.Fatal("NewLoggerWithOutput returned nil")
	}
	l.Info("hello", Field{Key: "user", Value: "alice"})
	output := buf.String()
	if !strings.Contains(output, "[INFO ]") {
		t.Errorf("output missing level: %q", output)
	}
	if !strings.Contains(output, "hello") {
		t.Errorf("output missing message: %q", output)
	}
	if !strings.Contains(output, "user=alice") {
		t.Errorf("output missing field: %q", output)
	}
}

func TestLoggerWithOutputMultiple(t *testing.T) {
	var buf bytes.Buffer
	l := NewLoggerWithOutput(DEBUG, &buf)
	l.Info("first")
	l.Warn("second")
	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 2 {
		t.Fatalf("expected 2 lines, got %d: %q", len(lines), buf.String())
	}
	if !strings.Contains(lines[0], "first") {
		t.Errorf("first line missing message: %q", lines[0])
	}
	if !strings.Contains(lines[1], "second") {
		t.Errorf("second line missing message: %q", lines[1])
	}
}

func TestLoggerWithOutputFiltering(t *testing.T) {
	var buf bytes.Buffer
	l := NewLoggerWithOutput(ERROR, &buf)
	l.Debug("nope")
	l.Info("nope")
	l.Warn("nope")
	l.Error("yes")
	output := buf.String()
	lines := strings.Split(strings.TrimSpace(output), "\\n")
	if len(lines) != 1 {
		t.Fatalf("expected 1 line, got %d: %q", len(lines), output)
	}
	if !strings.Contains(lines[0], "yes") {
		t.Errorf("expected error message: %q", lines[0])
	}
}

func TestLoggerWithOutputStillStoresEntries(t *testing.T) {
	var buf bytes.Buffer
	l := NewLoggerWithOutput(DEBUG, &buf)
	l.Info("stored")
	entries := l.Entries()
	if len(entries) != 1 {
		t.Fatalf("expected 1 stored entry, got %d", len(entries))
	}
}

func TestFormatEntryErrorLevel(t *testing.T) {
	ts, _ := time.Parse("2006-01-02 15:04:05", "2024-06-01 12:00:00")
	e := Entry{
		Level:     ERROR,
		Message:   "disk full",
		Timestamp: ts,
		Fields:    map[string]string{},
	}
	got := FormatEntry(e)
	if !strings.Contains(got, "[ERROR]") {
		t.Errorf("expected [ERROR] in output: %q", got)
	}
}
`,
  solution: `package main

import (
	"fmt"
	"io"
	"sort"
	"strings"
	"time"
)

type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

type Field struct {
	Key   string
	Value string
}

type Entry struct {
	Level     Level
	Message   string
	Timestamp time.Time
	Fields    map[string]string
}

type Logger struct {
	minLevel Level
	entries  []Entry
	writer   io.Writer
}

func NewLogger(minLevel Level) *Logger {
	return &Logger{minLevel: minLevel, entries: []Entry{}}
}

func NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger {
	return &Logger{minLevel: minLevel, entries: []Entry{}, writer: w}
}

func (l *Logger) log(level Level, msg string, fields []Field) {
	if level < l.minLevel {
		return
	}
	fmap := make(map[string]string)
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	entry := Entry{
		Level:     level,
		Message:   msg,
		Timestamp: time.Now(),
		Fields:    fmap,
	}
	l.entries = append(l.entries, entry)
	if l.writer != nil {
		fmt.Fprint(l.writer, FormatEntry(entry))
	}
}

func (l *Logger) Debug(msg string, fields ...Field) { l.log(DEBUG, msg, fields) }
func (l *Logger) Info(msg string, fields ...Field)  { l.log(INFO, msg, fields) }
func (l *Logger) Warn(msg string, fields ...Field)  { l.log(WARN, msg, fields) }
func (l *Logger) Error(msg string, fields ...Field) { l.log(ERROR, msg, fields) }

func (l *Logger) Entries() []Entry { return l.entries }

func levelName(lv Level) string {
	switch lv {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO "
	case WARN:
		return "WARN "
	case ERROR:
		return "ERROR"
	default:
		return "?????"
	}
}

func FormatEntry(e Entry) string {
	ts := e.Timestamp.Format("2006-01-02 15:04:05")
	var sb strings.Builder
	fmt.Fprintf(&sb, "[%s] %s %s", levelName(e.Level), ts, e.Message)

	if len(e.Fields) > 0 {
		keys := make([]string, 0, len(e.Fields))
		for k := range e.Fields {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for _, k := range keys {
			fmt.Fprintf(&sb, " %s=%s", k, e.Fields[k])
		}
	}
	sb.WriteString("\\n")
	return sb.String()
}

func main() {}
`,
  hints: [
    'NewLoggerWithOutput is like NewLogger but also stores the io.Writer in the Logger struct',
    'In the log method, after appending the entry, check if l.writer != nil and write FormatEntry(entry) to it',
    'Use sort.Strings to sort the field keys alphabetically before building the output',
    'Use fmt.Fprintf with a strings.Builder to assemble the formatted string efficiently',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-log-03',
  title: 'Structured Logger — JSON Output',
  category: 'Projects',
  subcategory: 'Structured Logger',
  difficulty: 'intermediate',
  order: 145,
  projectId: 'proj-log',
  step: 3,
  totalSteps: 6,
  description: `Add JSON-formatted output so logs can be consumed by log aggregation systems.

**Requirements:**
- Implement NewJSONLogger(minLevel Level, w io.Writer) *Logger — creates a logger that writes JSON lines
- Each entry outputs one JSON line: \`{"level":"INFO","message":"...","timestamp":"...","key":"val"}\`
- Timestamp in RFC3339 format (time.RFC3339)
- Level as uppercase string
- Fields are flattened into the top-level JSON object
- One JSON object per line (JSONL format)

The Logger struct gets a new \`format\` field ("text" or "json") to select the formatter.`,
  code: `package main

import (
	"encoding/json"
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
	format   string
}

func NewLogger(minLevel Level) *Logger {
	return &Logger{minLevel: minLevel}
}

func NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger {
	return &Logger{minLevel: minLevel, writer: w, format: "text"}
}

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

func levelString(lv Level) string {
	switch lv {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO"
	case WARN:
		return "WARN"
	case ERROR:
		return "ERROR"
	default:
		return "UNKNOWN"
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

func (l *Logger) log(level Level, msg string, fields []Field) {
	if level < l.minLevel {
		return
	}
	fmap := make(map[string]string)
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	entry := Entry{Level: level, Message: msg, Timestamp: time.Now(), Fields: fmap}
	l.entries = append(l.entries, entry)
	if l.writer != nil {
		switch l.format {
		case "json":
			fmt.Fprint(l.writer, FormatJSON(entry))
		default:
			fmt.Fprint(l.writer, FormatEntry(entry))
		}
	}
}

func (l *Logger) Debug(msg string, fields ...Field) { l.log(DEBUG, msg, fields) }
func (l *Logger) Info(msg string, fields ...Field)  { l.log(INFO, msg, fields) }
func (l *Logger) Warn(msg string, fields ...Field)  { l.log(WARN, msg, fields) }
func (l *Logger) Error(msg string, fields ...Field) { l.log(ERROR, msg, fields) }
func (l *Logger) Entries() []Entry                  { return l.entries }

// TODO: Implement NewJSONLogger(minLevel Level, w io.Writer) *Logger

// TODO: Implement FormatJSON(e Entry) string
//   Build a map with "level", "message", "timestamp", plus all fields
//   Marshal to JSON, append newline

// Suppress unused import warnings
var _ = json.Marshal

func main() {}
`,
  testCode: `package main

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
	"time"
)

func TestFormatJSONBasic(t *testing.T) {
	ts, _ := time.Parse(time.RFC3339, "2024-03-15T10:30:00Z")
	e := Entry{
		Level:     INFO,
		Message:   "hello",
		Timestamp: ts,
		Fields:    map[string]string{},
	}
	got := FormatJSON(e)
	var m map[string]interface{}
	if err := json.Unmarshal([]byte(got), &m); err != nil {
		t.Fatalf("invalid JSON: %v\\n%s", err, got)
	}
	if m["level"] != "INFO" {
		t.Errorf("level: got %v", m["level"])
	}
	if m["message"] != "hello" {
		t.Errorf("message: got %v", m["message"])
	}
	if m["timestamp"] != "2024-03-15T10:30:00Z" {
		t.Errorf("timestamp: got %v", m["timestamp"])
	}
}

func TestFormatJSONWithFields(t *testing.T) {
	ts, _ := time.Parse(time.RFC3339, "2024-03-15T10:30:00Z")
	e := Entry{
		Level:     WARN,
		Message:   "slow",
		Timestamp: ts,
		Fields:    map[string]string{"latency": "500ms", "path": "/api"},
	}
	got := FormatJSON(e)
	var m map[string]interface{}
	if err := json.Unmarshal([]byte(got), &m); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if m["latency"] != "500ms" {
		t.Errorf("latency: got %v", m["latency"])
	}
	if m["path"] != "/api" {
		t.Errorf("path: got %v", m["path"])
	}
}

func TestJSONLoggerOutput(t *testing.T) {
	var buf bytes.Buffer
	l := NewJSONLogger(DEBUG, &buf)
	if l == nil {
		t.Fatal("NewJSONLogger returned nil")
	}
	l.Info("test", Field{Key: "k", Value: "v"})
	output := buf.String()

	var m map[string]interface{}
	if err := json.Unmarshal([]byte(strings.TrimSpace(output)), &m); err != nil {
		t.Fatalf("invalid JSON output: %v\\n%s", err, output)
	}
	if m["message"] != "test" {
		t.Errorf("message: got %v", m["message"])
	}
	if m["k"] != "v" {
		t.Errorf("field k: got %v", m["k"])
	}
}

func TestJSONLoggerMultipleLines(t *testing.T) {
	var buf bytes.Buffer
	l := NewJSONLogger(DEBUG, &buf)
	l.Info("first")
	l.Error("second")
	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 2 {
		t.Fatalf("expected 2 JSON lines, got %d", len(lines))
	}
	for i, line := range lines {
		var m map[string]interface{}
		if err := json.Unmarshal([]byte(line), &m); err != nil {
			t.Fatalf("line %d: invalid JSON: %v", i, err)
		}
	}
}

func TestJSONLoggerFiltering(t *testing.T) {
	var buf bytes.Buffer
	l := NewJSONLogger(ERROR, &buf)
	l.Debug("no")
	l.Info("no")
	l.Error("yes")
	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 1 {
		t.Fatalf("expected 1 line, got %d", len(lines))
	}
}

func TestJSONLoggerAllLevels(t *testing.T) {
	levels := []struct {
		fn   func(*Logger, string, ...Field)
		name string
	}{
		{(*Logger).Debug, "DEBUG"},
		{(*Logger).Info, "INFO"},
		{(*Logger).Warn, "WARN"},
		{(*Logger).Error, "ERROR"},
	}
	for _, tc := range levels {
		var buf bytes.Buffer
		l := NewJSONLogger(DEBUG, &buf)
		tc.fn(l, "msg")
		var m map[string]interface{}
		json.Unmarshal([]byte(strings.TrimSpace(buf.String())), &m)
		if m["level"] != tc.name {
			t.Errorf("expected level %s, got %v", tc.name, m["level"])
		}
	}
}
`,
  solution: `package main

import (
	"encoding/json"
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
	format   string
}

func NewLogger(minLevel Level) *Logger {
	return &Logger{minLevel: minLevel}
}

func NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger {
	return &Logger{minLevel: minLevel, writer: w, format: "text"}
}

func NewJSONLogger(minLevel Level, w io.Writer) *Logger {
	return &Logger{minLevel: minLevel, writer: w, format: "json"}
}

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

func levelString(lv Level) string {
	switch lv {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO"
	case WARN:
		return "WARN"
	case ERROR:
		return "ERROR"
	default:
		return "UNKNOWN"
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

func FormatJSON(e Entry) string {
	m := map[string]interface{}{
		"level":     levelString(e.Level),
		"message":   e.Message,
		"timestamp": e.Timestamp.Format(time.RFC3339),
	}
	for k, v := range e.Fields {
		m[k] = v
	}
	data, _ := json.Marshal(m)
	return string(data) + "\\n"
}

func (l *Logger) log(level Level, msg string, fields []Field) {
	if level < l.minLevel {
		return
	}
	fmap := make(map[string]string)
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	entry := Entry{Level: level, Message: msg, Timestamp: time.Now(), Fields: fmap}
	l.entries = append(l.entries, entry)
	if l.writer != nil {
		switch l.format {
		case "json":
			fmt.Fprint(l.writer, FormatJSON(entry))
		default:
			fmt.Fprint(l.writer, FormatEntry(entry))
		}
	}
}

func (l *Logger) Debug(msg string, fields ...Field) { l.log(DEBUG, msg, fields) }
func (l *Logger) Info(msg string, fields ...Field)  { l.log(INFO, msg, fields) }
func (l *Logger) Warn(msg string, fields ...Field)  { l.log(WARN, msg, fields) }
func (l *Logger) Error(msg string, fields ...Field) { l.log(ERROR, msg, fields) }
func (l *Logger) Entries() []Entry                  { return l.entries }

func main() {}
`,
  hints: [
    'FormatJSON builds a map[string]interface{} with "level", "message", "timestamp", plus all Fields entries.',
    'Use json.Marshal to serialize the map, then append "\\n" for JSONL format.',
    'Use levelString() (not levelName which has padding) for the JSON level value.',
    'NewJSONLogger is like NewLoggerWithOutput but sets format to "json".',
  ],
}

export default exercise

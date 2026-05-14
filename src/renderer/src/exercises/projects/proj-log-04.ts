import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-log-04',
  title: 'Structured Logger — Thread-Safe & Child Loggers',
  category: 'Projects',
  subcategory: 'Structured Logger',
  difficulty: 'advanced',
  order: 146,
  projectId: 'proj-log',
  step: 4,
  totalSteps: 6,
  description: `Make the logger safe for concurrent use and add child loggers with inherited fields.

**Requirements:**
1. Protect all writes with sync.Mutex so concurrent goroutines can log safely.
2. Add WithFields(fields ...Field) *Logger — returns a child logger that:
   - Shares the same writer, minLevel, format, and mutex as the parent
   - Prepends its own base fields to every log call
   - Child fields don't leak back to the parent
3. Multiple children can be created from the same parent.`,
  code: `package main

import (
	"encoding/json"
	"fmt"
	"io"
	"sort"
	"strings"
	"sync"
	"time"
)

type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

type Field struct{ Key, Value string }

type Entry struct {
	Level     Level
	Message   string
	Timestamp time.Time
	Fields    map[string]string
}

type Logger struct {
	mu         *sync.Mutex
	minLevel   Level
	entries    []Entry
	writer     io.Writer
	format     string
	baseFields []Field
}

func NewLogger(minLevel Level) *Logger {
	return &Logger{mu: &sync.Mutex{}, minLevel: minLevel}
}

func NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger {
	return &Logger{mu: &sync.Mutex{}, minLevel: minLevel, writer: w, format: "text"}
}

func NewJSONLogger(minLevel Level, w io.Writer) *Logger {
	return &Logger{mu: &sync.Mutex{}, minLevel: minLevel, writer: w, format: "json"}
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
		"level": levelString(e.Level), "message": e.Message,
		"timestamp": e.Timestamp.Format(time.RFC3339),
	}
	for k, v := range e.Fields {
		m[k] = v
	}
	data, _ := json.Marshal(m)
	return string(data) + "\\n"
}

// TODO: Implement WithFields(fields ...Field) *Logger
//   - Returns a new Logger sharing mu, writer, format, minLevel
//   - Copies parent's baseFields + new fields into child's baseFields

// TODO: Update log() method to merge baseFields with per-call fields (baseFields first, then call fields override)

func (l *Logger) log(level Level, msg string, fields []Field) {
	if level < l.minLevel {
		return
	}
	fmap := make(map[string]string)
	// TODO: first apply baseFields, then per-call fields
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	entry := Entry{Level: level, Message: msg, Timestamp: time.Now(), Fields: fmap}
	// TODO: protect with l.mu.Lock()/Unlock()
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
  testCode: `package main

import (
	"bytes"
	"encoding/json"
	"strings"
	"sync"
	"testing"
)

func TestWithFieldsInherits(t *testing.T) {
	var buf bytes.Buffer
	parent := NewJSONLogger(DEBUG, &buf)
	child := parent.WithFields(Field{Key: "service", Value: "api"})
	if child == nil {
		t.Fatal("WithFields returned nil")
	}
	child.Info("request")
	output := strings.TrimSpace(buf.String())
	var m map[string]interface{}
	json.Unmarshal([]byte(output), &m)
	if m["service"] != "api" {
		t.Errorf("child missing inherited field: %v", m)
	}
	if m["message"] != "request" {
		t.Errorf("wrong message: %v", m)
	}
}

func TestWithFieldsDoesNotLeakToParent(t *testing.T) {
	var buf bytes.Buffer
	parent := NewJSONLogger(DEBUG, &buf)
	child := parent.WithFields(Field{Key: "child_only", Value: "yes"})
	_ = child

	buf.Reset()
	parent.Info("parent log")
	output := strings.TrimSpace(buf.String())
	var m map[string]interface{}
	json.Unmarshal([]byte(output), &m)
	if _, ok := m["child_only"]; ok {
		t.Error("child field leaked to parent")
	}
}

func TestWithFieldsOverride(t *testing.T) {
	var buf bytes.Buffer
	parent := NewJSONLogger(DEBUG, &buf)
	child := parent.WithFields(Field{Key: "env", Value: "prod"})
	child.Info("test", Field{Key: "env", Value: "staging"})
	output := strings.TrimSpace(buf.String())
	var m map[string]interface{}
	json.Unmarshal([]byte(output), &m)
	if m["env"] != "staging" {
		t.Errorf("per-call field should override base: got %v", m["env"])
	}
}

func TestWithFieldsMultipleChildren(t *testing.T) {
	var buf bytes.Buffer
	parent := NewJSONLogger(DEBUG, &buf)
	child1 := parent.WithFields(Field{Key: "svc", Value: "auth"})
	child2 := parent.WithFields(Field{Key: "svc", Value: "data"})

	buf.Reset()
	child1.Info("c1")
	child2.Info("c2")
	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 2 {
		t.Fatalf("expected 2 lines, got %d", len(lines))
	}

	var m1, m2 map[string]interface{}
	json.Unmarshal([]byte(lines[0]), &m1)
	json.Unmarshal([]byte(lines[1]), &m2)
	if m1["svc"] != "auth" {
		t.Errorf("child1 svc: %v", m1["svc"])
	}
	if m2["svc"] != "data" {
		t.Errorf("child2 svc: %v", m2["svc"])
	}
}

func TestConcurrentLogging(t *testing.T) {
	var buf bytes.Buffer
	l := NewJSONLogger(DEBUG, &buf)
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			l.Info("concurrent")
		}()
	}
	wg.Wait()

	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 100 {
		t.Fatalf("expected 100 lines, got %d", len(lines))
	}
}

func TestConcurrentChildLogging(t *testing.T) {
	var buf bytes.Buffer
	parent := NewJSONLogger(DEBUG, &buf)
	var wg sync.WaitGroup

	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			child := parent.WithFields(Field{Key: "worker", Value: "w"})
			child.Info("working")
		}()
	}
	wg.Wait()

	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 50 {
		t.Fatalf("expected 50 lines, got %d", len(lines))
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
	"sync"
	"time"
)

type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

type Field struct{ Key, Value string }

type Entry struct {
	Level     Level
	Message   string
	Timestamp time.Time
	Fields    map[string]string
}

type Logger struct {
	mu         *sync.Mutex
	minLevel   Level
	entries    []Entry
	writer     io.Writer
	format     string
	baseFields []Field
}

func NewLogger(minLevel Level) *Logger {
	return &Logger{mu: &sync.Mutex{}, minLevel: minLevel}
}

func NewLoggerWithOutput(minLevel Level, w io.Writer) *Logger {
	return &Logger{mu: &sync.Mutex{}, minLevel: minLevel, writer: w, format: "text"}
}

func NewJSONLogger(minLevel Level, w io.Writer) *Logger {
	return &Logger{mu: &sync.Mutex{}, minLevel: minLevel, writer: w, format: "json"}
}

func (l *Logger) WithFields(fields ...Field) *Logger {
	combined := make([]Field, len(l.baseFields)+len(fields))
	copy(combined, l.baseFields)
	copy(combined[len(l.baseFields):], fields)
	return &Logger{
		mu:         l.mu,
		minLevel:   l.minLevel,
		writer:     l.writer,
		format:     l.format,
		baseFields: combined,
	}
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
		"level": levelString(e.Level), "message": e.Message,
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
	for _, f := range l.baseFields {
		fmap[f.Key] = f.Value
	}
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	entry := Entry{Level: level, Message: msg, Timestamp: time.Now(), Fields: fmap}
	l.mu.Lock()
	l.entries = append(l.entries, entry)
	if l.writer != nil {
		switch l.format {
		case "json":
			fmt.Fprint(l.writer, FormatJSON(entry))
		default:
			fmt.Fprint(l.writer, FormatEntry(entry))
		}
	}
	l.mu.Unlock()
}

func (l *Logger) Debug(msg string, fields ...Field) { l.log(DEBUG, msg, fields) }
func (l *Logger) Info(msg string, fields ...Field)  { l.log(INFO, msg, fields) }
func (l *Logger) Warn(msg string, fields ...Field)  { l.log(WARN, msg, fields) }
func (l *Logger) Error(msg string, fields ...Field) { l.log(ERROR, msg, fields) }
func (l *Logger) Entries() []Entry                  { return l.entries }

func main() {}
`,
  hints: [
    'WithFields creates a new Logger that shares mu, writer, format, minLevel but has its own baseFields slice.',
    'Copy the parent baseFields into a new slice, then append the new fields — this prevents mutation of the parent.',
    'In log(), iterate baseFields first, then per-call fields. Later entries in the map overwrite earlier ones.',
    'Wrap the entries append and writer write with l.mu.Lock()/Unlock().',
  ],
}

export default exercise

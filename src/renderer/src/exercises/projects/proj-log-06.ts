import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-log-06',
  title: 'Structured Logger — Handler Interface & Middleware',
  category: 'Projects',
  subcategory: 'Structured Logger',
  difficulty: 'expert',
  order: 148,
  projectId: 'proj-log',
  step: 6,
  totalSteps: 6,
  description: `Abstract the output into a Handler interface and build composable middleware handlers.

**Requirements:**
1. Handler interface: \`Handle(Entry) error\` and \`Enabled(Level) bool\`
2. WriterHandler(w io.Writer, format string) Handler — writes formatted entries (text or json)
3. MultiHandler(handlers ...Handler) Handler — fans out to multiple handlers
4. FilterHandler(minLevel Level, next Handler) Handler — only forwards if level >= minLevel
5. SamplingHandler(rate int, next Handler) Handler — forwards every Nth entry (1st, N+1th, 2N+1th, ...)
6. NewHandlerLogger(h Handler) *HandlerLogger — logger that delegates to a Handler
   - Info/Debug/Warn/Error methods, same Field API`,
  code: `package main

import (
	"encoding/json"
	"fmt"
	"io"
	"sort"
	"strings"
	"sync"
	"sync/atomic"
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

// --- Handler Interface ---

// TODO: Define Handler interface { Handle(Entry) error; Enabled(Level) bool }

// TODO: Implement WriterHandler(w io.Writer, format string) Handler

// TODO: Implement MultiHandler(handlers ...Handler) Handler

// TODO: Implement FilterHandler(minLevel Level, next Handler) Handler

// TODO: Implement SamplingHandler(rate int, next Handler) Handler

// TODO: Implement HandlerLogger and NewHandlerLogger(h Handler) *HandlerLogger

var _ = atomic.AddInt64
var _ sync.Mutex

func main() {}
`,
  testCode: `package main

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
)

func TestWriterHandlerText(t *testing.T) {
	var buf bytes.Buffer
	h := WriterHandler(&buf, "text")
	e := Entry{Level: INFO, Message: "hello", Fields: map[string]string{}}
	e.Timestamp = e.Timestamp.UTC()
	if !h.Enabled(INFO) {
		t.Fatal("WriterHandler should be enabled for all levels")
	}
	h.Handle(e)
	if !strings.Contains(buf.String(), "hello") {
		t.Errorf("expected message in output: %q", buf.String())
	}
}

func TestWriterHandlerJSON(t *testing.T) {
	var buf bytes.Buffer
	h := WriterHandler(&buf, "json")
	e := Entry{Level: WARN, Message: "test", Fields: map[string]string{"k": "v"}}
	e.Timestamp = e.Timestamp.UTC()
	h.Handle(e)
	var m map[string]interface{}
	json.Unmarshal([]byte(strings.TrimSpace(buf.String())), &m)
	if m["message"] != "test" {
		t.Errorf("expected test, got %v", m["message"])
	}
	if m["k"] != "v" {
		t.Errorf("expected v, got %v", m["k"])
	}
}

func TestMultiHandler(t *testing.T) {
	var buf1, buf2 bytes.Buffer
	h := MultiHandler(WriterHandler(&buf1, "text"), WriterHandler(&buf2, "text"))
	e := Entry{Level: INFO, Message: "multi", Fields: map[string]string{}}
	e.Timestamp = e.Timestamp.UTC()
	h.Handle(e)
	if !strings.Contains(buf1.String(), "multi") {
		t.Error("handler 1 missing output")
	}
	if !strings.Contains(buf2.String(), "multi") {
		t.Error("handler 2 missing output")
	}
}

func TestFilterHandler(t *testing.T) {
	var buf bytes.Buffer
	h := FilterHandler(WARN, WriterHandler(&buf, "text"))
	if h.Enabled(DEBUG) {
		t.Error("FilterHandler(WARN) should not be enabled for DEBUG")
	}
	if !h.Enabled(ERROR) {
		t.Error("FilterHandler(WARN) should be enabled for ERROR")
	}

	e1 := Entry{Level: INFO, Message: "skip", Fields: map[string]string{}}
	h.Handle(e1)
	e2 := Entry{Level: ERROR, Message: "keep", Fields: map[string]string{}}
	e2.Timestamp = e2.Timestamp.UTC()
	h.Handle(e2)

	output := buf.String()
	if strings.Contains(output, "skip") {
		t.Error("INFO should be filtered")
	}
	if !strings.Contains(output, "keep") {
		t.Error("ERROR should pass filter")
	}
}

func TestSamplingHandler(t *testing.T) {
	var buf bytes.Buffer
	h := SamplingHandler(3, WriterHandler(&buf, "text"))

	for i := 0; i < 9; i++ {
		e := Entry{Level: INFO, Message: strings.Repeat("x", 1), Fields: map[string]string{}}
		e.Timestamp = e.Timestamp.UTC()
		h.Handle(e)
	}

	lines := strings.Split(strings.TrimSpace(buf.String()), "\\n")
	if len(lines) != 3 {
		t.Fatalf("rate=3, 9 entries: expected 3 sampled, got %d", len(lines))
	}
}

func TestSamplingHandlerFirstPasses(t *testing.T) {
	var buf bytes.Buffer
	h := SamplingHandler(5, WriterHandler(&buf, "text"))
	e := Entry{Level: INFO, Message: "first", Fields: map[string]string{}}
	e.Timestamp = e.Timestamp.UTC()
	h.Handle(e)
	if !strings.Contains(buf.String(), "first") {
		t.Error("first entry should always pass sampling")
	}
}

func TestHandlerLogger(t *testing.T) {
	var buf bytes.Buffer
	h := WriterHandler(&buf, "json")
	l := NewHandlerLogger(h)
	if l == nil {
		t.Fatal("NewHandlerLogger returned nil")
	}
	l.Info("test", Field{Key: "a", Value: "b"})
	var m map[string]interface{}
	json.Unmarshal([]byte(strings.TrimSpace(buf.String())), &m)
	if m["message"] != "test" {
		t.Errorf("expected test, got %v", m["message"])
	}
	if m["a"] != "b" {
		t.Errorf("expected b, got %v", m["a"])
	}
}

func TestHandlerLoggerAllLevels(t *testing.T) {
	var buf bytes.Buffer
	l := NewHandlerLogger(WriterHandler(&buf, "text"))
	l.Debug("d")
	l.Info("i")
	l.Warn("w")
	l.Error("e")
	output := buf.String()
	for _, msg := range []string{"d", "i", "w", "e"} {
		if !strings.Contains(output, msg) {
			t.Errorf("missing message %q", msg)
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
	"sync"
	"sync/atomic"
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

type Handler interface {
	Handle(Entry) error
	Enabled(Level) bool
}

type writerHandler struct {
	mu     sync.Mutex
	w      io.Writer
	format string
}

func (h *writerHandler) Handle(e Entry) error {
	h.mu.Lock()
	defer h.mu.Unlock()
	var s string
	if h.format == "json" {
		s = FormatJSON(e)
	} else {
		s = FormatEntry(e)
	}
	_, err := fmt.Fprint(h.w, s)
	return err
}

func (h *writerHandler) Enabled(Level) bool { return true }

func WriterHandler(w io.Writer, format string) Handler {
	return &writerHandler{w: w, format: format}
}

type multiHandler struct{ handlers []Handler }

func (m *multiHandler) Handle(e Entry) error {
	for _, h := range m.handlers {
		if err := h.Handle(e); err != nil {
			return err
		}
	}
	return nil
}

func (m *multiHandler) Enabled(lv Level) bool {
	for _, h := range m.handlers {
		if h.Enabled(lv) {
			return true
		}
	}
	return false
}

func MultiHandler(handlers ...Handler) Handler {
	return &multiHandler{handlers: handlers}
}

type filterHandler struct {
	minLevel Level
	next     Handler
}

func (f *filterHandler) Handle(e Entry) error {
	if e.Level < f.minLevel {
		return nil
	}
	return f.next.Handle(e)
}

func (f *filterHandler) Enabled(lv Level) bool {
	return lv >= f.minLevel
}

func FilterHandler(minLevel Level, next Handler) Handler {
	return &filterHandler{minLevel: minLevel, next: next}
}

type samplingHandler struct {
	rate  int64
	count int64
	next  Handler
}

func (s *samplingHandler) Handle(e Entry) error {
	n := atomic.AddInt64(&s.count, 1)
	if (n-1)%s.rate == 0 {
		return s.next.Handle(e)
	}
	return nil
}

func (s *samplingHandler) Enabled(lv Level) bool { return s.next.Enabled(lv) }

func SamplingHandler(rate int, next Handler) Handler {
	return &samplingHandler{rate: int64(rate), next: next}
}

type HandlerLogger struct {
	handler Handler
}

func NewHandlerLogger(h Handler) *HandlerLogger {
	return &HandlerLogger{handler: h}
}

func (l *HandlerLogger) log(level Level, msg string, fields []Field) {
	fmap := make(map[string]string)
	for _, f := range fields {
		fmap[f.Key] = f.Value
	}
	e := Entry{Level: level, Message: msg, Timestamp: time.Now(), Fields: fmap}
	l.handler.Handle(e)
}

func (l *HandlerLogger) Debug(msg string, fields ...Field) { l.log(DEBUG, msg, fields) }
func (l *HandlerLogger) Info(msg string, fields ...Field)  { l.log(INFO, msg, fields) }
func (l *HandlerLogger) Warn(msg string, fields ...Field)  { l.log(WARN, msg, fields) }
func (l *HandlerLogger) Error(msg string, fields ...Field) { l.log(ERROR, msg, fields) }

func main() {}
`,
  hints: [
    'Handler is an interface with Handle(Entry) error and Enabled(Level) bool.',
    'SamplingHandler uses atomic.AddInt64 to count entries thread-safely. Forward when (count-1) % rate == 0.',
    'MultiHandler iterates its handlers and calls Handle on each. Enabled returns true if any handler is enabled.',
    'FilterHandler checks e.Level >= minLevel before forwarding to next.Handle.',
  ],
}

export default exercise

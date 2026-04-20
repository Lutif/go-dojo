import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_24_slog',
  title: 'log/slog Structured Logging',
  category: 'Standard Library',
  subcategory: 'Logging',
  difficulty: 'intermediate',
  order: 24,
  description: `\`log/slog\` (Go 1.21+) provides structured, leveled logging:

\`\`\`
slog.Info("user login", "username", "alice", "ip", "1.2.3.4")
// 2024/03/15 14:30:00 INFO user login username=alice ip=1.2.3.4

slog.Error("request failed", "err", err, "status", 500)
\`\`\`

Custom loggers with handlers:
\`\`\`
handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
})
logger := slog.New(handler)
logger.Info("structured", "key", "value")
// {"time":"...","level":"INFO","msg":"structured","key":"value"}
\`\`\`

Logger groups add prefixes:
\`\`\`
dbLogger := logger.WithGroup("db")
dbLogger.Info("query", "sql", "SELECT ...")
// {"time":"...","level":"INFO","msg":"query","db":{"sql":"SELECT ..."}}
\`\`\`

Your task: work with structured logging.`,
  code: `package main

import (
	"bytes"
	"log/slog"
)

// NewJSONLogger creates a slog.Logger that writes JSON to the given buffer.
func NewJSONLogger(buf *bytes.Buffer) *slog.Logger {
	// TODO: Use slog.NewJSONHandler
	return nil
}

// NewLeveledLogger creates a logger that only logs at the given level or above.
func NewLeveledLogger(buf *bytes.Buffer, level slog.Level) *slog.Logger {
	// TODO: Use HandlerOptions{Level: level}
	return nil
}

// LogRequest logs a request with method, path, and status fields.
func LogRequest(logger *slog.Logger, method, path string, status int) {
	// TODO: Use logger.Info with key-value pairs
}

// NewGroupLogger creates a logger with a group prefix.
func NewGroupLogger(logger *slog.Logger, group string) *slog.Logger {
	// TODO: Use logger.WithGroup
	return nil
}

var _ = slog.New`,
  testCode: `package main

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"testing"
)

func TestNewJSONLogger(t *testing.T) {
	var buf bytes.Buffer
	logger := NewJSONLogger(&buf)
	logger.Info("test", "key", "value")

	var entry map[string]interface{}
	if err := json.Unmarshal(buf.Bytes(), &entry); err != nil {
		t.Fatalf("not valid JSON: %v\n%s", err, buf.String())
	}
	if entry["msg"] != "test" {
		t.Errorf("msg = %v", entry["msg"])
	}
	if entry["key"] != "value" {
		t.Errorf("key = %v", entry["key"])
	}
}

func TestNewLeveledLoggerFilters(t *testing.T) {
	var buf bytes.Buffer
	logger := NewLeveledLogger(&buf, slog.LevelWarn)
	logger.Info("should not appear")
	if buf.Len() > 0 {
		t.Errorf("Info should be filtered: %s", buf.String())
	}
}

func TestNewLeveledLoggerAllows(t *testing.T) {
	var buf bytes.Buffer
	logger := NewLeveledLogger(&buf, slog.LevelWarn)
	logger.Warn("should appear")
	if buf.Len() == 0 {
		t.Error("Warn should not be filtered")
	}
}

func TestLogRequest(t *testing.T) {
	var buf bytes.Buffer
	logger := NewJSONLogger(&buf)
	LogRequest(logger, "GET", "/api/users", 200)

	var entry map[string]interface{}
	if err := json.Unmarshal(buf.Bytes(), &entry); err != nil {
		t.Fatalf("not valid JSON: %v", err)
	}
	if entry["method"] != "GET" {
		t.Errorf("method = %v", entry["method"])
	}
	if entry["path"] != "/api/users" {
		t.Errorf("path = %v", entry["path"])
	}
	// JSON numbers are float64
	if entry["status"] != float64(200) {
		t.Errorf("status = %v", entry["status"])
	}
}

func TestNewGroupLogger(t *testing.T) {
	var buf bytes.Buffer
	logger := NewJSONLogger(&buf)
	dbLogger := NewGroupLogger(logger, "db")
	dbLogger.Info("query", "sql", "SELECT 1")

	var entry map[string]interface{}
	if err := json.Unmarshal(buf.Bytes(), &entry); err != nil {
		t.Fatalf("not valid JSON: %v", err)
	}
	// Group wraps attrs in a nested object
	group, ok := entry["db"].(map[string]interface{})
	if !ok {
		t.Fatalf("expected db group, got %v", entry)
	}
	if group["sql"] != "SELECT 1" {
		t.Errorf("sql = %v", group["sql"])
	}
}`,
  solution: `package main

import (
	"bytes"
	"log/slog"
)

func NewJSONLogger(buf *bytes.Buffer) *slog.Logger {
	handler := slog.NewJSONHandler(buf, nil)
	return slog.New(handler)
}

func NewLeveledLogger(buf *bytes.Buffer, level slog.Level) *slog.Logger {
	handler := slog.NewJSONHandler(buf, &slog.HandlerOptions{
		Level: level,
	})
	return slog.New(handler)
}

func LogRequest(logger *slog.Logger, method, path string, status int) {
	logger.Info("request", "method", method, "path", path, "status", status)
}

func NewGroupLogger(logger *slog.Logger, group string) *slog.Logger {
	return logger.WithGroup(group)
}

var _ = slog.New`,
  hints: [
    'NewJSONLogger: slog.NewJSONHandler(buf, nil) creates a JSON handler. Wrap with slog.New().',
    'NewLeveledLogger: pass &slog.HandlerOptions{Level: level} as the second argument to NewJSONHandler.',
    'LogRequest: logger.Info("request", "method", method, "path", path, "status", status).'
  ],
}

export default exercise

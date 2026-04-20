import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_10_dependency_injection',
  title: 'Dependency Injection',
  category: 'Patterns',
  subcategory: 'Structural',
  difficulty: 'intermediate',
  order: 10,
  description: `Dependency injection (DI) means passing dependencies to an object instead of letting it create them. In Go, this is done naturally via constructor functions that accept interfaces:

\`\`\`go
type Notifier interface {
    Notify(msg string) error
}

type OrderService struct {
    notifier Notifier
}

func NewOrderService(n Notifier) *OrderService {
    return &OrderService{notifier: n}
}
\`\`\`

This makes testing easy -- inject a mock instead of a real implementation.

Your task: build a \`Service\` that depends on \`Logger\` and \`Store\` interfaces.

1. Define a \`Logger\` interface with \`Log(msg string)\`
2. Define a \`Store\` interface with \`Get(key string) (string, bool)\` and \`Set(key string, value string)\`
3. Define a \`Service\` struct with unexported fields \`logger Logger\` and \`store Store\`
4. Implement \`NewService(l Logger, s Store) *Service\`
5. Implement \`(svc *Service) Process(key, value string) string\` that:
   - Calls \`svc.logger.Log("processing: " + key)\`
   - Calls \`svc.store.Set(key, value)\`
   - Calls \`svc.store.Get(key)\` and returns the retrieved value (or "not found" if missing)
6. Implement \`ConsoleLogger\` struct (satisfies Logger) that appends messages to a \`Messages []string\` slice
7. Implement \`MapStore\` struct (satisfies Store) backed by a \`Data map[string]string\` field
8. Implement \`NewMapStore() *MapStore\` that initializes the map`,
  code: `package main

// TODO: Define Logger interface with Log(msg string)

// TODO: Define Store interface with Get(key string) (string, bool) and Set(key string, value string)

// TODO: Define Service struct with unexported fields: logger Logger, store Store

// TODO: Implement NewService(l Logger, s Store) *Service

// TODO: Implement (svc *Service) Process(key, value string) string
// 1. Log "processing: " + key
// 2. Set key/value in store
// 3. Get key from store and return the value (or "not found")

// TODO: Define ConsoleLogger struct with Messages []string
// Implement Log(msg string) that appends to Messages

// TODO: Define MapStore struct with Data map[string]string
// Implement Get and Set methods

// TODO: Implement NewMapStore() *MapStore

func main() {}`,
  testCode: `package main

import "testing"

// Verify interface satisfaction
var _ Logger = (*ConsoleLogger)(nil)
var _ Store = (*MapStore)(nil)

func TestNewService(t *testing.T) {
	logger := &ConsoleLogger{}
	store := NewMapStore()
	svc := NewService(logger, store)
	if svc == nil {
		t.Fatal("NewService returned nil")
	}
}

func TestProcessStoresAndRetrieves(t *testing.T) {
	logger := &ConsoleLogger{}
	store := NewMapStore()
	svc := NewService(logger, store)

	result := svc.Process("name", "Go")
	if result != "Go" {
		t.Errorf("Process() = %q, want %q", result, "Go")
	}
}

func TestProcessLogs(t *testing.T) {
	logger := &ConsoleLogger{}
	store := NewMapStore()
	svc := NewService(logger, store)

	svc.Process("lang", "Go")
	if len(logger.Messages) != 1 {
		t.Fatalf("expected 1 log message, got %d", len(logger.Messages))
	}
	if logger.Messages[0] != "processing: lang" {
		t.Errorf("log message = %q, want %q", logger.Messages[0], "processing: lang")
	}
}

func TestProcessMultiple(t *testing.T) {
	logger := &ConsoleLogger{}
	store := NewMapStore()
	svc := NewService(logger, store)

	svc.Process("a", "1")
	svc.Process("b", "2")
	svc.Process("c", "3")

	if len(logger.Messages) != 3 {
		t.Errorf("expected 3 log messages, got %d", len(logger.Messages))
	}

	// Verify store has all values
	if v, ok := store.Get("a"); !ok || v != "1" {
		t.Errorf("store.Get(a) = (%q, %v), want (%q, true)", v, ok, "1")
	}
	if v, ok := store.Get("b"); !ok || v != "2" {
		t.Errorf("store.Get(b) = (%q, %v), want (%q, true)", v, ok, "2")
	}
}

func TestProcessOverwrite(t *testing.T) {
	logger := &ConsoleLogger{}
	store := NewMapStore()
	svc := NewService(logger, store)

	svc.Process("key", "old")
	result := svc.Process("key", "new")
	if result != "new" {
		t.Errorf("Process() after overwrite = %q, want %q", result, "new")
	}
}

func TestMapStoreGetMissing(t *testing.T) {
	store := NewMapStore()
	v, ok := store.Get("missing")
	if ok {
		t.Error("Get on missing key should return false")
	}
	if v != "" {
		t.Errorf("Get on missing key returned %q, want empty string", v)
	}
}

func TestConsoleLoggerMultiple(t *testing.T) {
	logger := &ConsoleLogger{}
	logger.Log("one")
	logger.Log("two")
	logger.Log("three")
	if len(logger.Messages) != 3 {
		t.Errorf("Messages length = %d, want 3", len(logger.Messages))
	}
}`,
  solution: `package main

type Logger interface {
	Log(msg string)
}

type Store interface {
	Get(key string) (string, bool)
	Set(key string, value string)
}

type Service struct {
	logger Logger
	store  Store
}

func NewService(l Logger, s Store) *Service {
	return &Service{logger: l, store: s}
}

func (svc *Service) Process(key, value string) string {
	svc.logger.Log("processing: " + key)
	svc.store.Set(key, value)
	v, ok := svc.store.Get(key)
	if !ok {
		return "not found"
	}
	return v
}

type ConsoleLogger struct {
	Messages []string
}

func (cl *ConsoleLogger) Log(msg string) {
	cl.Messages = append(cl.Messages, msg)
}

type MapStore struct {
	Data map[string]string
}

func NewMapStore() *MapStore {
	return &MapStore{Data: make(map[string]string)}
}

func (ms *MapStore) Get(key string) (string, bool) {
	v, ok := ms.Data[key]
	return v, ok
}

func (ms *MapStore) Set(key string, value string) {
	ms.Data[key] = value
}

func main() {}`,
  hints: [
    'Define Logger and Store as interfaces. Any struct with matching methods satisfies them.',
    'Service stores its dependencies as unexported fields set by NewService.',
    'Process calls logger.Log, then store.Set, then store.Get and returns the result.',
    'ConsoleLogger.Log appends to a Messages slice; MapStore wraps a map[string]string.',
  ],
}

export default exercise

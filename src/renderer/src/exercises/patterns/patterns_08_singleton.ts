import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_08_singleton',
  title: 'Singleton with sync.Once',
  category: 'Patterns',
  subcategory: 'Creational',
  difficulty: 'intermediate',
  order: 8,
  description: `The singleton pattern ensures that only one instance of a type exists, even when accessed concurrently. In Go, \`sync.Once\` is the idiomatic way to achieve this:

\`\`\`go
var once sync.Once
var instance *Config

func GetConfig() *Config {
    once.Do(func() {
        instance = &Config{Debug: false}
    })
    return instance
}
\`\`\`

\`sync.Once.Do\` guarantees the function runs exactly once, no matter how many goroutines call it simultaneously.

Your task: implement a \`SafeInit\` type that wraps a value and initializes it lazily using \`sync.Once\`.

1. Define a \`SafeInit\` struct with unexported fields: \`once sync.Once\`, \`value string\`, and \`initFunc func() string\`
2. Implement \`NewSafeInit(f func() string) *SafeInit\` that stores the init function
3. Implement \`(s *SafeInit) GetValue() string\` that calls \`initFunc\` via \`once.Do\` on first access and returns the value
4. Implement a package-level singleton: \`var dbOnce sync.Once\` and \`var dbInstance *DBConn\`
5. Define \`DBConn\` struct with a \`DSN string\` field
6. Implement \`GetDBConn(dsn string) *DBConn\` that initializes dbInstance exactly once with the given DSN (subsequent calls with different DSNs still return the first)`,
  code: `package main

import "sync"

// TODO: Define SafeInit struct with fields: once (sync.Once), value (string), initFunc (func() string)

// TODO: Implement NewSafeInit(f func() string) *SafeInit

// TODO: Implement (s *SafeInit) GetValue() string
// Use s.once.Do to call initFunc exactly once, store result in s.value

// TODO: Define DBConn struct with DSN string field

// TODO: Declare package-level vars: dbOnce (sync.Once) and dbInstance (*DBConn)

// TODO: Implement GetDBConn(dsn string) *DBConn
// Uses dbOnce.Do to create dbInstance exactly once

func main() {}`,
  testCode: `package main

import (
	"fmt"
	"sync"
	"testing"
)

func TestSafeInitBasic(t *testing.T) {
	callCount := 0
	si := NewSafeInit(func() string {
		callCount++
		return "initialized"
	})

	val := si.GetValue()
	if val != "initialized" {
		t.Errorf("GetValue() = %q, want %q", val, "initialized")
	}
	if callCount != 1 {
		t.Errorf("initFunc called %d times, want 1", callCount)
	}
}

func TestSafeInitCalledOnce(t *testing.T) {
	callCount := 0
	si := NewSafeInit(func() string {
		callCount++
		return "hello"
	})

	// Call multiple times
	for i := 0; i < 10; i++ {
		si.GetValue()
	}
	if callCount != 1 {
		t.Errorf("initFunc called %d times after 10 GetValue calls, want 1", callCount)
	}
}

func TestSafeInitConcurrent(t *testing.T) {
	callCount := 0
	var mu sync.Mutex
	si := NewSafeInit(func() string {
		mu.Lock()
		callCount++
		mu.Unlock()
		return "concurrent"
	})

	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			val := si.GetValue()
			if val != "concurrent" {
				t.Errorf("GetValue() = %q, want %q", val, "concurrent")
			}
		}()
	}
	wg.Wait()

	mu.Lock()
	defer mu.Unlock()
	if callCount != 1 {
		t.Errorf("initFunc called %d times concurrently, want 1", callCount)
	}
}

func TestGetDBConnSingleton(t *testing.T) {
	// Reset for test isolation
	dbOnce = sync.Once{}
	dbInstance = nil

	conn1 := GetDBConn("postgres://localhost/mydb")
	if conn1 == nil {
		t.Fatal("GetDBConn returned nil")
	}
	if conn1.DSN != "postgres://localhost/mydb" {
		t.Errorf("DSN = %q, want %q", conn1.DSN, "postgres://localhost/mydb")
	}

	// Second call with different DSN should return same instance
	conn2 := GetDBConn("postgres://localhost/otherdb")
	if conn1 != conn2 {
		t.Error("GetDBConn returned different instances; expected singleton")
	}
	if conn2.DSN != "postgres://localhost/mydb" {
		t.Errorf("DSN = %q, want %q (first call wins)", conn2.DSN, "postgres://localhost/mydb")
	}
}

func TestGetDBConnConcurrent(t *testing.T) {
	dbOnce = sync.Once{}
	dbInstance = nil

	var wg sync.WaitGroup
	results := make([]*DBConn, 50)
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			results[idx] = GetDBConn(fmt.Sprintf("dsn-%d", idx))
		}(i)
	}
	wg.Wait()

	first := results[0]
	for i, r := range results {
		if r != first {
			t.Errorf("results[%d] is a different instance than results[0]", i)
		}
	}
}`,
  solution: `package main

import "sync"

type SafeInit struct {
	once     sync.Once
	value    string
	initFunc func() string
}

func NewSafeInit(f func() string) *SafeInit {
	return &SafeInit{initFunc: f}
}

func (s *SafeInit) GetValue() string {
	s.once.Do(func() {
		s.value = s.initFunc()
	})
	return s.value
}

type DBConn struct {
	DSN string
}

var dbOnce sync.Once
var dbInstance *DBConn

func GetDBConn(dsn string) *DBConn {
	dbOnce.Do(func() {
		dbInstance = &DBConn{DSN: dsn}
	})
	return dbInstance
}

func main() {}`,
  hints: [
    'sync.Once has a Do(func()) method that guarantees the function runs exactly once.',
    'Store the initFunc in the struct and call it inside once.Do in GetValue.',
    'For the package-level singleton, declare var dbOnce sync.Once and var dbInstance *DBConn at package scope.',
    'GetDBConn should call dbOnce.Do with a closure that creates the DBConn; subsequent calls skip initialization.',
  ],
}

export default exercise

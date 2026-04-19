import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_06_sentinel',
  title: 'Sentinel Errors',
  category: 'Error Handling',
  subcategory: 'Errors',
  difficulty: 'intermediate',
  order: 6,
  description: `Sentinel errors are package-level error variables that represent specific failure conditions:

\`\`\`
var ErrNotFound = errors.New("not found")
var ErrTimeout  = errors.New("timeout")
\`\`\`

Convention: prefix with \`Err\`. Callers check with \`errors.Is(err, pkg.ErrNotFound)\`.

Sentinels from the standard library: \`io.EOF\`, \`sql.ErrNoRows\`, \`os.ErrNotExist\`.

Your task: define sentinel errors for a cache system.`,
  code: `package main

import (
	"errors"
	"fmt"
)

// TODO: Define sentinel errors:
//   ErrCacheMiss  — "cache miss"
//   ErrCacheFull  — "cache full"
//   ErrKeyExpired — "key expired"

// Cache is a simple string→string cache with a max size
type Cache struct {
	data    map[string]string
	maxSize int
}

// NewCache creates a cache with the given max size
func NewCache(maxSize int) *Cache {
	return &Cache{data: make(map[string]string), maxSize: maxSize}
}

// Get retrieves a value. Returns ErrCacheMiss if key not found.
// If key starts with "expired_", return ErrKeyExpired.
func (c *Cache) Get(key string) (string, error) {
	// TODO
	return "", nil
}

// Set stores a value. Returns ErrCacheFull if at capacity.
func (c *Cache) Set(key, value string) error {
	// TODO
	return nil
}

// GetOrDefault returns the cached value, or defaultVal on any error.
func (c *Cache) GetOrDefault(key, defaultVal string) string {
	// TODO: Use c.Get, return defaultVal on error
	return ""
}

var _ = errors.New
var _ = fmt.Sprintf`,
  testCode: `package main

import (
	"errors"
	"testing"
)

func TestCacheGetMiss(t *testing.T) {
	c := NewCache(10)
	_, err := c.Get("missing")
	if !errors.Is(err, ErrCacheMiss) {
		t.Errorf("expected ErrCacheMiss, got %v", err)
	}
}

func TestCacheSetAndGet(t *testing.T) {
	c := NewCache(10)
	if err := c.Set("key", "value"); err != nil {
		t.Fatalf("Set error: %v", err)
	}
	val, err := c.Get("key")
	if err != nil || val != "value" {
		t.Errorf("Get = (%q, %v), want (value, nil)", val, err)
	}
}

func TestCacheFull(t *testing.T) {
	c := NewCache(2)
	c.Set("a", "1")
	c.Set("b", "2")
	err := c.Set("c", "3")
	if !errors.Is(err, ErrCacheFull) {
		t.Errorf("expected ErrCacheFull, got %v", err)
	}
}

func TestCacheExpired(t *testing.T) {
	c := NewCache(10)
	c.Set("expired_token", "abc")
	_, err := c.Get("expired_token")
	if !errors.Is(err, ErrKeyExpired) {
		t.Errorf("expected ErrKeyExpired, got %v", err)
	}
}

func TestGetOrDefault(t *testing.T) {
	c := NewCache(10)
	c.Set("name", "Go")
	if got := c.GetOrDefault("name", "default"); got != "Go" {
		t.Errorf("got %q, want Go", got)
	}
	if got := c.GetOrDefault("missing", "fallback"); got != "fallback" {
		t.Errorf("got %q, want fallback", got)
	}
}`,
  solution: `package main

import (
	"errors"
	"fmt"
	"strings"
)

var (
	ErrCacheMiss  = errors.New("cache miss")
	ErrCacheFull  = errors.New("cache full")
	ErrKeyExpired = errors.New("key expired")
)

type Cache struct {
	data    map[string]string
	maxSize int
}

func NewCache(maxSize int) *Cache {
	return &Cache{data: make(map[string]string), maxSize: maxSize}
}

func (c *Cache) Get(key string) (string, error) {
	if strings.HasPrefix(key, "expired_") {
		return "", ErrKeyExpired
	}
	val, ok := c.data[key]
	if !ok {
		return "", ErrCacheMiss
	}
	return val, nil
}

func (c *Cache) Set(key, value string) error {
	if _, exists := c.data[key]; !exists && len(c.data) >= c.maxSize {
		return ErrCacheFull
	}
	c.data[key] = value
	return nil
}

func (c *Cache) GetOrDefault(key, defaultVal string) string {
	val, err := c.Get(key)
	if err != nil {
		return defaultVal
	}
	return val
}

var _ = fmt.Sprintf`,
  hints: [
    'Define sentinels at package level: var ErrCacheMiss = errors.New("cache miss")',
    'Return the sentinel directly: return "", ErrCacheMiss',
    'GetOrDefault: call Get, if err != nil return defaultVal, otherwise return the value.'
  ],
}

export default exercise

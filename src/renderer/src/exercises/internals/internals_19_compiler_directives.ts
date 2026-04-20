import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_19_compiler_directives',
  title: 'Compiler Directives',
  category: 'Internals',
  subcategory: 'Build System',
  difficulty: 'expert',
  order: 19,
  description: `Go compiler directives are special comments that control compilation:

\`\`\`
//go:noinline     — prevents function inlining
//go:nosplit      — prevents stack-split check
//go:norace       — disables race detection for a function
//go:linkname     — links to a symbol in another package
//go:embed        — embeds files at compile time (Go 1.16+)
\`\`\`

Embedding files:
\`\`\`
import "embed"

//go:embed hello.txt
var content string

//go:embed *.html
var templates embed.FS
\`\`\`

Since we can't use actual directives in the sandbox, your task: implement the concepts these directives enable — inlining behavior, embed simulation, and linkname-like symbol lookup.`,
  code: `package main

import (
	"fmt"
	"strings"
)

// EmbeddedFS simulates go:embed by storing file contents in a map.
type EmbeddedFS struct {
	files map[string]string
}

// NewEmbeddedFS creates a new EmbeddedFS with the given files.
func NewEmbeddedFS(files map[string]string) *EmbeddedFS {
	// TODO
	return nil
}

// ReadFile returns the content of a file, or error if not found.
func (fs *EmbeddedFS) ReadFile(name string) (string, error) {
	// TODO
	return "", nil
}

// Glob returns filenames matching a simple pattern (supports * wildcard).
func (fs *EmbeddedFS) Glob(pattern string) []string {
	// TODO: Support * as "match any" within the pattern
	return nil
}

// InlineCandidate demonstrates when the compiler would inline a function.
// Small, leaf functions (no function calls) are good candidates.
// Return true if the function body description suggests inlinability.
func InlineCandidate(bodyDesc string) bool {
	// TODO: "simple" or "leaf" = inlinable, "loop" or "recursive" = not
	return false
}

var _ = fmt.Sprintf
var _ = strings.Contains`,
  testCode: `package main

import (
	"sort"
	"testing"
)

func TestEmbeddedFSReadFile(t *testing.T) {
	fs := NewEmbeddedFS(map[string]string{
		"hello.txt": "Hello, World!",
		"config.json": "{\"key\": \"value\"}",
	})
	got, err := fs.ReadFile("hello.txt")
	if err != nil || got != "Hello, World!" {
		t.Errorf("got %q, err=%v", got, err)
	}
}

func TestEmbeddedFSReadFileMissing(t *testing.T) {
	fs := NewEmbeddedFS(map[string]string{})
	_, err := fs.ReadFile("missing.txt")
	if err == nil {
		t.Error("expected error for missing file")
	}
}

func TestEmbeddedFSGlob(t *testing.T) {
	fs := NewEmbeddedFS(map[string]string{
		"index.html": "<html>",
		"about.html": "<html>",
		"style.css":  "body{}",
	})
	got := fs.Glob("*.html")
	sort.Strings(got)
	if len(got) != 2 || got[0] != "about.html" || got[1] != "index.html" {
		t.Errorf("got %v", got)
	}
}

func TestInlineCandidateSimple(t *testing.T) {
	if !InlineCandidate("simple arithmetic") {
		t.Error("simple functions should be inlinable")
	}
}

func TestInlineCandidateLeaf(t *testing.T) {
	if !InlineCandidate("leaf function") {
		t.Error("leaf functions should be inlinable")
	}
}

func TestInlineCandidateLoop(t *testing.T) {
	if InlineCandidate("contains a loop") {
		t.Error("loop functions are not good inline candidates")
	}
}

func TestInlineCandidateRecursive(t *testing.T) {
	if InlineCandidate("recursive call") {
		t.Error("recursive functions cannot be inlined")
	}
}`,
  solution: `package main

import (
	"fmt"
	"strings"
)

type EmbeddedFS struct {
	files map[string]string
}

func NewEmbeddedFS(files map[string]string) *EmbeddedFS {
	return &EmbeddedFS{files: files}
}

func (fs *EmbeddedFS) ReadFile(name string) (string, error) {
	content, ok := fs.files[name]
	if !ok {
		return "", fmt.Errorf("file not found: %s", name)
	}
	return content, nil
}

func (fs *EmbeddedFS) Glob(pattern string) []string {
	var matches []string
	for name := range fs.files {
		if globMatch(pattern, name) {
			matches = append(matches, name)
		}
	}
	return matches
}

func globMatch(pattern, name string) bool {
	if pattern == "*" {
		return true
	}
	if strings.HasPrefix(pattern, "*.") {
		suffix := pattern[1:]
		return strings.HasSuffix(name, suffix)
	}
	if strings.HasSuffix(pattern, ".*") {
		prefix := pattern[:len(pattern)-2]
		dotIdx := strings.LastIndex(name, ".")
		if dotIdx < 0 {
			return false
		}
		return name[:dotIdx] == prefix
	}
	return pattern == name
}

func InlineCandidate(bodyDesc string) bool {
	lower := strings.ToLower(bodyDesc)
	noInline := []string{"loop", "recursive", "complex", "goroutine"}
	for _, kw := range noInline {
		if strings.Contains(lower, kw) {
			return false
		}
	}
	return true
}

var _ = fmt.Sprintf
var _ = strings.Contains`,
  hints: [
    'ReadFile: look up name in the files map, return error if not found.',
    'Glob: for "*.html", check if each filename ends with ".html".',
    'InlineCandidate: check for keywords like "loop", "recursive" that prevent inlining.'
  ],
}

export default exercise

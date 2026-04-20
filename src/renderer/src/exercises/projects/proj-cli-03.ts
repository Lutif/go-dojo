import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-03',
  title: 'CLI Parser — Positional Arguments',
  category: 'Projects',
  subcategory: 'CLI Parser',
  difficulty: 'intermediate',
  order: 12,
  projectId: 'proj-cli',
  step: 3,
  totalSteps: 6,
  description: `Extend the parser to separate flags from positional arguments.

**Requirements:**
- Return both flags and positional args via a ParseResult struct
- Positional args are non-flag arguments (don't start with "-")
- Arguments after "--" are all positional
- Support both -key=value and -key value flag styles (from previous steps)`,
  code: `package main

// ParseResult holds the parsed flags and positional arguments.
type ParseResult struct {
	Flags    map[string]string
	Positional []string
}

// Parse parses command-line arguments into flags and positional args.
func Parse(args []string) ParseResult {
	// TODO: Implement full parse
	// 1. Separate flags from positional arguments
	// 2. Arguments not starting with "-" are positional
	// 3. Arguments after "--" are all positional
	// 4. Support -key=value and -key value styles
	return ParseResult{}
}

func main() {}
`,
  testCode: `package main

import (
	"testing"
)

func TestParseOnlyFlags(t *testing.T) {
	r := Parse([]string{"-name=Alice", "-port", "8080"})
	if r.Flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", r.Flags["name"])
	}
	if r.Flags["port"] != "8080" {
		t.Errorf("expected port=8080, got %s", r.Flags["port"])
	}
	if len(r.Positional) != 0 {
		t.Errorf("expected 0 positional args, got %d", len(r.Positional))
	}
}

func TestParseOnlyPositional(t *testing.T) {
	r := Parse([]string{"hello", "world"})
	if len(r.Positional) != 2 {
		t.Fatalf("expected 2 positional args, got %d", len(r.Positional))
	}
	if r.Positional[0] != "hello" || r.Positional[1] != "world" {
		t.Errorf("expected [hello, world], got %v", r.Positional)
	}
}

func TestParseMixed(t *testing.T) {
	r := Parse([]string{"-verbose", "build", "-output", "main", "extra"})
	if r.Flags["verbose"] != "true" {
		t.Errorf("expected verbose=true, got %s", r.Flags["verbose"])
	}
	if r.Flags["output"] != "main" {
		t.Errorf("expected output=main, got %s", r.Flags["output"])
	}
	if len(r.Positional) != 2 {
		t.Fatalf("expected 2 positional args, got %d", len(r.Positional))
	}
	if r.Positional[0] != "build" || r.Positional[1] != "extra" {
		t.Errorf("expected [build, extra], got %v", r.Positional)
	}
}

func TestParseDoubleDash(t *testing.T) {
	r := Parse([]string{"-name=Alice", "--", "-not-a-flag", "file.txt"})
	if r.Flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", r.Flags["name"])
	}
	if len(r.Positional) != 2 {
		t.Fatalf("expected 2 positional args after --, got %d", len(r.Positional))
	}
	if r.Positional[0] != "-not-a-flag" {
		t.Errorf("expected -not-a-flag as positional, got %s", r.Positional[0])
	}
}

func TestParseEmpty(t *testing.T) {
	r := Parse([]string{})
	if len(r.Flags) != 0 {
		t.Errorf("expected 0 flags, got %d", len(r.Flags))
	}
	if len(r.Positional) != 0 {
		t.Errorf("expected 0 positional, got %d", len(r.Positional))
	}
}
`,
  solution: `package main

import "strings"

// ParseResult holds the parsed flags and positional arguments.
type ParseResult struct {
	Flags      map[string]string
	Positional []string
}

// Parse parses command-line arguments into flags and positional args.
func Parse(args []string) ParseResult {
	result := ParseResult{
		Flags:      make(map[string]string),
		Positional: []string{},
	}
	i := 0
	for i < len(args) {
		arg := args[i]

		// Stop flag parsing on bare "--"
		if arg == "--" {
			result.Positional = append(result.Positional, args[i+1:]...)
			break
		}

		if !strings.HasPrefix(arg, "-") {
			result.Positional = append(result.Positional, arg)
			i++
			continue
		}

		trimmed := strings.TrimLeft(arg, "-")

		// Equals syntax
		if eqIdx := strings.Index(trimmed, "="); eqIdx >= 0 {
			key := trimmed[:eqIdx]
			value := trimmed[eqIdx+1:]
			result.Flags[key] = value
			i++
			continue
		}

		// Space-separated or boolean
		key := trimmed
		if i+1 < len(args) && !strings.HasPrefix(args[i+1], "-") {
			result.Flags[key] = args[i+1]
			i += 2
		} else {
			result.Flags[key] = "true"
			i++
		}
	}
	return result
}

func main() {}
`,
  hints: [
    'Create a ParseResult struct with Flags (map) and Positional (slice) fields',
    'Non-flag arguments (not starting with "-") go into the Positional slice',
    'After encountering "--", append all remaining args to Positional',
  ],
}

export default exercise

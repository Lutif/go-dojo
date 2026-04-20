import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-02',
  title: 'CLI Parser — Parse -key value Space Syntax',
  category: 'Projects',
  subcategory: 'CLI Parser',
  difficulty: 'intermediate',
  order: 11,
  projectId: 'proj-cli',
  step: 2,
  totalSteps: 6,
  description: `Extend the parser to handle space-separated flags like -name Alice in addition to -name=Alice.

**Requirements:**
- Support -key=value (from step 1)
- Support -key value (space-separated, value is the next argument)
- Support --key=value and --key value
- Boolean flags like -verbose with no value get the value "true"
- A bare "--" stops flag parsing (everything after is not a flag)`,
  code: `package main

// ParseFlags parses command-line arguments supporting both
// -key=value and -key value syntax.
// Boolean flags without values get "true".
// A bare "--" stops flag parsing.
func ParseFlags(args []string) map[string]string {
	// TODO: Implement extended flag parsing
	// 1. Iterate over args with an index
	// 2. If arg is "--", stop parsing
	// 3. If arg contains "=", split on first "="
	// 4. If arg starts with "-" but has no "=", peek at next arg
	//    - If next arg exists and doesn't start with "-", use it as value
	//    - Otherwise, treat as boolean flag with value "true"
	return nil
}

func main() {}
`,
  testCode: `package main

import (
	"testing"
)

func TestEqualsStyle(t *testing.T) {
	flags := ParseFlags([]string{"-name=Alice", "--port=8080"})
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", flags["name"])
	}
	if flags["port"] != "8080" {
		t.Errorf("expected port=8080, got %s", flags["port"])
	}
}

func TestSpaceStyle(t *testing.T) {
	flags := ParseFlags([]string{"-name", "Alice", "-port", "8080"})
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", flags["name"])
	}
	if flags["port"] != "8080" {
		t.Errorf("expected port=8080, got %s", flags["port"])
	}
}

func TestMixedStyle(t *testing.T) {
	flags := ParseFlags([]string{"-name=Alice", "-port", "8080", "--debug=true"})
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", flags["name"])
	}
	if flags["port"] != "8080" {
		t.Errorf("expected port=8080, got %s", flags["port"])
	}
	if flags["debug"] != "true" {
		t.Errorf("expected debug=true, got %s", flags["debug"])
	}
}

func TestBooleanFlag(t *testing.T) {
	flags := ParseFlags([]string{"-verbose", "-name", "Alice"})
	if flags["verbose"] != "true" {
		t.Errorf("expected verbose=true, got %s", flags["verbose"])
	}
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", flags["name"])
	}
}

func TestDoubleDashStop(t *testing.T) {
	flags := ParseFlags([]string{"-name=Alice", "--", "-port=8080"})
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got %s", flags["name"])
	}
	if _, ok := flags["port"]; ok {
		t.Errorf("port should not be parsed after --")
	}
}

func TestBooleanFlagAtEnd(t *testing.T) {
	flags := ParseFlags([]string{"-name", "Alice", "-verbose"})
	if flags["verbose"] != "true" {
		t.Errorf("expected verbose=true, got %s", flags["verbose"])
	}
}
`,
  solution: `package main

import "strings"

// ParseFlags parses command-line arguments supporting both
// -key=value and -key value syntax.
// Boolean flags without values get "true".
// A bare "--" stops flag parsing.
func ParseFlags(args []string) map[string]string {
	flags := make(map[string]string)
	i := 0
	for i < len(args) {
		arg := args[i]

		// Stop on bare "--"
		if arg == "--" {
			break
		}

		if !strings.HasPrefix(arg, "-") {
			i++
			continue
		}

		trimmed := strings.TrimLeft(arg, "-")

		// Check for = syntax
		if eqIdx := strings.Index(trimmed, "="); eqIdx >= 0 {
			key := trimmed[:eqIdx]
			value := trimmed[eqIdx+1:]
			flags[key] = value
			i++
			continue
		}

		// Space-separated: peek at next arg
		key := trimmed
		if i+1 < len(args) && !strings.HasPrefix(args[i+1], "-") {
			flags[key] = args[i+1]
			i += 2
		} else {
			// Boolean flag
			flags[key] = "true"
			i++
		}
	}
	return flags
}

func main() {}
`,
  hints: [
    'Use an index-based loop so you can skip ahead when consuming the next arg as a value',
    'Check if the next argument starts with "-" to decide if the current flag is boolean',
    'Handle the "--" sentinel by breaking out of the loop',
  ],
}

export default exercise

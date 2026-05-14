import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-01',
  title: 'CLI Parser — Parse -key=value Syntax',
  category: 'Projects',
  subcategory: 'CLI Parser',
  difficulty: 'intermediate',
  order: 10,
  projectId: 'proj-cli',
  projectTitle: 'CLI Parser',
  step: 1,
  totalSteps: 6,
  description: `Build a CLI argument parser from scratch! In this first step, implement a function that parses
flags in the -key=value format.

**Requirements:**
- Implement ParseFlags(args []string) map[string]string
- Parse arguments like "-name=Alice", "-port=8080"
- Strip the leading dash from keys
- Return a map of key-value pairs
- Ignore arguments that don't match -key=value format
- Handle flags with double dashes too: --name=Alice`,
  workspaceId: 'proj-cli',
  workspaceScaffold: {
    goMod: 'module cli-parser\n\ngo 1.21\n',
    files: [
      {
        name: 'main.go',
        content: `package main

// ParseFlags parses command-line arguments in -key=value format.
// It returns a map of flag names to their values.
// Both -key=value and --key=value are supported.
func ParseFlags(args []string) map[string]string {
	// TODO: Implement flag parsing
	// 1. Iterate over args
	// 2. Check if arg starts with "-" or "--"
	// 3. Split on "=" to get key and value
	// 4. Strip leading dashes from key
	// 5. Store in map
	return nil
}

func main() {}
`
      }
    ],
    testFiles: [
      {
        name: 'main_test.go',
        content: `package main

import (
	"testing"
)

func TestParseFlagsSingle(t *testing.T) {
	args := []string{"-name=Alice"}
	flags := ParseFlags(args)
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got name=%s", flags["name"])
	}
}

func TestParseFlagsMultiple(t *testing.T) {
	args := []string{"-host=localhost", "-port=8080", "-debug=true"}
	flags := ParseFlags(args)
	if flags["host"] != "localhost" {
		t.Errorf("expected host=localhost, got host=%s", flags["host"])
	}
	if flags["port"] != "8080" {
		t.Errorf("expected port=8080, got port=%s", flags["port"])
	}
	if flags["debug"] != "true" {
		t.Errorf("expected debug=true, got debug=%s", flags["debug"])
	}
}

func TestParseFlagsDoubleDash(t *testing.T) {
	args := []string{"--output=result.txt", "--verbose=true"}
	flags := ParseFlags(args)
	if flags["output"] != "result.txt" {
		t.Errorf("expected output=result.txt, got output=%s", flags["output"])
	}
	if flags["verbose"] != "true" {
		t.Errorf("expected verbose=true, got verbose=%s", flags["verbose"])
	}
}

func TestParseFlagsIgnoresNonFlags(t *testing.T) {
	args := []string{"hello", "-name=Alice", "world"}
	flags := ParseFlags(args)
	if len(flags) != 1 {
		t.Errorf("expected 1 flag, got %d", len(flags))
	}
	if flags["name"] != "Alice" {
		t.Errorf("expected name=Alice, got name=%s", flags["name"])
	}
}

func TestParseFlagsEmpty(t *testing.T) {
	flags := ParseFlags([]string{})
	if len(flags) != 0 {
		t.Errorf("expected 0 flags, got %d", len(flags))
	}
}

func TestParseFlagsValueWithEquals(t *testing.T) {
	args := []string{"-expr=a=b"}
	flags := ParseFlags(args)
	if flags["expr"] != "a=b" {
		t.Errorf("expected expr=a=b, got expr=%s", flags["expr"])
	}
}
`
      }
    ]
  },
  hints: [
    'Use strings.HasPrefix to check for "-" or "--"',
    'Use strings.TrimLeft(arg, "-") to strip leading dashes',
    'Use strings.Index to find the first "=" and split manually so values containing "=" are preserved',
  ],
}

export default exercise

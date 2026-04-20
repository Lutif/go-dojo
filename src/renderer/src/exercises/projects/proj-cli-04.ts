import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-04',
  title: 'CLI Parser — Subcommands',
  category: 'Projects',
  subcategory: 'CLI Parser',
  difficulty: 'advanced',
  order: 13,
  projectId: 'proj-cli',
  step: 4,
  totalSteps: 6,
  description: `Add subcommand support. The first positional argument is treated as a subcommand name, and remaining args are parsed for that subcommand.

**Requirements:**
- ParseWithSubcommand(args []string) SubcommandResult
- The first positional argument becomes the subcommand name
- Remaining args after the subcommand are parsed as flags/positional for that subcommand
- If no subcommand is found, Subcommand is empty
- Flags before the subcommand are "global" flags`,
  code: `package main

// SubcommandResult holds the parsed subcommand, global flags, and sub-args.
type SubcommandResult struct {
	GlobalFlags map[string]string
	Subcommand  string
	SubFlags    map[string]string
	SubPositional []string
}

// ParseWithSubcommand parses "app [global-flags] subcmd [sub-flags] [sub-args]".
func ParseWithSubcommand(args []string) SubcommandResult {
	// TODO: Implement subcommand parsing
	// 1. Parse global flags until first non-flag arg
	// 2. First non-flag arg is the subcommand name
	// 3. Parse remaining args as sub-flags and sub-positional
	return SubcommandResult{}
}

func main() {}
`,
  testCode: `package main

import (
	"testing"
)

func TestSubcommandBasic(t *testing.T) {
	r := ParseWithSubcommand([]string{"build", "-output", "main"})
	if r.Subcommand != "build" {
		t.Errorf("expected subcommand=build, got %s", r.Subcommand)
	}
	if r.SubFlags["output"] != "main" {
		t.Errorf("expected output=main, got %s", r.SubFlags["output"])
	}
}

func TestSubcommandWithGlobalFlags(t *testing.T) {
	r := ParseWithSubcommand([]string{"-verbose", "deploy", "-target=prod"})
	if r.GlobalFlags["verbose"] != "true" {
		t.Errorf("expected global verbose=true, got %s", r.GlobalFlags["verbose"])
	}
	if r.Subcommand != "deploy" {
		t.Errorf("expected subcommand=deploy, got %s", r.Subcommand)
	}
	if r.SubFlags["target"] != "prod" {
		t.Errorf("expected target=prod, got %s", r.SubFlags["target"])
	}
}

func TestSubcommandWithPositional(t *testing.T) {
	r := ParseWithSubcommand([]string{"test", "file1.go", "file2.go"})
	if r.Subcommand != "test" {
		t.Errorf("expected subcommand=test, got %s", r.Subcommand)
	}
	if len(r.SubPositional) != 2 {
		t.Fatalf("expected 2 sub-positional args, got %d", len(r.SubPositional))
	}
	if r.SubPositional[0] != "file1.go" || r.SubPositional[1] != "file2.go" {
		t.Errorf("expected [file1.go file2.go], got %v", r.SubPositional)
	}
}

func TestNoSubcommand(t *testing.T) {
	r := ParseWithSubcommand([]string{"-verbose", "-debug=true"})
	if r.Subcommand != "" {
		t.Errorf("expected empty subcommand, got %s", r.Subcommand)
	}
	if r.GlobalFlags["verbose"] != "true" {
		t.Errorf("expected verbose=true, got %s", r.GlobalFlags["verbose"])
	}
	if r.GlobalFlags["debug"] != "true" {
		t.Errorf("expected debug=true, got %s", r.GlobalFlags["debug"])
	}
}

func TestSubcommandEmpty(t *testing.T) {
	r := ParseWithSubcommand([]string{})
	if r.Subcommand != "" {
		t.Errorf("expected empty subcommand, got %s", r.Subcommand)
	}
}

func TestSubcommandMixed(t *testing.T) {
	r := ParseWithSubcommand([]string{"-config=app.yaml", "run", "-port", "3000", "server"})
	if r.GlobalFlags["config"] != "app.yaml" {
		t.Errorf("expected config=app.yaml, got %s", r.GlobalFlags["config"])
	}
	if r.Subcommand != "run" {
		t.Errorf("expected subcommand=run, got %s", r.Subcommand)
	}
	if r.SubFlags["port"] != "3000" {
		t.Errorf("expected port=3000, got %s", r.SubFlags["port"])
	}
	if len(r.SubPositional) != 1 || r.SubPositional[0] != "server" {
		t.Errorf("expected [server], got %v", r.SubPositional)
	}
}
`,
  solution: `package main

import "strings"

// SubcommandResult holds the parsed subcommand, global flags, and sub-args.
type SubcommandResult struct {
	GlobalFlags   map[string]string
	Subcommand    string
	SubFlags      map[string]string
	SubPositional []string
}

// parseFlags is a helper that parses flags and positional args from a slice.
func parseFlags(args []string) (map[string]string, []string) {
	flags := make(map[string]string)
	positional := []string{}
	i := 0
	for i < len(args) {
		arg := args[i]
		if arg == "--" {
			positional = append(positional, args[i+1:]...)
			break
		}
		if !strings.HasPrefix(arg, "-") {
			positional = append(positional, arg)
			i++
			continue
		}
		trimmed := strings.TrimLeft(arg, "-")
		if eqIdx := strings.Index(trimmed, "="); eqIdx >= 0 {
			flags[trimmed[:eqIdx]] = trimmed[eqIdx+1:]
			i++
			continue
		}
		key := trimmed
		if i+1 < len(args) && !strings.HasPrefix(args[i+1], "-") {
			flags[key] = args[i+1]
			i += 2
		} else {
			flags[key] = "true"
			i++
		}
	}
	return flags, positional
}

// ParseWithSubcommand parses "app [global-flags] subcmd [sub-flags] [sub-args]".
func ParseWithSubcommand(args []string) SubcommandResult {
	result := SubcommandResult{
		GlobalFlags:   make(map[string]string),
		SubFlags:      make(map[string]string),
		SubPositional: []string{},
	}

	// Phase 1: collect global flags until first non-flag arg
	i := 0
	for i < len(args) {
		arg := args[i]
		if !strings.HasPrefix(arg, "-") {
			break
		}
		trimmed := strings.TrimLeft(arg, "-")
		if eqIdx := strings.Index(trimmed, "="); eqIdx >= 0 {
			result.GlobalFlags[trimmed[:eqIdx]] = trimmed[eqIdx+1:]
			i++
		} else {
			result.GlobalFlags[trimmed] = "true"
			i++
		}
	}

	// Phase 2: first non-flag arg is the subcommand
	if i < len(args) {
		result.Subcommand = args[i]
		i++
	}

	// Phase 3: parse remaining as sub-flags and sub-positional
	if i < len(args) {
		result.SubFlags, result.SubPositional = parseFlags(args[i:])
	}

	return result
}

func main() {}
`,
  hints: [
    'Split parsing into two phases: global flags first, then subcommand + its args',
    'The first non-flag argument is the subcommand name',
    'Reuse your flag-parsing logic for the subcommand arguments',
  ],
}

export default exercise

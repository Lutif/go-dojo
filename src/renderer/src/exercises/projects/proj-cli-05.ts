import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-cli-05',
  title: 'CLI Parser — Help Text Generation',
  category: 'Projects',
  subcategory: 'CLI Parser',
  difficulty: 'advanced',
  order: 14,
  projectId: 'proj-cli',
  step: 5,
  totalSteps: 6,
  description: `Add help text generation from flag definitions. Users should get useful help when they pass -h or --help.

**Requirements:**
- FlagDef struct with Name, Description, and Default fields
- GenerateHelp(appName string, description string, flags []FlagDef) string
- Help text should include: app description, usage line, and flag table
- Each flag shows: --name  description (default: value)
- Flags with no default omit the "(default: ...)" part`,
  code: `package main

// FlagDef describes a registered flag for help generation.
type FlagDef struct {
	Name        string
	Description string
	Default     string
}

// GenerateHelp produces a help string from app metadata and flag definitions.
func GenerateHelp(appName string, description string, flags []FlagDef) string {
	// TODO: Build help text
	// Line 1: description
	// Line 2: blank
	// Line 3: "Usage: appName [flags]"
	// Line 4: blank
	// Line 5: "Flags:"
	// Then one line per flag: "  --name    description (default: value)"
	return ""
}

func main() {}
`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestGenerateHelpBasic(t *testing.T) {
	flags := []FlagDef{
		{Name: "port", Description: "Port to listen on", Default: "8080"},
		{Name: "host", Description: "Host to bind to", Default: "localhost"},
	}
	help := GenerateHelp("myapp", "A sample application", flags)

	if !strings.Contains(help, "A sample application") {
		t.Error("help should contain app description")
	}
	if !strings.Contains(help, "Usage: myapp [flags]") {
		t.Error("help should contain usage line")
	}
	if !strings.Contains(help, "Flags:") {
		t.Error("help should contain Flags: header")
	}
	if !strings.Contains(help, "--port") {
		t.Error("help should contain --port flag")
	}
	if !strings.Contains(help, "Port to listen on") {
		t.Error("help should contain port description")
	}
	if !strings.Contains(help, "(default: 8080)") {
		t.Error("help should contain port default")
	}
}

func TestGenerateHelpNoDefault(t *testing.T) {
	flags := []FlagDef{
		{Name: "config", Description: "Config file path", Default: ""},
	}
	help := GenerateHelp("app", "Test app", flags)

	if strings.Contains(help, "(default:") {
		t.Error("flags with empty default should not show (default: ...)")
	}
	if !strings.Contains(help, "--config") {
		t.Error("help should contain --config flag")
	}
}

func TestGenerateHelpNoFlags(t *testing.T) {
	help := GenerateHelp("tool", "A simple tool", []FlagDef{})

	if !strings.Contains(help, "A simple tool") {
		t.Error("help should contain description")
	}
	if !strings.Contains(help, "Usage: tool [flags]") {
		t.Error("help should contain usage line")
	}
}

func TestGenerateHelpMultipleFlags(t *testing.T) {
	flags := []FlagDef{
		{Name: "verbose", Description: "Enable verbose output", Default: "false"},
		{Name: "output", Description: "Output file", Default: ""},
		{Name: "timeout", Description: "Request timeout", Default: "30s"},
	}
	help := GenerateHelp("cli", "CLI tool", flags)

	if !strings.Contains(help, "--verbose") {
		t.Error("missing --verbose")
	}
	if !strings.Contains(help, "--output") {
		t.Error("missing --output")
	}
	if !strings.Contains(help, "--timeout") {
		t.Error("missing --timeout")
	}
	if !strings.Contains(help, "(default: 30s)") {
		t.Error("missing timeout default")
	}
}
`,
  solution: `package main

import "fmt"

// FlagDef describes a registered flag for help generation.
type FlagDef struct {
	Name        string
	Description string
	Default     string
}

// GenerateHelp produces a help string from app metadata and flag definitions.
func GenerateHelp(appName string, description string, flags []FlagDef) string {
	result := description + "\\n\\n"
	result += fmt.Sprintf("Usage: %s [flags]\\n", appName)

	if len(flags) > 0 {
		result += "\\nFlags:\\n"
		for _, f := range flags {
			line := fmt.Sprintf("  --%s\\t%s", f.Name, f.Description)
			if f.Default != "" {
				line += fmt.Sprintf(" (default: %s)", f.Default)
			}
			result += line + "\\n"
		}
	}
	return result
}

func main() {}
`,
  hints: [
    'Build the help string line by line using fmt.Sprintf',
    'Only append "(default: ...)" when Default is not empty',
    'Use \\t between the flag name and description for alignment',
  ],
}

export default exercise

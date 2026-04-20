import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_17_linker_flags',
  title: 'Linker Flags',
  category: 'Internals',
  subcategory: 'Build System',
  difficulty: 'advanced',
  order: 17,
  description: `\`-ldflags\` embeds values at compile time:

\`\`\`
go build -ldflags "-X main.version=1.2.3 -X main.commit=abc123"
\`\`\`

This sets package-level string variables. The pattern:
\`\`\`
// These get set by -ldflags at build time
var version = "dev"
var commit  = "unknown"
var date    = "unknown"

func BuildInfo() string {
    return fmt.Sprintf("%s (commit %s, built %s)", version, commit, date)
}
\`\`\`

Since we can't use ldflags in the sandbox, your task: implement the version info pattern with default values and an override mechanism.`,
  code: `package main

import "fmt"

// Build info variables — in real code, these would be set via -ldflags
var version = "dev"
var commit = "unknown"
var buildDate = "unknown"

// BuildInfo returns a formatted build info string.
// Format: "version (commit commit, built buildDate)"
func BuildInfo() string {
	// TODO
	return ""
}

// SetBuildInfo overrides the build info variables (simulates ldflags).
func SetBuildInfo(v, c, d string) {
	// TODO
}

// ParseVersion parses a semver string "major.minor.patch" into its components.
// Returns (0,0,0) and error for invalid input.
func ParseVersion(s string) (major, minor, patch int, err error) {
	// TODO: Use fmt.Sscanf
	return 0, 0, 0, nil
}

// CompareVersions returns -1, 0, or 1 comparing two semver strings.
func CompareVersions(a, b string) int {
	// TODO: Parse both, compare major, then minor, then patch
	return 0
}

var _ = fmt.Sprintf`,
  testCode: `package main

import "testing"

func TestBuildInfoDefault(t *testing.T) {
	version = "dev"
	commit = "unknown"
	buildDate = "unknown"
	got := BuildInfo()
	if got != "dev (commit unknown, built unknown)" {
		t.Errorf("got %q", got)
	}
}

func TestSetBuildInfo(t *testing.T) {
	SetBuildInfo("1.2.3", "abc123", "2024-01-15")
	got := BuildInfo()
	if got != "1.2.3 (commit abc123, built 2024-01-15)" {
		t.Errorf("got %q", got)
	}
	// Reset
	version = "dev"
	commit = "unknown"
	buildDate = "unknown"
}

func TestParseVersion(t *testing.T) {
	maj, min, pat, err := ParseVersion("1.2.3")
	if err != nil {
		t.Fatal(err)
	}
	if maj != 1 || min != 2 || pat != 3 {
		t.Errorf("got %d.%d.%d", maj, min, pat)
	}
}

func TestParseVersionInvalid(t *testing.T) {
	_, _, _, err := ParseVersion("not-a-version")
	if err == nil {
		t.Error("expected error")
	}
}

func TestCompareVersions(t *testing.T) {
	tests := []struct {
		a, b string
		want int
	}{
		{"1.0.0", "1.0.0", 0},
		{"1.0.0", "2.0.0", -1},
		{"2.0.0", "1.0.0", 1},
		{"1.2.0", "1.1.0", 1},
		{"1.0.1", "1.0.0", 1},
	}
	for _, tt := range tests {
		got := CompareVersions(tt.a, tt.b)
		if got != tt.want {
			t.Errorf("Compare(%s, %s) = %d, want %d", tt.a, tt.b, got, tt.want)
		}
	}
}`,
  solution: `package main

import (
	"fmt"
)

var version = "dev"
var commit = "unknown"
var buildDate = "unknown"

func BuildInfo() string {
	return fmt.Sprintf("%s (commit %s, built %s)", version, commit, buildDate)
}

func SetBuildInfo(v, c, d string) {
	version = v
	commit = c
	buildDate = d
}

func ParseVersion(s string) (major, minor, patch int, err error) {
	n, err := fmt.Sscanf(s, "%d.%d.%d", &major, &minor, &patch)
	if err != nil || n != 3 {
		return 0, 0, 0, fmt.Errorf("invalid version: %s", s)
	}
	return major, minor, patch, nil
}

func CompareVersions(a, b string) int {
	amaj, amin, apat, _ := ParseVersion(a)
	bmaj, bmin, bpat, _ := ParseVersion(b)
	switch {
	case amaj != bmaj:
		return cmp(amaj, bmaj)
	case amin != bmin:
		return cmp(amin, bmin)
	default:
		return cmp(apat, bpat)
	}
}

func cmp(a, b int) int {
	if a < b {
		return -1
	}
	if a > b {
		return 1
	}
	return 0
}

var _ = fmt.Sprintf`,
  hints: [
    'BuildInfo: fmt.Sprintf("%s (commit %s, built %s)", version, commit, buildDate).',
    'ParseVersion: fmt.Sscanf(s, "%d.%d.%d", &major, &minor, &patch) parses semver.',
    'CompareVersions: parse both, compare major first, then minor, then patch.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_15_build_tags',
  title: 'Build Tags',
  category: 'Internals',
  subcategory: 'Build System',
  difficulty: 'advanced',
  order: 15,
  description: `Build tags conditionally include files during compilation:

\`\`\`
//go:build linux
// +build linux

package mypackage  // only compiled on Linux
\`\`\`

Common tags: \`linux\`, \`darwin\`, \`windows\`, \`amd64\`, \`arm64\`, \`!cgo\`, \`ignore\`.

Go 1.17+ uses \`//go:build\` syntax with boolean expressions:
\`\`\`
//go:build (linux || darwin) && amd64
\`\`\`

Since we can't use actual build tags in this sandbox, your task: simulate platform-specific code selection using a runtime approach.`,
  code: `package main

import "runtime"

// PlatformName returns a human-readable OS name.
func PlatformName() string {
	// TODO: Use runtime.GOOS to return "Linux", "macOS", "Windows", or the raw value
	return ""
}

// PlatformPathSep returns the path separator for the current OS.
func PlatformPathSep() string {
	// TODO: "/" for unix-like, "\\" for windows
	return ""
}

// PlatformConfigDir returns a typical config directory for the OS.
func PlatformConfigDir() string {
	// TODO: Linux: ~/.config, macOS: ~/Library/Application Support, Windows: %APPDATA%
	return ""
}

// SelectByPlatform returns the value matching the current GOOS from the map.
// Falls back to "default" key if the OS isn't in the map.
func SelectByPlatform(options map[string]string) string {
	// TODO
	return ""
}

var _ = runtime.GOOS`,
  testCode: `package main

import (
	"runtime"
	"testing"
)

func TestPlatformName(t *testing.T) {
	name := PlatformName()
	if name == "" {
		t.Error("should return a platform name")
	}
	switch runtime.GOOS {
	case "linux":
		if name != "Linux" {
			t.Errorf("got %q", name)
		}
	case "darwin":
		if name != "macOS" {
			t.Errorf("got %q", name)
		}
	case "windows":
		if name != "Windows" {
			t.Errorf("got %q", name)
		}
	}
}

func TestPlatformPathSep(t *testing.T) {
	sep := PlatformPathSep()
	if runtime.GOOS == "windows" {
		if sep != "\\\\" {
			t.Errorf("got %q", sep)
		}
	} else {
		if sep != "/" {
			t.Errorf("got %q", sep)
		}
	}
}

func TestPlatformConfigDir(t *testing.T) {
	dir := PlatformConfigDir()
	if dir == "" {
		t.Error("should return a config dir")
	}
}

func TestSelectByPlatform(t *testing.T) {
	options := map[string]string{
		runtime.GOOS: "correct",
		"default":    "fallback",
	}
	got := SelectByPlatform(options)
	if got != "correct" {
		t.Errorf("got %q", got)
	}
}

func TestSelectByPlatformFallback(t *testing.T) {
	options := map[string]string{
		"nonexistent_os": "wrong",
		"default":        "fallback",
	}
	got := SelectByPlatform(options)
	if got != "fallback" {
		t.Errorf("got %q", got)
	}
}`,
  solution: `package main

import "runtime"

func PlatformName() string {
	switch runtime.GOOS {
	case "linux":
		return "Linux"
	case "darwin":
		return "macOS"
	case "windows":
		return "Windows"
	default:
		return runtime.GOOS
	}
}

func PlatformPathSep() string {
	if runtime.GOOS == "windows" {
		return "\\\\"
	}
	return "/"
}

func PlatformConfigDir() string {
	switch runtime.GOOS {
	case "linux":
		return "~/.config"
	case "darwin":
		return "~/Library/Application Support"
	case "windows":
		return "%APPDATA%"
	default:
		return "~/.config"
	}
}

func SelectByPlatform(options map[string]string) string {
	if v, ok := options[runtime.GOOS]; ok {
		return v
	}
	return options["default"]
}

var _ = runtime.GOOS`,
  hints: [
    'PlatformName: switch on runtime.GOOS — "linux", "darwin", "windows".',
    'PlatformPathSep: windows uses "\\\\", everything else uses "/".',
    'SelectByPlatform: check options[runtime.GOOS] first, fall back to options["default"].'
  ],
}

export default exercise

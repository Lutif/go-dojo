import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_10_filepath',
  title: 'filepath Package',
  category: 'Standard Library',
  subcategory: 'File I/O',
  difficulty: 'beginner',
  order: 10,
  description: `The \`path/filepath\` package manipulates file paths portably:

\`\`\`
filepath.Join("usr", "local", "bin")  // "usr/local/bin"
filepath.Base("/home/user/doc.txt")   // "doc.txt"
filepath.Dir("/home/user/doc.txt")    // "/home/user"
filepath.Ext("photo.jpg")            // ".jpg"
filepath.Split("/a/b/c.txt")         // "/a/b/", "c.txt"
filepath.Clean("/a//b/../c")         // "/a/c"
filepath.Match("*.go", "main.go")    // true, nil
\`\`\`

Always use \`filepath\` instead of string manipulation — it handles OS-specific separators.

Your task: manipulate file paths with filepath functions.`,
  code: `package main

import "path/filepath"

// FileInfo extracts filename, directory, and extension from a path.
type FileInfo struct {
	Name string // base filename without extension
	Dir  string // directory part
	Ext  string // extension including dot
}

// ParsePath extracts FileInfo from a path.
// "/home/user/doc.txt" → {Name: "doc", Dir: "/home/user", Ext: ".txt"}
func ParsePath(path string) FileInfo {
	// TODO: Use filepath.Base, Dir, Ext
	return FileInfo{}
}

// ChangeExt changes the file extension.
// ChangeExt("/a/b/file.txt", ".md") → "/a/b/file.md"
func ChangeExt(path, newExt string) string {
	// TODO
	return ""
}

// CommonDir finds the common parent directory of two paths.
// CommonDir("/a/b/c", "/a/b/d") → "/a/b"
func CommonDir(path1, path2 string) string {
	// TODO: Split into parts, find common prefix
	return ""
}

// MatchAny checks if filename matches any of the given patterns.
func MatchAny(filename string, patterns []string) bool {
	// TODO: Use filepath.Match
	return false
}

var _ = filepath.Join`,
  testCode: `package main

import "testing"

func TestParsePath(t *testing.T) {
	tests := []struct {
		path string
		want FileInfo
	}{
		{"/home/user/doc.txt", FileInfo{"doc", "/home/user", ".txt"}},
		{"main.go", FileInfo{"main", ".", ".go"}},
		{"/etc/config", FileInfo{"config", "/etc", ""}},
	}
	for _, tt := range tests {
		got := ParsePath(tt.path)
		if got != tt.want {
			t.Errorf("ParsePath(%q) = %+v, want %+v", tt.path, got, tt.want)
		}
	}
}

func TestChangeExt(t *testing.T) {
	tests := []struct{ path, ext, want string }{
		{"/a/b/file.txt", ".md", "/a/b/file.md"},
		{"doc.txt", ".pdf", "doc.pdf"},
		{"/a/b/noext", ".go", "/a/b/noext.go"},
	}
	for _, tt := range tests {
		got := ChangeExt(tt.path, tt.ext)
		if got != tt.want {
			t.Errorf("ChangeExt(%q, %q) = %q, want %q", tt.path, tt.ext, got, tt.want)
		}
	}
}

func TestCommonDir(t *testing.T) {
	tests := []struct{ p1, p2, want string }{
		{"/a/b/c", "/a/b/d", "/a/b"},
		{"/a/b", "/a/c", "/a"},
		{"/x/y", "/z/w", "/"},
	}
	for _, tt := range tests {
		got := CommonDir(tt.p1, tt.p2)
		if got != tt.want {
			t.Errorf("CommonDir(%q, %q) = %q, want %q", tt.p1, tt.p2, got, tt.want)
		}
	}
}

func TestMatchAny(t *testing.T) {
	if !MatchAny("main.go", []string{"*.txt", "*.go"}) {
		t.Error("should match *.go")
	}
	if MatchAny("main.go", []string{"*.txt", "*.rs"}) {
		t.Error("should not match")
	}
}`,
  solution: `package main

import (
	"path/filepath"
	"strings"
)

type FileInfo struct {
	Name string
	Dir  string
	Ext  string
}

func ParsePath(path string) FileInfo {
	ext := filepath.Ext(path)
	base := filepath.Base(path)
	name := strings.TrimSuffix(base, ext)
	dir := filepath.Dir(path)
	return FileInfo{Name: name, Dir: dir, Ext: ext}
}

func ChangeExt(path, newExt string) string {
	ext := filepath.Ext(path)
	if ext == "" {
		return path + newExt
	}
	return strings.TrimSuffix(path, ext) + newExt
}

func CommonDir(path1, path2 string) string {
	parts1 := strings.Split(filepath.Clean(path1), string(filepath.Separator))
	parts2 := strings.Split(filepath.Clean(path2), string(filepath.Separator))

	var common []string
	for i := 0; i < len(parts1) && i < len(parts2); i++ {
		if parts1[i] != parts2[i] {
			break
		}
		common = append(common, parts1[i])
	}
	result := strings.Join(common, string(filepath.Separator))
	if result == "" {
		return string(filepath.Separator)
	}
	return result
}

func MatchAny(filename string, patterns []string) bool {
	for _, p := range patterns {
		if matched, _ := filepath.Match(p, filename); matched {
			return true
		}
	}
	return false
}

var _ = filepath.Join`,
  hints: [
    'ParsePath: filepath.Base gets the filename, filepath.Ext gets the extension, strings.TrimSuffix removes ext from base to get the name.',
    'ChangeExt: get the current extension, trim it off, append the new one.',
    'CommonDir: split both paths by separator, compare parts, join the matching prefix.'
  ],
}

export default exercise

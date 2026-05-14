import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-git-01',
  title: 'Git Internals — Content Hashing',
  category: 'Projects',
  subcategory: 'Git Internals',
  difficulty: 'intermediate',
  order: 154,
  description: `Build the first piece of a minimal Git implementation: content-addressable hashing.

Git identifies every object by the SHA-1 hash of its content. Implement two functions:

- HashObject(content string) string: returns the hex-encoded SHA-1 hash of the raw content.
- HashBlob(content string) string: hashes the content the way Git does — it prepends a header
  "blob <size>\\0" (where size is the byte length and \\0 is a null byte) before hashing.

Use crypto/sha1 and fmt.Sprintf("%x", ...) for hex encoding.`,
  code: `package main

import (
	"crypto/sha1"
	"fmt"
)

// TODO: Implement HashObject(content string) string
// Return the hex-encoded SHA-1 of content.

// TODO: Implement HashBlob(content string) string
// Hash "blob <size>\\0<content>" like Git does.

func main() {
	fmt.Println(HashObject("hello"))
	fmt.Println(HashBlob("hello"))
}
`,
  testCode: `package main

import "testing"

func TestHashObjectEmpty(t *testing.T) {
	got := HashObject("")
	want := "da39a3ee5e6b4b0d3255bfef95601890afd80709"
	if got != want {
		t.Fatalf("HashObject(\\"\\") = %s, want %s", got, want)
	}
}

func TestHashObjectHello(t *testing.T) {
	got := HashObject("hello")
	want := "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"
	if got != want {
		t.Fatalf("HashObject(\\"hello\\") = %s, want %s", got, want)
	}
}

func TestHashBlobEmpty(t *testing.T) {
	got := HashBlob("")
	want := "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
	if got != want {
		t.Fatalf("HashBlob(\\"\\") = %s, want %s", got, want)
	}
}

func TestHashBlobHello(t *testing.T) {
	got := HashBlob("hello")
	want := "b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0"
	if got != want {
		t.Fatalf("HashBlob(\\"hello\\") = %s, want %s", got, want)
	}
}

func TestHashBlobDeterministic(t *testing.T) {
	a := HashBlob("test content")
	b := HashBlob("test content")
	if a != b {
		t.Fatal("HashBlob should be deterministic")
	}
}

func TestHashBlobDifferentContent(t *testing.T) {
	a := HashBlob("foo")
	b := HashBlob("bar")
	if a == b {
		t.Fatal("different content should produce different hashes")
	}
}
`,
  solution: `package main

import (
	"crypto/sha1"
	"fmt"
)

func HashObject(content string) string {
	h := sha1.Sum([]byte(content))
	return fmt.Sprintf("%x", h)
}

func HashBlob(content string) string {
	header := fmt.Sprintf("blob %d\\x00", len(content))
	h := sha1.Sum([]byte(header + content))
	return fmt.Sprintf("%x", h)
}

func main() {
	fmt.Println(HashObject("hello"))
	fmt.Println(HashBlob("hello"))
}
`,
  hints: [
    'sha1.Sum([]byte(s)) returns a [20]byte array — pass it to fmt.Sprintf("%x", ...) for hex.',
    'The Git blob header is: "blob " + length + null byte + content.',
    'Use fmt.Sprintf("blob %d\\x00", len(content)) to build the header with a null byte.',
    'len(content) gives the byte length of a string in Go.',
  ],
  projectId: 'proj-git',
  projectTitle: 'Git Internals',
  step: 1,
  totalSteps: 8,
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_23_crypto_hash',
  title: 'crypto Hashing',
  category: 'Standard Library',
  subcategory: 'Crypto',
  difficulty: 'intermediate',
  order: 23,
  description: `The \`crypto\` packages compute cryptographic hashes:

\`\`\`
import "crypto/sha256"

// One-shot hash
hash := sha256.Sum256([]byte("hello"))
fmt.Printf("%x\\n", hash)  // hex-encoded hash

// Streaming hash (for large data)
h := sha256.New()
h.Write([]byte("hello "))
h.Write([]byte("world"))
sum := h.Sum(nil)
fmt.Printf("%x\\n", sum)
\`\`\`

Common hash functions:
- \`crypto/md5\` — MD5 (legacy, not secure)
- \`crypto/sha256\` — SHA-256 (recommended)
- \`crypto/sha512\` — SHA-512

Use \`encoding/hex\` to convert hash bytes to hex strings.

Your task: compute and verify cryptographic hashes.`,
  code: `package main

import (
	"crypto/sha256"
	"encoding/hex"
	"io"
)

// SHA256Hex returns the SHA-256 hash of data as a hex string.
func SHA256Hex(data []byte) string {
	// TODO
	return ""
}

// SHA256Reader computes the SHA-256 hash of data from a reader.
func SHA256Reader(r io.Reader) (string, error) {
	// TODO: Use sha256.New() and io.Copy
	return "", nil
}

// VerifyChecksum checks if data matches the expected hex checksum.
func VerifyChecksum(data []byte, expectedHex string) bool {
	// TODO: Compute hash and compare
	return false
}

// HashPassword returns a salted SHA-256 hash: SHA256(salt + password).
// Returns the hash as a hex string.
func HashPassword(password, salt string) string {
	// TODO
	return ""
}

var _ = sha256.New
var _ = hex.EncodeToString
var _ = io.Copy`,
  testCode: `package main

import (
	"strings"
	"testing"
)

func TestSHA256Hex(t *testing.T) {
	got := SHA256Hex([]byte("hello"))
	want := "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestSHA256HexEmpty(t *testing.T) {
	got := SHA256Hex([]byte(""))
	want := "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
	if got != want {
		t.Errorf("got %q", got)
	}
}

func TestSHA256Reader(t *testing.T) {
	r := strings.NewReader("hello")
	got, err := SHA256Reader(r)
	if err != nil {
		t.Fatal(err)
	}
	want := "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
	if got != want {
		t.Errorf("got %q", got)
	}
}

func TestVerifyChecksumValid(t *testing.T) {
	data := []byte("hello")
	checksum := "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
	if !VerifyChecksum(data, checksum) {
		t.Error("expected valid checksum")
	}
}

func TestVerifyChecksumInvalid(t *testing.T) {
	data := []byte("hello")
	if VerifyChecksum(data, "0000000000000000000000000000000000000000000000000000000000000000") {
		t.Error("expected invalid checksum")
	}
}

func TestHashPassword(t *testing.T) {
	hash1 := HashPassword("secret", "salt1")
	hash2 := HashPassword("secret", "salt2")
	if hash1 == hash2 {
		t.Error("different salts should produce different hashes")
	}
	if len(hash1) != 64 {
		t.Errorf("hash length = %d, want 64 hex chars", len(hash1))
	}
}

func TestHashPasswordDeterministic(t *testing.T) {
	h1 := HashPassword("pass", "salt")
	h2 := HashPassword("pass", "salt")
	if h1 != h2 {
		t.Error("same input should produce same hash")
	}
}`,
  solution: `package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
)

func SHA256Hex(data []byte) string {
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:])
}

func SHA256Reader(r io.Reader) (string, error) {
	h := sha256.New()
	if _, err := io.Copy(h, r); err != nil {
		return "", err
	}
	return hex.EncodeToString(h.Sum(nil)), nil
}

func VerifyChecksum(data []byte, expectedHex string) bool {
	actual := SHA256Hex(data)
	return actual == expectedHex
}

func HashPassword(password, salt string) string {
	combined := []byte(salt + password)
	hash := sha256.Sum256(combined)
	return hex.EncodeToString(hash[:])
}

var _ = sha256.New
var _ = hex.EncodeToString
var _ = io.Copy
var _ = fmt.Sprintf`,
  hints: [
    'SHA256Hex: sha256.Sum256(data) returns a [32]byte. Use hex.EncodeToString(hash[:]) to convert.',
    'SHA256Reader: create h := sha256.New(), use io.Copy(h, r), then h.Sum(nil) for the hash.',
    'VerifyChecksum: compute the hash of data and compare the hex string to expectedHex.'
  ],
}

export default exercise

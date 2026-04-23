import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_01_hello',
  title: 'Hello World',
  category: 'Basics',
  subcategory: 'Getting Started',
  difficulty: 'beginner',
  order: 1,
  description: `This is your first program in Go. Each source file lives in a **package**; programs you run with \`go run\` use \`package main\` so the toolchain knows to build a command, not a library. The one function called \`main\` in that package is the **entry point** where execution begins — the same idea as \`int main()\` in C. To show text in the terminal, import the standard library package \`fmt\` and call \`fmt.Println\`, which prints a line and adds a newline at the end.

**Your task:** call \`fmt.Println\` so the program outputs exactly \`Hello, World!\` (keep the comma and the exclamation mark; the test checks the exact string).`,
  code: `package main

import "fmt"

// TODO: Call fmt.Println to output "Hello, World!"
func main() {

}`,
  testCode: `package main

import (
	"bytes"
	"io"
	"os"
	"testing"
)

func TestMain(t *testing.T) {
	// Capture stdout
	r, w, _ := os.Pipe()
	stdout := os.Stdout
	os.Stdout = w
	
	main()
	
	w.Close()
	os.Stdout = stdout
	
	var buf bytes.Buffer
	io.Copy(&buf, r)
	output := buf.String()
	
	expected := "Hello, World!\\n"
	if output != expected {
		t.Errorf("got %q, want %q", output, expected)
	}
}`,
  solution: `package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}`,
  hints: [
    'Use fmt.Println("Hello, World!") — Println adds a newline automatically.',
    'The "fmt" package is already imported for you. In Go, unused imports cause a compile error.',
    'Make sure the string matches exactly: capital H, comma after Hello, exclamation mark at the end.'
  ],
}

export default exercise

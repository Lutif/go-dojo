import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_01_hello',
  title: 'Hello World',
  category: 'Basics',
  subcategory: 'Getting Started',
  difficulty: 'beginner',
  order: 1,
  description: `Write your first Go program! Every Go executable starts with \`package main\` and a \`main()\` function — this is the entry point, like \`int main()\` in C. Use \`fmt.Println()\` to print text to the console.

Your task: print exactly \`Hello, World!\` (with the comma and exclamation mark).`,
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
	
	expected := "Hello, World!\n"
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

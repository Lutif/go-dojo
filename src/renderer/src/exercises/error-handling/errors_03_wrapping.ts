import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'errors_03_wrapping',
  title: 'Error Wrapping',
  category: 'Error Handling',
  subcategory: 'Error Handling',
  difficulty: 'beginner',
  order: 3,
  description: `Wrap errors to add context while preserving the original error. Error wrapping creates a chain showing where errors originated.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import (
	"errors"
	"testing"
)

func TestErrorWrapping(t *testing.T) {
	err := ReadConfig("missing.txt")
	if err == nil {
		t.Fatal("expected error")
	}
	
	if !errors.Is(err, ErrMissing) {
		t.Error("error chain broken")
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use `fmt.Errorf("%w", err)` to wrap errors with context',
    'Wrapped errors preserve the original error for inspection',
    'Build error chains that show the full path from root cause to caller',
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_10_error_interface',
  title: 'Error Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 10,
  description: `Implement the error interface for custom error types. Any type with Error() string method satisfies the error interface.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestStringFormatting(t *testing.T) {
	tests := []struct {
		name string
		val  interface{ String() string }
		want string
	}{
		{"Point(3,4)", Point{3, 4}, "(3, 4)"},
		{"Point(0,0)", Point{0, 0}, "(0, 0)"},
		{"Sunday", Sunday, "Sunday"},
		{"Friday", Friday, "Friday"},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.val.String(); got != tt.want {
				t.Errorf("got %q, want %q", got, tt.want)
			}
		})
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Implement Error() string method to create an error type',
    'Can add fields to carry additional context (code, details, etc.)',
    'Can be used with errors.Is() and errors.As() if properly wrapped',
  ],
}

export default exercise

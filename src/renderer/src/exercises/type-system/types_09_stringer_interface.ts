import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_09_stringer_interface',
  title: 'Stringer Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 9,
  description: `Implement the Stringer interface for custom string representations. Stringer defines how a type is converted to a string.`,
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
    'Implement String() string method to satisfy Stringer',
    'Used by fmt.Print when the value is formatted',
    'Enables readable output without explicit conversions',
  ],
}

export default exercise

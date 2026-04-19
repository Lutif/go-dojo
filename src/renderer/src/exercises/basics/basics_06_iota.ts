import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_06_iota',
  title: 'Iota',
  category: 'Basics',
  subcategory: 'Variables & Declarations',
  difficulty: 'beginner',
  order: 6,
  description: `\`iota\` is Go's auto-incrementing constant generator. Inside a \`const\` block, \`iota\` starts at 0 and increments by 1 for each constant.

This is commonly used to create enumerations:
\`\`\`
const (
    Red   = iota  // 0
    Green         // 1
    Blue          // 2
)
\`\`\`

Your task: create a set of day-of-week constants using \`iota\`, starting with Sunday = 0.`,
  code: `package main

// TODO: Define constants for days of the week using iota
// Sunday = 0, Monday = 1, ..., Saturday = 6

func GetDays() (int, int, int, int, int, int, int) {
	// Return Sunday through Saturday
	return 0, 0, 0, 0, 0, 0, 0
}`,
  testCode: `package main

import "testing"

func TestGetDays(t *testing.T) {
	sun, mon, tue, wed, thu, fri, sat := GetDays()
	days := []struct {
		name string
		got  int
		want int
	}{
		{"Sunday", sun, 0},
		{"Monday", mon, 1},
		{"Tuesday", tue, 2},
		{"Wednesday", wed, 3},
		{"Thursday", thu, 4},
		{"Friday", fri, 5},
		{"Saturday", sat, 6},
	}
	for _, d := range days {
		if d.got != d.want {
			t.Errorf("%s = %d, want %d", d.name, d.got, d.want)
		}
	}
}`,
  solution: `package main

const (
	Sunday    = iota // 0
	Monday           // 1
	Tuesday          // 2
	Wednesday        // 3
	Thursday         // 4
	Friday           // 5
	Saturday         // 6
)

func GetDays() (int, int, int, int, int, int, int) {
	return Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
}`,
  hints: [
    'Only the first constant needs = iota. Subsequent constants in the block auto-increment.',
    'iota resets to 0 at the start of each const block.',
    'You can use expressions with iota too: 1 << iota gives powers of 2 (1, 2, 4, 8...).'
  ],
}

export default exercise

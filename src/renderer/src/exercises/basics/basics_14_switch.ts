import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_14_switch',
  title: 'Switch',
  category: 'Basics',
  subcategory: 'Control Flow',
  difficulty: 'beginner',
  order: 14,
  description: `A \`switch\` compares one expression against a list of \`case\` values. In Go, when a case body finishes, **execution does not fall through** to the next case: there is an implicit "break" after each case, so you rarely write \`break\`. You can list several values in one case, separated by commas, if they should share the same code. A \`default\` case runs if nothing matches. If you really need the old C-style fall-through, add the \`fallthrough\` keyword explicitly. This usually leads to flatter, easier-to-read code than a long \`if/else\` chain when you compare the same value many ways.

\`\`\`
switch day {
case "Mon", "Tue", "Wed", "Thu", "Fri":
    return "weekday"
case "Sat", "Sun":
    return "weekend"
default:
    return "unknown"
}
\`\`\`

**Your task:** use \`switch\` in \`DayType\` and \`Grade\` as the comments describe.`,
  code: `package main

// DayType returns "weekday", "weekend", or "unknown"
// based on the day name (e.g., "Monday", "Saturday")
func DayType(day string) string {
	// TODO: Use a switch statement
	return ""
}

// Grade returns a letter grade for a score:
//   90-100 → "A"
//   80-89  → "B"
//   70-79  → "C"
//   60-69  → "D"
//   below 60 → "F"
func Grade(score int) string {
	// TODO: Use a switch statement
	// Hint: you can switch on score/10
	return ""
}`,
  testCode: `package main

import "testing"

func TestDayType(t *testing.T) {
	weekdays := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}
	for _, d := range weekdays {
		if got := DayType(d); got != "weekday" {
			t.Errorf("DayType(%q) = %q, want %q", d, got, "weekday")
		}
	}
	weekends := []string{"Saturday", "Sunday"}
	for _, d := range weekends {
		if got := DayType(d); got != "weekend" {
			t.Errorf("DayType(%q) = %q, want %q", d, got, "weekend")
		}
	}
	if got := DayType("Holiday"); got != "unknown" {
		t.Errorf("DayType(%q) = %q, want %q", "Holiday", got, "unknown")
	}
}

func TestGrade(t *testing.T) {
	tests := []struct {
		score int
		want  string
	}{
		{95, "A"}, {90, "A"}, {100, "A"},
		{85, "B"}, {80, "B"},
		{75, "C"}, {70, "C"},
		{65, "D"}, {60, "D"},
		{55, "F"}, {0, "F"},
	}
	for _, tt := range tests {
		got := Grade(tt.score)
		if got != tt.want {
			t.Errorf("Grade(%d) = %q, want %q", tt.score, got, tt.want)
		}
	}
}`,
  solution: `package main

func DayType(day string) string {
	switch day {
	case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday":
		return "weekday"
	case "Saturday", "Sunday":
		return "weekend"
	default:
		return "unknown"
	}
}

func Grade(score int) string {
	switch score / 10 {
	case 10, 9:
		return "A"
	case 8:
		return "B"
	case 7:
		return "C"
	case 6:
		return "D"
	default:
		return "F"
	}
}`,
  hints: [
    'Cases can match multiple values: case "Monday", "Tuesday", "Wednesday":',
    'No break needed — Go cases don\'t fall through by default.',
    'For Grade, dividing the score by 10 gives you a single digit to switch on: 95/10 = 9, 85/10 = 8, etc.'
  ],
}

export default exercise

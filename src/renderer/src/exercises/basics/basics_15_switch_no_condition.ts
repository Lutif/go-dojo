import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_15_switch_no_condition',
  title: 'Switch Without Condition',
  category: 'Basics',
  subcategory: 'Control Flow',
  difficulty: 'beginner',
  order: 15,
  description: `You may write \`switch\` with no value after the keyword. That is the same as \`switch true\` and is read as: **evaluate each case in order, run the first whose condition is true**. The first match wins, like \`if / else if / else\` but in a form that is easy to extend with new ranges. Stylistically, many Gophers use this for comparisons that do not all come from a single value (e.g. checking a number in bands).

\`\`\`
switch {
case temp < 0:
    return "freezing"
case temp < 20:
    return "cold"
default:
    return "warm"
}
\`\`\`

**Your task:** use a conditionless \`switch\` in \`Season\` and \`BMICategory\` to implement the rules in the comments.`,
  code: `package main

// Season returns the season name for a given month (1-12):
//   12, 1, 2   → "winter"
//   3, 4, 5    → "spring"
//   6, 7, 8    → "summer"
//   9, 10, 11  → "autumn"
//   otherwise  → "unknown"
func Season(month int) string {
	// TODO: Use switch without a condition
	return ""
}

// BMICategory returns a BMI classification:
//   below 18.5         → "underweight"
//   18.5 to 24.9       → "normal"
//   25.0 to 29.9       → "overweight"
//   30.0 and above     → "obese"
func BMICategory(bmi float64) string {
	// TODO: Use switch without a condition
	return ""
}`,
  testCode: `package main

import "testing"

func TestSeason(t *testing.T) {
	tests := []struct {
		month int
		want  string
	}{
		{12, "winter"}, {1, "winter"}, {2, "winter"},
		{3, "spring"}, {4, "spring"}, {5, "spring"},
		{6, "summer"}, {7, "summer"}, {8, "summer"},
		{9, "autumn"}, {10, "autumn"}, {11, "autumn"},
		{0, "unknown"}, {13, "unknown"},
	}
	for _, tt := range tests {
		got := Season(tt.month)
		if got != tt.want {
			t.Errorf("Season(%d) = %q, want %q", tt.month, got, tt.want)
		}
	}
}

func TestBMICategory(t *testing.T) {
	tests := []struct {
		bmi  float64
		want string
	}{
		{16.0, "underweight"},
		{18.5, "normal"},
		{22.0, "normal"},
		{24.9, "normal"},
		{25.0, "overweight"},
		{29.9, "overweight"},
		{30.0, "obese"},
		{35.5, "obese"},
	}
	for _, tt := range tests {
		got := BMICategory(tt.bmi)
		if got != tt.want {
			t.Errorf("BMICategory(%.1f) = %q, want %q", tt.bmi, got, tt.want)
		}
	}
}`,
  solution: `package main

func Season(month int) string {
	switch {
	case month == 12 || month == 1 || month == 2:
		return "winter"
	case month >= 3 && month <= 5:
		return "spring"
	case month >= 6 && month <= 8:
		return "summer"
	case month >= 9 && month <= 11:
		return "autumn"
	default:
		return "unknown"
	}
}

func BMICategory(bmi float64) string {
	switch {
	case bmi < 18.5:
		return "underweight"
	case bmi < 25.0:
		return "normal"
	case bmi < 30.0:
		return "overweight"
	default:
		return "obese"
	}
}`,
  hints: [
    'Write switch { ... } with no value after switch — each case is a boolean expression.',
    'For Season, be careful with winter: month 12 wraps around, so use || to check 12, 1, 2.',
    'For BMICategory, order your cases from smallest to largest and each case catches the range below the next threshold.'
  ],
}

export default exercise

import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_20_time_basics',
  title: 'time Basics',
  category: 'Standard Library',
  subcategory: 'Time',
  difficulty: 'intermediate',
  order: 20,
  description: `The \`time\` package handles dates, times, and durations:

\`\`\`
now := time.Now()
t := time.Date(2024, time.March, 15, 0, 0, 0, 0, time.UTC)

// Duration arithmetic
later := now.Add(2 * time.Hour)
diff := later.Sub(now)  // 2h0m0s

// Formatting uses a reference time: Mon Jan 2 15:04:05 MST 2006
formatted := now.Format("2006-01-02")      // "2024-03-15"
parsed, err := time.Parse("2006-01-02", "2024-03-15")
\`\`\`

Go's reference time: **January 2, 15:04:05, 2006, MST (UTC-7)**. Use these exact values in format strings.

Your task: work with time values and formatting.`,
  code: `package main

import (
	"fmt"
	"time"
)

// FormatDate formats a time as "YYYY-MM-DD".
func FormatDate(t time.Time) string {
	// TODO
	return ""
}

// FormatDateTime formats as "YYYY-MM-DD HH:MM:SS".
func FormatDateTime(t time.Time) string {
	// TODO
	return ""
}

// ParseDate parses a "YYYY-MM-DD" string into a time.Time.
func ParseDate(s string) (time.Time, error) {
	// TODO
	return time.Time{}, nil
}

// DaysBetween returns the number of full days between two times.
func DaysBetween(a, b time.Time) int {
	// TODO: Use Sub, convert to hours, divide by 24
	return 0
}

// AddBusinessDays adds n business days (Mon-Fri) to a date.
func AddBusinessDays(t time.Time, n int) time.Time {
	// TODO: Skip weekends
	return t
}

var _ = fmt.Sprintf
var _ = time.Now`,
  testCode: `package main

import (
	"testing"
	"time"
)

func TestFormatDate(t *testing.T) {
	dt := time.Date(2024, 3, 15, 0, 0, 0, 0, time.UTC)
	got := FormatDate(dt)
	if got != "2024-03-15" {
		t.Errorf("got %q", got)
	}
}

func TestFormatDateTime(t *testing.T) {
	dt := time.Date(2024, 3, 15, 14, 30, 45, 0, time.UTC)
	got := FormatDateTime(dt)
	if got != "2024-03-15 14:30:45" {
		t.Errorf("got %q", got)
	}
}

func TestParseDate(t *testing.T) {
	got, err := ParseDate("2024-03-15")
	if err != nil {
		t.Fatal(err)
	}
	if got.Year() != 2024 || got.Month() != 3 || got.Day() != 15 {
		t.Errorf("got %v", got)
	}
}

func TestParseDateInvalid(t *testing.T) {
	_, err := ParseDate("not-a-date")
	if err == nil {
		t.Error("expected error")
	}
}

func TestDaysBetween(t *testing.T) {
	a := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	b := time.Date(2024, 1, 10, 0, 0, 0, 0, time.UTC)
	got := DaysBetween(a, b)
	if got != 9 {
		t.Errorf("got %d, want 9", got)
	}
}

func TestDaysBetweenReverse(t *testing.T) {
	a := time.Date(2024, 1, 10, 0, 0, 0, 0, time.UTC)
	b := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	got := DaysBetween(a, b)
	if got != 9 {
		t.Errorf("got %d, want 9 (absolute)", got)
	}
}

func TestAddBusinessDays(t *testing.T) {
	// Friday March 15, 2024
	fri := time.Date(2024, 3, 15, 0, 0, 0, 0, time.UTC)
	got := AddBusinessDays(fri, 3)
	// Should skip weekend: Mon=1, Tue=2, Wed=3
	want := time.Date(2024, 3, 20, 0, 0, 0, 0, time.UTC)
	if !got.Equal(want) {
		t.Errorf("got %v, want %v (Wednesday)", got, want)
	}
}

func TestAddBusinessDaysWeekday(t *testing.T) {
	// Monday March 11, 2024
	mon := time.Date(2024, 3, 11, 0, 0, 0, 0, time.UTC)
	got := AddBusinessDays(mon, 5)
	want := time.Date(2024, 3, 18, 0, 0, 0, 0, time.UTC)
	if !got.Equal(want) {
		t.Errorf("got %v, want %v (next Monday)", got, want)
	}
}`,
  solution: `package main

import (
	"fmt"
	"math"
	"time"
)

func FormatDate(t time.Time) string {
	return t.Format("2006-01-02")
}

func FormatDateTime(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func ParseDate(s string) (time.Time, error) {
	return time.Parse("2006-01-02", s)
}

func DaysBetween(a, b time.Time) int {
	diff := b.Sub(a).Hours() / 24
	return int(math.Abs(diff))
}

func AddBusinessDays(t time.Time, n int) time.Time {
	added := 0
	for added < n {
		t = t.Add(24 * time.Hour)
		if t.Weekday() != time.Saturday && t.Weekday() != time.Sunday {
			added++
		}
	}
	return t
}

var _ = fmt.Sprintf
var _ = time.Now`,
  hints: [
    'FormatDate: t.Format("2006-01-02"). Remember: the reference time is Jan 2, 2006.',
    'DaysBetween: b.Sub(a) gives a Duration. Convert to hours, divide by 24, take absolute value.',
    'AddBusinessDays: loop adding one day at a time. Only count non-weekend days toward n.'
  ],
}

export default exercise

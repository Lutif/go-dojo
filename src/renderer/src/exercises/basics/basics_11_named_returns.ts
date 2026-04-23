import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_11_named_returns',
  title: 'Named Returns',
  category: 'Basics',
  subcategory: 'Functions',
  difficulty: 'beginner',
  order: 11,
  description: `In the return list you can give names, e.g. \`(area, perimeter float64)\`. Those names are **pre-declared variables** in the function body, initialized to their type’s zero value. You assign to them with \`=\` as the function runs, and you may end with a **bare** \`return\` (no values after the keyword) to send back whatever is in those names. It reads well when the return values are obvious in context, but it can be harder to follow in very long functions — use it where a bare \`return\` makes the intent clearer, not muddier. A normal \`return 1, 2\` still works too.

\`\`\`
func Split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return  // returns x and y
}
\`\`\`

**Your task:** implement \`RectangleProps\` and \`SplitFullName\` with named return parameters and a bare \`return\` where the starter expects it.`,
  code: `package main

// RectangleProps calculates area and perimeter of a rectangle
// Use named returns: (area, perimeter float64)
func RectangleProps(width, height float64) (area, perimeter float64) {
	// TODO: Calculate area and perimeter, then use a bare return
	return
}

// SplitFullName splits "First Last" into first and last names
// Use named returns: (first, last string)
func SplitFullName(full string) (first, last string) {
	// TODO: Find the space and split the string
	// Hint: use a for-range loop to find the space index
	return
}`,
  testCode: `package main

import "testing"

func TestRectangleProps(t *testing.T) {
	area, perim := RectangleProps(5, 3)
	if area != 15 {
		t.Errorf("area = %f, want 15", area)
	}
	if perim != 16 {
		t.Errorf("perimeter = %f, want 16", perim)
	}
	area2, perim2 := RectangleProps(10, 10)
	if area2 != 100 {
		t.Errorf("area = %f, want 100", area2)
	}
	if perim2 != 40 {
		t.Errorf("perimeter = %f, want 40", perim2)
	}
}

func TestSplitFullName(t *testing.T) {
	first, last := SplitFullName("John Doe")
	if first != "John" {
		t.Errorf("first = %q, want %q", first, "John")
	}
	if last != "Doe" {
		t.Errorf("last = %q, want %q", last, "Doe")
	}
	first2, last2 := SplitFullName("Go Gopher")
	if first2 != "Go" {
		t.Errorf("first = %q, want %q", first2, "Go")
	}
	if last2 != "Gopher" {
		t.Errorf("last = %q, want %q", last2, "Gopher")
	}
}`,
  solution: `package main

func RectangleProps(width, height float64) (area, perimeter float64) {
	area = width * height
	perimeter = 2 * (width + height)
	return
}

func SplitFullName(full string) (first, last string) {
	for i, ch := range full {
		if ch == ' ' {
			first = full[:i]
			last = full[i+1:]
			return
		}
	}
	first = full
	return
}`,
  hints: [
    'Named returns are already declared for you — assign to them directly: area = width * height',
    'A bare "return" (with no values) returns the current values of the named return variables.',
    'For SplitFullName, loop through the string to find the space, then use slicing: full[:i] and full[i+1:]'
  ],
}

export default exercise

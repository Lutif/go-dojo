import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_21_string_builder',
  title: 'String Builder',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'intermediate',
  order: 21,
  description: `Master efficient string building with \`strings.Builder\`. Building strings with \`+\` in loops is inefficient; StringBuilder accumulates strings and builds them all at once.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestBuilder(t *testing.T) {
	// Test fluent builder API
	// Verify method chaining
	// Check final object state
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Import \`strings\` package and use \`strings.Builder\`',
    'Use \`builder.WriteString()\` to append strings',
    'Call \`builder.String()\` to get the final concatenated string',
  ],
}

export default exercise

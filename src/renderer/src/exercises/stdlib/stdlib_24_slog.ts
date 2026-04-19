import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_24_slog',
  title: 'log/slog Structured Logging',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 24,
  description: `Use structured logging with slog (Go 1.21+). Structured logging outputs key-value pairs for easy parsing.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'slog.Info(), slog.Error(), slog.Warn() log at different levels',
    'Pass key-value pairs: slog.Info("msg", "key", value)',
    'Handler determines output format (JSON, text, custom)',
  ],
}

export default exercise

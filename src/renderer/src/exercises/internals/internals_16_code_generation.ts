import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_16_code_generation',
  title: 'Code Generation',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'advanced',
  order: 16,
  description: `## Code Generation`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

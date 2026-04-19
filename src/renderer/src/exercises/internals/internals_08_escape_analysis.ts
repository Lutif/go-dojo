import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_08_escape_analysis',
  title: 'Escape Analysis',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 8,
  description: `## Escape Analysis`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

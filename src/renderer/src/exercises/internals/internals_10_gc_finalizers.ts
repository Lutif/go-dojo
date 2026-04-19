import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_10_gc_finalizers',
  title: 'Garbage Collector',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 10,
  description: `## Garbage Collector`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

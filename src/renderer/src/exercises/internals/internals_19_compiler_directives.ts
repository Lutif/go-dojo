import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'internals_19_compiler_directives',
  title: 'Compiler Directives',
  category: 'Internals',
  subcategory: 'Internals',
  difficulty: 'expert',
  order: 19,
  description: `## Compiler Directives`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

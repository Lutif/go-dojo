import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_04_empty_interface',
  title: 'Empty Interface',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'beginner',
  order: 4,
  description: `## Empty Interface`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

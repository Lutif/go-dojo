import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_01_hello',
  title: 'Hello World',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 1,
  description: `## Hello World`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

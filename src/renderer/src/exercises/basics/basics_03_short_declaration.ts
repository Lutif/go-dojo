import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'basics_03_short_declaration',
  title: 'Short Declaration',
  category: 'Basics',
  subcategory: 'Basics',
  difficulty: 'beginner',
  order: 3,
  description: `## Short Declaration`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

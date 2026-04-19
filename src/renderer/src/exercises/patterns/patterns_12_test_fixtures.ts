import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_12_test_fixtures',
  title: 'Test Fixtures',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 12,
  description: `## Test Fixtures`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main\n\nimport \"testing\"\n\nfunc TestExample(t *testing.T) {}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [],
}

export default exercise

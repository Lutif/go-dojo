import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'patterns_03_factory',
  title: 'Factory Pattern',
  category: 'Patterns',
  subcategory: 'Patterns',
  difficulty: 'intermediate',
  order: 3,
  description: `Use factory pattern to create objects of different types. Factories encapsulate object creation logic.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestFactory(t *testing.T) {
	circle := NewShape("circle")
	if circle.Name() != "circle" {
		t.Error("factory failed to create circle")
	}
	
	rect := NewShape("rectangle")
	if rect.Name() != "rectangle" {
		t.Error("factory failed to create rectangle")
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Factory function creates instances of related types',
    'Enables easy switching between implementations',
    'Hide implementation details behind factory interface',
  ],
}

export default exercise

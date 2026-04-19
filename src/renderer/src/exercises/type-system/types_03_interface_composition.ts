import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'types_03_interface_composition',
  title: 'Interface Composition',
  category: 'Type System',
  subcategory: 'Type System',
  difficulty: 'intermediate',
  order: 3,
  description: `Embed interfaces to create larger interfaces. Interface embedding combines multiple interfaces into one larger interface.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestBufferRead(t *testing.T) {
	b := &Buffer{data: "hello"}
	if b.Read() != "hello" {
		t.Errorf("Expected 'hello', got %q", b.Read())
	}
}

func TestBufferWrite(t *testing.T) {
	b := &Buffer{}
	b.Write("world")
	if b.data != "world" {
		t.Errorf("Expected 'world', got %q", b.data)
	}
}

func TestBufferClose(t *testing.T) {
	b := &Buffer{}
	if !b.Close() {
		t.Error("Expected Close() to return true")
	}
}

func TestReadWriteCloser(t *testing.T) {
	b := NewBuffer()
	b.Write("test")
	if b.Read() != "test" {
		t.Errorf("Expected 'test', got %q", b.Read())
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Embedding one interface in another includes all its methods',
    'Combined interface requires implementing all methods from all embedded interfaces',
    'Useful for building rich interfaces from smaller, focused ones',
  ],
}

export default exercise

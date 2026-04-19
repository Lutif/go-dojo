import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'stdlib_12_json_unmarshal',
  title: 'JSON Unmarshal',
  category: 'Standard Library',
  subcategory: 'Standard Library',
  difficulty: 'intermediate',
  order: 12,
  description: `Parse JSON into structs with encoding/json. Unmarshaling populates structs from JSON data.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'json.Unmarshal(data, &v) parses JSON into v',
    'Struct tags map JSON keys to fields',
    'Use json.Decoder for streaming JSON from readers',
  ],
}

export default exercise

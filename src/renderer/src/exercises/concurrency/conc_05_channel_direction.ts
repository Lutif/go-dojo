import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_05_channel_direction',
  title: 'Channel Direction',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'beginner',
  order: 5,
  description: `Understand channel direction constraints: send-only and receive-only channels. Directional channels enforce communication patterns and catch errors at compile time.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestExercise(t *testing.T) {
	// TODO: Implement tests based on exercise requirements
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Send-only channels: \`chan<- T\` prevents receives from that parameter',
    'Receive-only channels: \`<-chan T\` prevents sends from that parameter',
    'Directional constraints help document intent and prevent misuse',
  ],
}

export default exercise

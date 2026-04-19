import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'conc_06_range_channel',
  title: 'Range over Channel',
  category: 'Concurrency',
  subcategory: 'Concurrency',
  difficulty: 'beginner',
  order: 6,
  description: `Learn to iterate over channel values with range until the channel is closed. Range on channels provides a clean way to consume all values sent on a channel.`,
  code: `package main\n\nfunc main() {}`,
  testCode: `package main

import "testing"

func TestChannel(t *testing.T) {
	ch := make(chan int)
	go func() {
		ch <- 42
	}()
	
	if v := <-ch; v != 42 {
		t.Errorf("got %d, want 42", v)
	}
}`,
  solution: `package main\n\nfunc main() {}`,
  hints: [
    'Use `for value := range ch` to receive values until the channel is closed',
    'Only the sender should close a channel; receiving from a closed channel returns zero value',
    'Panic occurs if you try to send on a closed channel',
  ],
}

export default exercise

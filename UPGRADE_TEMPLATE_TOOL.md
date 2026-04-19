# Exercise Upgrade Template Tool

Practical templates and snippets to speed up upgrading exercises to be JS-friendly.

---

## 🚀 Quick Start: Copy-Paste Templates

### Template 1: String/Formatting Exercises

```typescript
const exercise: Exercise = {
  id: 'ex-id',
  title: '...',
  description: `# [Task Title]

## What You Know from JavaScript
In JavaScript, you might handle [task] like this:
\`\`\`javascript
const result = input.split(',').map(x => x.trim()).join('|');
// "a, b, c" → "a|b|c"
\`\`\`

## In Go
Go has the same functionality but organized differently:
- \`strings.Split\` (like \`split()\`)
- \`strings.TrimSpace\` (like \`trim()\`)
- \`strings.Join\` (like \`join()\`)

These are in the \`strings\` package (must import).

## Your Task
[Concrete task]

**Example:**
- Input: \`"apple, banana, cherry"\`
- Output: \`"apple|banana|cherry"\`
`,
  
  code: \`package main

import (
  "fmt"
  "strings"
)

func main() {
  // TODO: Implement
  // Hint: See GO_SYNTAX_REFERENCE.md → Strings for split, join, trim
}
\`,
  
  hints: [
    "In JavaScript you'd use .split(). Go has strings.Split(). 
     Check GO_SYNTAX_REFERENCE.md for exact syntax.",
    
    "For trimming spaces, JavaScript has .trim(). 
     Go has strings.TrimSpace(). Same concept!",
    
    "Common issue: forgetting to import 'strings' package. 
     Always check imports at the top of the file."
  ],
}
```

### Template 2: Loop/Iteration Exercises

```typescript
description: `# [Task Title]

## What You Know from JavaScript
In JavaScript, you loop with:
\`\`\`javascript
for (const item of items) { console.log(item); }  // for...of
items.forEach(item => console.log(item));        // .forEach()
for (let i = 0; i < items.length; i++) { }       // C-style
\`\`\`

## In Go
Go has ONE loop type called \`for\` (no while, do-while, or forEach):
\`\`\`go
for item := range items { }       // for...range (like for...of)
for i := 0; i < len(items); i++ { } // C-style
for { }                           // infinite (use break)
\`\`\`

## Your Task
[Task description]
`,
  
  hints: [
    "Think about JavaScript's for...of: for (const x of arr) { }. 
     Go's for...range is the same idea: for x := range arr { }",
    
    "Need the index? JS gives you: arr.forEach((item, i) => {}). 
     Go gives you both by default: for i, item := range arr { }. 
     If you only need one, use '_' to ignore: for _, item := range arr { }",
    
    "Go's range works on slices, arrays, maps, strings, channels. 
     Much more consistent than JavaScript's multiple loop types!"
  ],
}
```

### Template 3: Error Handling Exercises

```typescript
description: `# [Task Title]

## What You Know from JavaScript
In JavaScript, you handle errors with try/catch:
\`\`\`javascript
try {
  const result = someFunction();
} catch (error) {
  console.error(error);
}
\`\`\`

## In Go
Go doesn't have exceptions. Instead, functions return errors:
\`\`\`go
result, err := someFunction()
if err != nil {
  log.Fatal(err)
}
\`\`\`

This is more explicit - you see error handling in the code.

## Your Task
[Task description]
`,
  
  hints: [
    "Stop thinking about try/catch. In Go, error handling IS visible. 
     Every function that can fail returns (value, error). Always check!",
    
    "'nil' is Go's null/undefined. Check 'if err != nil' 
     just like JavaScript's 'if (error !== null)'.",
    
    "Never ignore errors! In JavaScript you might skip try/catch sometimes. 
     In Go, the compiler won't let you forget error handling."
  ],
}
```

### Template 4: Struct/Type Exercises

```typescript
description: `# [Task Title]

## What You Know from JavaScript
In JavaScript, objects group related data:
\`\`\`javascript
const person = {
  name: "Alice",
  age: 30,
  greet() { return "Hi, I'm " + this.name; }
};
\`\`\`

## In Go
Go uses structs (type definitions) instead of dynamic objects:
\`\`\`go
type Person struct {
  Name string
  Age  int
}

func (p Person) Greet() string {
  return "Hi, I'm " + p.Name
}
\`\`\`

Structs are rigid but type-safe (compile-time checking).

## Your Task
[Task description]
`,
  
  hints: [
    "Think of struct definitions like TypeScript interfaces or Python dataclasses. 
     They define the shape of data. You must declare the type first.",
    
    "Methods in Go are outside the struct. It looks weird at first 
     (different from class methods), but it's more flexible.",
    
    "Capitalized fields are 'public', lowercase are 'private'. 
     In JavaScript, there's no real privacy, but Go enforces it at compile-time!"
  ],
}
```

### Template 5: Concurrency Exercises

```typescript
description: `# [Task Title]

## What You Know from JavaScript
In JavaScript, you handle async with:
\`\`\`javascript
Promise.all([task1(), task2()])
  .then(results => { })
  .catch(error => { });

async function work() {
  const result = await task();
}
\`\`\`

## In Go
Go uses goroutines and channels (simpler and more powerful):
\`\`\`go
go someFunction()           // start concurrent execution
ch := make(chan int)        // communicate between goroutines
value := <-ch              // receive value
\`\`\`

No callback hell, no Promise chains. Much cleaner!

## Your Task
[Task description]
`,
  
  hints: [
    "Goroutines are like Promises - they run in the background. 
     The 'go' keyword is like 'await' but doesn't block.",
    
    "Channels replace callbacks/promises. One goroutine sends (ch <- value), 
     another receives (<- ch). Clean communication!",
    
    "For multiple goroutines, use WaitGroup. 
     It's Go's answer to Promise.all() - simpler and more explicit."
  ],
}
```

---

## 🎯 Hint Template Library

### Conceptual Hint (For New Concepts)
```typescript
"In JavaScript, you [JS pattern]. In Go, [Go approach] instead. 
 The key difference: [why it's different]. 
 See GO_FOR_JS_DEVELOPERS.md → [concept]."
```

### Pattern Hint (For Familiar Patterns)
```typescript
"You know [JS pattern] from JavaScript. In Go, [Go equivalent]. 
 Watch out: [common mistake]. 
 See GO_SYNTAX_REFERENCE.md → [section]."
```

### Discovery Hint (Point to Docs)
```typescript
"Look in the '[package]' package for something related to [concept]. 
 Search for '[keyword]' in GO_SYNTAX_REFERENCE.md."
```

### Gotcha Hint (Common Mistakes)
```typescript
"Easy to forget: [what people do wrong]. 
 Remember: [correct approach]. 
 Example: [show correct way]."
```

### Analogy Hint (JS to Go)
```typescript
"This is like JavaScript [JS example]. 
 Here, you use [Go feature] instead: [Go code]. 
 Both do the same thing, just different syntax!"
```

---

## 🔧 Batch Upgrade Checklist

When upgrading a group of similar exercises:

### Before Starting
- [ ] Identify the pattern (what do these exercises have in common?)
- [ ] Find JS equivalent in GO_FOR_JS_DEVELOPERS.md
- [ ] Create base template
- [ ] List common hints

### For Each Exercise
- [ ] Update description with JS context
- [ ] Create/rewrite 3-4 hints using templates
- [ ] Add syntax reference comments to code
- [ ] Quick quality check

### After Batch
- [ ] Spot-check 2-3 for quality
- [ ] Make sure hints don't repeat
- [ ] Verify all references are correct

---

## 📝 Common JS-to-Go Mappings (Quick Reference)

Use these in hints/descriptions:

| Concept | JavaScript | Go |
|---------|------------|-----|
| Print | `console.log()` | `fmt.Println()` |
| Split string | `str.split(',')` | `strings.Split(str, ',')` |
| Join array | `arr.join(',')` | `strings.Join(arr, ',')` |
| Loop | `for...of`, `.forEach()` | `for...range` |
| Read file | `fs.readFileSync()` | `os.ReadFile()` |
| Async | `async/await` | `goroutines/channels` |
| Error | `throw error` | `return error` |
| Null check | `x === null` | `x == nil` |
| Type check | `typeof x` | `type assertions` |
| Object | `{key: value}` | `struct` or `map` |
| Array | `[1,2,3]` | `[]int{1,2,3}` |
| Dictionary | `{a: 1, b: 2}` | `map[string]int` |

---

## 🚀 Speed Tips

### To Upgrade Faster:
1. **Use templates** - Don't write from scratch
2. **Batch similar** - Do all "loop" exercises together
3. **Copy patterns** - Reuse good descriptions/hints
4. **Standardize** - Use the same hint phrasing for same concepts
5. **Spot check** - Don't need to review every single one

### Tools to Create (Future):
- Script to auto-generate descriptions from exercise title
- Hint generator based on pattern library
- Quality check script (validate all exercises have references)
- Batch description/hint replacer

---

## Example: Before & After

### BEFORE
```typescript
const exercise: Exercise = {
  id: 'stdlib_02_strings',
  title: 'strings Package',
  description: 'Learn the strings package functions.',
  hints: [
    'Use strings.Split',
    'Use strings.Contains',
    'Check the documentation'
  ],
}
```

### AFTER
```typescript
const exercise: Exercise = {
  id: 'stdlib_02_strings',
  title: 'Strings Package — Split, Join, Contains',
  description: `# Working with Strings

## What You Know from JavaScript
In JavaScript, you work with strings like this:
\`\`\`javascript
const parts = "apple,banana,cherry".split(',');
const text = parts.join('|');
const has = text.includes('apple');
\`\`\`

## In Go
Go organizes string operations in the \`strings\` package:
- \`strings.Split\` (like \`split()\`)
- \`strings.Join\` (like \`join()\`)
- \`strings.Contains\` (like \`includes()\`)

Same concepts, organized in one place, must be imported.

## Your Task
[actual task]
`,
  
  hints: [
    "In JavaScript you'd call .split() on a string directly. 
     In Go, you import 'strings' and call strings.Split(). 
     See GO_SYNTAX_REFERENCE.md → Strings → Split",
    
    "Both JavaScript and Go split by a delimiter (comma, space, etc.). 
     Go requires you to be explicit: strings.Split(text, ',').",
    
    "Common mistake: forgetting to import 'strings'. 
     The functions don't exist without the import!"
  ],
}
```

---

## When Ready to Deploy:

These templates can be turned into:
1. **Python script** - Generate upgrades from templates
2. **Interactive CLI** - Walk through each exercise
3. **Validation tool** - Check all exercises meet standards
4. **Dashboard** - Track upgrade progress

For now: **Copy, adapt, repeat** 🚀

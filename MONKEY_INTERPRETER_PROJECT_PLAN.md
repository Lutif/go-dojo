# Monkey Interpreter — Complete Project Plan
## Building an Interpreter in Go (Based on "Writing An Interpreter In Go" by Thorsten Ball)

### Overview
One unified project with 22 progressive steps, broken down into 3 phases:
- **Lexer** (Steps 1-6): Tokenization and lexical analysis
- **Parser** (Steps 7-14): Building an Abstract Syntax Tree (AST)
- **Evaluator** (Steps 15-22): Executing the AST

Each step is **small, focused, and builds incrementally** on the previous one.

---

## Phase 1: Lexer (6 steps)

### Step 1: Single-Character Tokens
- Recognize: `=`, `+`, `-`, `!`, `*`, `/`, `<`, `>`, `;`, `,`, `(`, `)`, `{`, `}`
- Struct: `type Token struct { Type TokenType; Literal string }`
- Concepts: Basic token types, byte-by-byte scanning

### Step 2: Numbers & Identifiers
- Parse numeric literals: `123`, `456`
- Parse identifiers: `x`, `foo`, `bar`
- Concepts: Helper functions (`isDigit`, `isLetter`)

### Step 3: Whitespace Skipping
- Skip spaces, tabs, newlines
- Maintain position tracking
- Concepts: State machine, lookahead

### Step 4: Keywords vs Identifiers
- Distinguish `let` from `let_var` (keyword vs identifier)
- Token types: LET, FN, IF, ELSE, RETURN, TRUE, FALSE
- Concepts: Keyword lookup tables

### Step 5: String Literals
- Parse `"hello world"` as STRING tokens
- Handle escape sequences (basic)
- Concepts: Quoted string parsing

### Step 6: Full Lexer Integration
- Combine all token types
- Proper EOF handling
- Concepts: Capstone - lexer complete

---

## Phase 2: Parser (8 steps)

### Step 7: Integer & Boolean Literals
- Parse `42`, `true`, `false`
- Return simple `IntegerLiteral` and `BooleanLiteral` AST nodes
- Concepts: Literal expressions, prefix parsing

### Step 8: Prefix Expressions
- Parse `-5`, `!true`, `-x`
- AST: `type PrefixExpression struct { Operator string; Right Expression }`
- Concepts: Operator parsing, recursive descent

### Step 9: Infix Expressions (Part 1: Arithmetic)
- Parse `3 + 4`, `x - y`, `2 * 3`
- Implement basic precedence
- Concepts: Infix operators, precedence climbing

### Step 10: Infix Expressions (Part 2: Comparison)
- Parse `x < y`, `5 > 3`, `a == b`, `x != y`
- AST: `type InfixExpression struct { Left, Operator, Right ... }`
- Concepts: Comparison operators, precedence levels

### Step 11: Grouped Expressions & Precedence
- Parse `(2 + 3) * 4` correctly
- Fix operator precedence with parentheses
- Concepts: Pratt parsing, precedence handling

### Step 12: If-Else Expressions
- Parse `if (x > 5) { x } else { 5 }`
- AST: `type IfExpression struct { Condition, Consequence, Alternative ... }`
- Concepts: Block statements, optional else

### Step 13: Function Literals & Parameters
- Parse `fn(x, y) { x + y }`
- AST: `type FunctionLiteral struct { Parameters, Body ... }`
- Concepts: Function parsing, parameter lists

### Step 14: Call Expressions (Capstone Parser)
- Parse `add(2, 3)`, `fn(x) { x }(5)`
- AST: `type CallExpression struct { Function, Arguments ... }`
- Concepts: Expression combinations, full parser complete

---

## Phase 3: Evaluator (8 steps)

### Step 15: Integer & Boolean Evaluation
- Evaluate `42` → integer value, `true` → boolean value
- Return proper Go types
- Concepts: Value representation, recursive evaluation

### Step 16: Prefix Expressions
- Evaluate `-5`, `!true`, `!false`
- AST execution: traverse and compute results
- Concepts: Operator application, type handling

### Step 17: Infix Expressions (Part 1: Arithmetic)
- Evaluate `3 + 4 = 7`, `10 - 2 = 8`, `2 * 5 = 10`
- Concepts: Binary operations, integer arithmetic

### Step 18: Infix Expressions (Part 2: Comparison & Logical)
- Evaluate `5 > 3 = true`, `a == b`, `x != y`
- Concepts: Comparison logic, boolean results

### Step 19: If-Else & Truthiness
- Evaluate conditions and pick branches
- Truthiness rules: `false` and `null` are falsy, else truthy
- Concepts: Control flow evaluation

### Step 20: Environment & Variables
- Implement `Environment` for variable bindings
- Evaluate `let x = 5; x` → `5`
- Concepts: Scope, variable storage

### Step 21: Functions & Closures
- Evaluate function literals (create function objects)
- Call functions with arguments
- Implement closures (functions capture environment)
- Concepts: Function objects, environment capture

### Step 22: Capstone - Full Interpreter
- Bring everything together
- Evaluate complete programs
- Error handling and return statements
- Concepts: Full execution, REPL-ready interpreter

---

## Implementation Notes

### Dependency Chain
Each step depends on all previous steps:
- Step 7 requires Steps 1-6 (need lexer first)
- Step 15 requires Steps 1-14 (need lexer + parser)
- Each step can be solved and tested independently

### Code Structure
- Each step includes:
  - `code`: Starter code with TODOs
  - `testCode`: Test cases to verify correctness
  - `solution`: Reference implementation
  - `hints`: Learning guidance

### Testing Strategy
- Small, focused tests for each step
- Tests can run standalone (lexer tests don't need parser)
- Build up to integration tests in later steps

### Learning Progression
- **Lexer**: Understand character scanning and tokenization
- **Parser**: Master recursive descent parsing and operator precedence
- **Evaluator**: Learn tree-walking interpretation and environments

---

## Summary
- **Total Exercises**: 22
- **Time Estimate**: 10-15 hours for complete implementation
- **Difficulty**: Intermediate (requires solid Go knowledge)
- **Prerequisites**: Structs, interfaces, recursion, type assertions

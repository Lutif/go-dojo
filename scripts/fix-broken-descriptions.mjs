/**
 * Fixes: description: "See the task below."<tail>",
 *   -> template literal with decoded \\n
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '../src/renderer/src/exercises')

const PREFIX = '\n  description: "See the task below."'

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.ts')) out.push(p)
  }
  return out
}

function decodeTail(tail) {
  let s = tail
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
  s = s.replace(/``go`/g, '```go\n')
  s = s.replace(/``go\n/g, '```go\n')
  s = s.replace(/``\n/g, '```\n')
  return s
}

function fixContent(s) {
  const codeIdx = s.indexOf('\n  code: ')
  if (codeIdx === -1) return null
  const descStart = s.indexOf('\n  description: ')
  if (descStart === -1 || descStart > codeIdx) return null
  const descBlock = s.slice(descStart, codeIdx)
  if (!descBlock.startsWith(PREFIX)) return null
  const lastQC = descBlock.lastIndexOf('",')
  if (lastQC === -1) return null
  const inner = descBlock.slice(PREFIX.length, lastQC)
  if (/^[\s,]*$/.test(inner)) return null
  const body = decodeTail(inner)
  const replacement =
    `\n  description: \`See the task below.\n${body}\`,` +
    descBlock.slice(lastQC + 2)
  return s.slice(0, descStart) + replacement + s.slice(codeIdx)
}

let total = 0
for (const f of walk(root)) {
  const s = fs.readFileSync(f, 'utf8')
  const next = fixContent(s)
  if (next && next !== s) {
    fs.writeFileSync(f, next)
    total++
    console.log('fixed', path.relative(root, f))
  }
}
console.log('done, fixed', total)

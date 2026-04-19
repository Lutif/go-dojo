/**
 * Fixes malformed exercise descriptions in *.ts files:
 * - Replaces `description: "See the task below."` + junk with a single \`...\` template literal
 *   that runs until the next `  code: ` line.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '../src/renderer/src/exercises')

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.ts')) out.push(p)
  }
  return out
}

function fixFile(filePath) {
  let s = fs.readFileSync(filePath, 'utf8')
  const marker = '\n  code: '
  const idx = s.indexOf(marker)
  if (idx === -1) return false

  const head = s.slice(0, idx)
  const tail = s.slice(idx)

  // Already starts with template literal after description:
  const descMatch = head.match(/\n  description: /)
  if (!descMatch) return false

  const afterDesc = head.slice(descMatch.index + descMatch[0].length)
  if (afterDesc.startsWith('`')) return false

  // Must start with broken double-quote form
  if (!afterDesc.startsWith('"See the task below.')) return false

  // Multi-line broken: description: "See the task below.", followed by ...\n...\n` until line with `,`
  const multi = head.match(
    /\n  description: "See the task below\.",[^\n]*\n([\s\S]*?)\n`,\n/
  )
  if (multi) {
    const body = multi[1]
    const fixed = head.slice(0, descMatch.index) + `\n  description: \`See the task below.\n${body}\n\`,\n`
    fs.writeFileSync(filePath, fixed + tail)
    return true
  }

  // Single-line broken string ending with ",\n  code:
  const single = head.match(
    /\n  description: "See the task below\.((?:[^"\\]|\\.)*)",\s*\n$/
  )
  if (single) {
    const inner = single[1]
      .replace(/\\n/g, '\n')
      .replace(/\\`/g, '`')
      .replace(/\\"/g, '"')
    const fixed =
      head.slice(0, descMatch.index) +
      `\n  description: \`See the task below.${inner}\`,\n`
    fs.writeFileSync(filePath, fixed + tail)
    return true
  }

  return false
}

let n = 0
for (const f of walk(root)) {
  try {
    if (fixFile(f)) {
      n++
      console.log('fixed', path.relative(root, f))
    }
  } catch (e) {
    console.error('failed', f, e.message)
  }
}
console.log('total fixed', n)

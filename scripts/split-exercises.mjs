#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildSync } from 'esbuild'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const exercisesDir = path.join(__dirname, '../src/renderer/src/exercises')
const tempDir = path.join(__dirname, '.temp-build')
const require = createRequire(import.meta.url)

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const categoryMap = {
  'Basics': 'basics',
  'Type System': 'type-system',
  'Error Handling': 'error-handling',
  'Concurrency': 'concurrency',
  'Standard Library': 'stdlib',
  'Patterns': 'patterns',
  'Internals': 'internals',
  'Networking': 'networking',
  'Data & Storage': 'data-storage',
  'Projects': 'projects',
}

function slugToCamelCase(slug) {
  return slug.split('-').reduce((acc, part, i) =>
    acc + (i === 0 ? part : part[0].toUpperCase() + part.slice(1))
  )
}

function formatField(key, value) {
  const indent = '  '

  if (typeof value === 'string') {
    // For multi-line strings, use backtick templates
    if (value.includes('\n')) {
      const escaped = value.replace(/`/g, '\\`').replace(/\$/g, '\\$')
      return `${indent}${key}: \`${escaped}\`,`
    }
    // Single-line strings
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
    return `${indent}${key}: '${escaped}',`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${indent}${key}: ${value},`
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}${key}: [],`
    if (value.every(v => typeof v === 'string')) {
      const items = value.map(s => {
        const esc = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
        return `'${esc}'`
      }).join(', ')
      return `${indent}${key}: [${items}],`
    }
    // Complex array
    const jsonStr = JSON.stringify(value, null, 2)
    const indented = jsonStr.split('\n').map((l, i) => i === 0 ? l : indent + l).join('\n')
    return `${indent}${key}: ${indented},`
  }

  if (typeof value === 'object' && value !== null) {
    const jsonStr = JSON.stringify(value, null, 2)
    const indented = jsonStr.split('\n').map((l, i) => i === 0 ? l : indent + l).join('\n')
    return `${indent}${key}: ${indented},`
  }

  return `${indent}${key}: ${JSON.stringify(value)},`
}

function serializeExercise(ex) {
  const lines = ['import { Exercise } from \'../../types\'', '']

  lines.push('const exercise: Exercise = {')

  // Serialize each field
  for (const [key, value] of Object.entries(ex)) {
    if (value === undefined) continue
    lines.push(formatField(key, value))
  }

  lines.push('}', '', 'export default exercise', '')
  return lines.join('\n')
}

async function migrateExercises() {
  const chapters = [
    '01-basics', '02-type-system', '03-error-handling', '04-concurrency',
    '05-stdlib', '06-patterns', '07-internals', '08-networking',
    '09-data-storage', '10-projects'
  ]

  const allExercises = []

  // Build and load each chapter using esbuild
  for (const chapter of chapters) {
    try {
      const inputPath = path.join(exercisesDir, `${chapter}.ts`)
      const outputPath = path.join(tempDir, `${chapter}.js`)

      // Build the TypeScript file to JavaScript
      buildSync({
        entryPoints: [inputPath],
        outfile: outputPath,
        format: 'cjs',
        platform: 'node',
      })

      // Clear require cache
      delete require.cache[require.resolve(outputPath)]

      // Load the built module
      const mod = require(outputPath)

      // Find the exercises array export
      const exercisesExport = Object.entries(mod).find(([key, val]) =>
        key.includes('Exercises') && Array.isArray(val)
      )

      if (exercisesExport) {
        const [_, exercises] = exercisesExport
        allExercises.push(...exercises)
        console.log(`✓ Loaded ${exercises.length} exercises from ${chapter}`)
      } else {
        console.warn(`✗ No exercises array found in ${chapter}`)
        console.log(`  Available exports: ${Object.keys(mod).join(', ')}`)
      }
    } catch (e) {
      console.error(`✗ Failed to load ${chapter}:`)
      console.error(`  ${e.message}`)
    }
  }

  console.log(`\nTotal exercises loaded: ${allExercises.length}`)

  // Group by category
  const byCategory = {}
  for (const ex of allExercises) {
    const slug = categoryMap[ex.category]
    if (!slug) {
      console.warn(`Unknown category: ${ex.category}`)
      continue
    }
    if (!byCategory[slug]) byCategory[slug] = []
    byCategory[slug].push(ex)
  }

  // Create category directories and files
  let totalFiles = 0
  for (const [slug, exercises] of Object.entries(byCategory)) {
    const dir = path.join(exercisesDir, slug)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const indexImports = []
    for (const ex of exercises) {
      const filename = `${ex.id}.ts`
      const filepath = path.join(dir, filename)
      fs.writeFileSync(filepath, serializeExercise(ex))

      const varName = '_' + ex.id.replace(/-/g, '_')
      indexImports.push(`import ${varName} from './${ex.id}'`)
    }

    // Write category index
    const varNames = exercises.map(e => '_' + e.id.replace(/-/g, '_'))
    const categoryIndex = [
      ...indexImports,
      '',
      'export const exercises = [',
      varNames.map(n => `  ${n},`).join('\n'),
      ']',
      ''
    ].join('\n')

    fs.writeFileSync(path.join(dir, 'index.ts'), categoryIndex)
    console.log(`✓ Created ${slug}/ with ${exercises.length} files`)
    totalFiles += exercises.length
  }

  // Generate main index
  const mainIndex = generateMainIndex(Object.keys(categoryMap))
  fs.writeFileSync(path.join(exercisesDir, 'index.ts'), mainIndex)
  console.log(`✓ Generated main index.ts`)
  console.log(`\n✓ Total: ${totalFiles} exercise files created`)

  // Cleanup temp directory
  fs.rmSync(tempDir, { recursive: true, force: true })
  console.log(`✓ Cleaned up temporary build files`)
}

function generateMainIndex(categories) {
  const imports = categories.map(cat => {
    const slug = categoryMap[cat]
    const varName = slugToCamelCase(slug) + 'Exercises'
    return `import { exercises as ${varName} } from './${slug}'`
  }).join('\n')

  const allExercises = categories.map(cat => {
    const varName = slugToCamelCase(categoryMap[cat]) + 'Exercises'
    return `  ...${varName},`
  }).join('\n')

  return `import { Exercise, Category } from '../types'

${imports}

const allExercises: Exercise[] = [
${allExercises}
]

export function getAllExercises(): Exercise[] {
  return allExercises
}

export function getCategories(): { name: Category; count: number }[] {
  const cats: Category[] = [
    'Basics',
    'Type System',
    'Error Handling',
    'Concurrency',
    'Standard Library',
    'Patterns',
    'Internals',
    'Networking',
    'Data & Storage',
    'Projects',
  ]
  return cats.map((name) => ({
    name,
    count: allExercises.filter((e) => e.category === name).length,
  }))
}

export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find((e) => e.id === id)
}
`
}

migrateExercises().catch(console.error)

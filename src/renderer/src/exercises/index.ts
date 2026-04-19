import { Exercise, Category } from '../types'

import { exercises as basicsExercises } from './basics'
import { exercises as typeSystemExercises } from './type-system'
import { exercises as errorHandlingExercises } from './error-handling'
import { exercises as concurrencyExercises } from './concurrency'
import { exercises as stdlibExercises } from './stdlib'
import { exercises as patternsExercises } from './patterns'
import { exercises as internalsExercises } from './internals'
import { exercises as networkingExercises } from './networking'
import { exercises as dataStorageExercises } from './data-storage'
import { exercises as projectsExercises } from './projects'

const allExercises: Exercise[] = [
  ...basicsExercises,
  ...typeSystemExercises,
  ...errorHandlingExercises,
  ...concurrencyExercises,
  ...stdlibExercises,
  ...patternsExercises,
  ...internalsExercises,
  ...networkingExercises,
  ...dataStorageExercises,
  ...projectsExercises,
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

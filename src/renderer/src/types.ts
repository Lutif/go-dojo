export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type Category =
  | 'Basics'
  | 'Type System'
  | 'Error Handling'
  | 'Concurrency'
  | 'Standard Library'
  | 'Patterns'
  | 'Internals'
  | 'Networking'
  | 'Data & Storage'
  | 'Projects'
  | 'Monkey Interpreter'

export type ExerciseStatus = 'locked' | 'available' | 'completed'

export interface Exercise {
  id: string
  title: string
  category: Category
  subcategory: string
  difficulty: Difficulty
  order: number
  description: string
  code: string
  testCode: string
  solution: string
  hints: string[]
  goMod?: string
  // Progressive project steps
  projectId?: string    // groups steps under one project
  projectTitle?: string // display name for the project group
  step?: number         // 1-indexed step within project
  totalSteps?: number   // how many steps in this project
  // Dependency graph
  requires?: string[]   // exercise IDs that must be completed first
  prereqHints?: Array<{ text: string; exerciseId: string; exerciseTitle: string }>
}

export interface RunResult {
  passed: boolean
  output: string
  error: string | null
}

/** Persisted layout: exercise panel, output strip, sidebar */
export interface ExerciseUi {
  leftColumnCollapsed?: boolean
  outputCollapsed?: boolean
  sidebarCollapsed?: boolean
}

export interface ProgressData {
  completed: Record<string, boolean>
  /** Work in progress (autosaved; may not pass tests yet) */
  drafts?: Record<string, string>
  /** Code that passed all tests (submitted solution) */
  submitted?: Record<string, string>
  /**
   * @deprecated Legacy field; merged into `drafts` on load if present
   */
  userCode?: Record<string, string>
  /** Exercise IDs the user marked to revisit */
  bookmarks?: Record<string, boolean>
  exerciseUi?: ExerciseUi
}

declare global {
  interface Window {
    api: {
      runExercise: (code: string, testCode: string, goMod?: string) => Promise<RunResult>
      runMultiFileExercise: (
        files: { name: string; content: string }[],
        testFiles: { name: string; content: string }[],
        goMod?: string
      ) => Promise<RunResult>
      checkGo: () => Promise<{ installed: boolean; version: string | null }>
      loadProgress: () => Promise<Record<string, any>>
      saveProgress: (data: Record<string, any>) => Promise<boolean>
    }
  }
}

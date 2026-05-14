import { WorkspaceProject } from '../../types'
import cliProject from './workspace-cli'
import subProject from './workspace-sub'
import restProject from './workspace-rest'
import lexProject from './workspace-lex'
import queueProject from './workspace-queue'
import kvProject from './workspace-kv'
import pipeProject from './workspace-pipe'
import poolProject from './workspace-pool'
import logProject from './workspace-log'
import watcherProject from './workspace-watcher'
import gitProject from './workspace-git'
import testProject from './workspace-test'
import monkeyProject from './workspace-monkey'

export const workspaceProjects: WorkspaceProject[] = [
  cliProject,
  subProject,
  restProject,
  lexProject,
  queueProject,
  kvProject,
  pipeProject,
  poolProject,
  logProject,
  watcherProject,
  gitProject,
  testProject,
  monkeyProject,
]

export function getWorkspaceProject(projectId: string): WorkspaceProject | undefined {
  return workspaceProjects.find((p) => p.projectId === projectId)
}

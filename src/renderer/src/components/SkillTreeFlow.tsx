import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import dagre from 'dagre'
import '@xyflow/react/dist/style.css'

import { Exercise, ExerciseStatus } from '../types'

/** Card nodes (dagre layout size) — matches typical React Flow examples */
const NODE_W = 168
const NODE_H = 52
const STANDALONE_GROUP_ID = 'standalone-group'
const GRID_COLS = 4
const CELL_PAD_X = 14
const CELL_PAD_Y = 12
const GROUP_PAD = 16
const HEADER_H = 28
const GAP_AFTER_MAIN = 72

type CatColors = Record<string, { node: string }>

/** No prerequisites and nothing else depends on this exercise */
function findIsolatedExerciseIds(exercises: Exercise[]): Set<string> {
  const rev = new Map<string, string[]>()
  for (const ex of exercises) {
    for (const r of ex.requires ?? []) {
      if (!rev.has(r)) rev.set(r, [])
      rev.get(r)!.push(ex.id)
    }
  }
  const isolated = new Set<string>()
  for (const ex of exercises) {
    const noPrereq = !(ex.requires ?? []).length
    const noDependents = !(rev.get(ex.id)?.length)
    if (noPrereq && noDependents) isolated.add(ex.id)
  }
  return isolated
}

/** Weakly connected components among non-isolated exercises; return node ids of the largest */
function findLargestConnectedComponentIds(exercises: Exercise[], isolated: Set<string>): string[] {
  const linkedIds = exercises.filter((e) => !isolated.has(e.id)).map((e) => e.id)
  if (linkedIds.length === 0) return []

  const adj = new Map<string, Set<string>>()
  for (const id of linkedIds) adj.set(id, new Set())

  for (const ex of exercises) {
    if (isolated.has(ex.id)) continue
    for (const r of ex.requires ?? []) {
      if (isolated.has(r)) continue
      if (!adj.has(ex.id) || !adj.has(r)) continue
      adj.get(r)!.add(ex.id)
      adj.get(ex.id)!.add(r)
    }
  }

  const visited = new Set<string>()
  let best: string[] = []

  for (const start of linkedIds) {
    if (visited.has(start)) continue
    const comp: string[] = []
    const stack = [start]
    while (stack.length) {
      const u = stack.pop()!
      if (visited.has(u)) continue
      visited.add(u)
      comp.push(u)
      for (const v of adj.get(u) ?? []) {
        if (!visited.has(v)) stack.push(v)
      }
    }
    if (comp.length > best.length) best = comp
  }
  return best
}

function layoutDagre(exercises: Exercise[], direction: 'LR' | 'TB'): Record<string, { x: number; y: number }> {
  if (exercises.length === 0) return {}
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    nodesep: 18,
    ranksep: 44,
    marginx: 32,
    marginy: 32,
  })

  for (const ex of exercises) {
    g.setNode(ex.id, { width: NODE_W, height: NODE_H })
  }
  for (const ex of exercises) {
    for (const req of ex.requires ?? []) {
      if (g.hasNode(req)) {
        g.setEdge(req, ex.id)
      }
    }
  }

  try {
    dagre.layout(g)
  } catch {
    return {}
  }

  const positions: Record<string, { x: number; y: number }> = {}
  for (const ex of exercises) {
    const n = g.node(ex.id)
    if (!n) continue
    positions[ex.id] = {
      x: n.x - NODE_W / 2,
      y: n.y - NODE_H / 2,
    }
  }
  return positions
}

/**
 * Dagre minimizes crossings but does not center the root row over the subtree width.
 * Shift the largest component so the top row (TB) or left column (LR) is centered on the bbox.
 */
const COORD_EPS = 4

function centerTopRankOnComponent(
  positions: Record<string, { x: number; y: number }>,
  componentIds: string[],
  direction: 'LR' | 'TB'
): Record<string, { x: number; y: number }> {
  if (componentIds.length === 0) return positions

  const out: Record<string, { x: number; y: number }> = { ...positions }

  if (direction === 'TB') {
    let minY = Infinity
    for (const id of componentIds) {
      const p = positions[id]
      if (p) minY = Math.min(minY, p.y)
    }
    if (!Number.isFinite(minY)) return positions

    const topIds = componentIds.filter((id) => {
      const p = positions[id]
      return p && Math.abs(p.y - minY) < COORD_EPS
    })
    if (topIds.length === 0) return positions

    let minX = Infinity,
      maxX = -Infinity
    for (const id of componentIds) {
      const p = positions[id]
      if (!p) continue
      minX = Math.min(minX, p.x)
      maxX = Math.max(maxX, p.x + NODE_W)
    }
    const bboxCenterX = (minX + maxX) / 2

    let sumTop = 0
    for (const id of topIds) {
      const p = positions[id]
      if (p) sumTop += p.x + NODE_W / 2
    }
    const topCenterX = sumTop / topIds.length

    const deltaX = bboxCenterX - topCenterX

    for (const id of componentIds) {
      const p = positions[id]
      if (p) out[id] = { x: p.x + deltaX, y: p.y }
    }
  } else {
    let minX = Infinity
    for (const id of componentIds) {
      const p = positions[id]
      if (p) minX = Math.min(minX, p.x)
    }
    if (!Number.isFinite(minX)) return positions

    const leftIds = componentIds.filter((id) => {
      const p = positions[id]
      return p && Math.abs(p.x - minX) < COORD_EPS
    })
    if (leftIds.length === 0) return positions

    let minY = Infinity,
      maxY = -Infinity
    for (const id of componentIds) {
      const p = positions[id]
      if (!p) continue
      minY = Math.min(minY, p.y)
      maxY = Math.max(maxY, p.y + NODE_H)
    }
    const bboxCenterY = (minY + maxY) / 2

    let sumLeft = 0
    for (const id of leftIds) {
      const p = positions[id]
      if (p) sumLeft += p.y + NODE_H / 2
    }
    const leftCenterY = sumLeft / leftIds.length

    const deltaY = bboxCenterY - leftCenterY

    for (const id of componentIds) {
      const p = positions[id]
      if (p) out[id] = { x: p.x, y: p.y + deltaY }
    }
  }

  return out
}

function bboxLinked(
  ids: string[],
  positions: Record<string, { x: number; y: number }>
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const id of ids) {
    const p = positions[id]
    if (!p) continue
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x + NODE_W)
    maxY = Math.max(maxY, p.y + NODE_H)
  }
  if (!Number.isFinite(minX)) return null
  return { minX, minY, maxX, maxY }
}

function gridDimensions(count: number): { cols: number; rows: number; width: number; height: number } {
  const cols = Math.min(GRID_COLS, Math.max(1, Math.ceil(Math.sqrt(count))))
  const rows = Math.ceil(count / cols)
  const cellW = NODE_W + CELL_PAD_X
  const cellH = NODE_H + CELL_PAD_Y
  const width = GROUP_PAD * 2 + cols * cellW
  const height = GROUP_PAD * 2 + HEADER_H + rows * cellH
  return { cols, rows, width, height }
}

function computeHighlightSet(selectedId: string | null, exercises: Exercise[]): Set<string> | null {
  if (!selectedId) return null
  const byId = new Map(exercises.map((e) => [e.id, e]))
  const rev = new Map<string, string[]>()
  for (const ex of exercises) {
    for (const r of ex.requires ?? []) {
      if (!rev.has(r)) rev.set(r, [])
      rev.get(r)!.push(ex.id)
    }
  }

  const anc = new Set<string>()
  const stack = [...(byId.get(selectedId)?.requires ?? [])]
  while (stack.length) {
    const r = stack.pop()!
    if (anc.has(r)) continue
    anc.add(r)
    stack.push(...(byId.get(r)?.requires ?? []))
  }

  const desc = new Set<string>()
  const stack2 = [...(rev.get(selectedId) ?? [])]
  while (stack2.length) {
    const d = stack2.pop()!
    if (desc.has(d)) continue
    desc.add(d)
    stack2.push(...(rev.get(d) ?? []))
  }

  return new Set([...anc, selectedId, ...desc])
}

function ExerciseNode({
  data,
}: NodeProps<{
  exercise: Exercise
  status: ExerciseStatus
  dim: boolean
  selected: boolean
  bookmarked: boolean
  catColor: string
  direction: 'LR' | 'TB'
  onOpen: () => void
}>) {
  const { exercise, status, dim, selected, bookmarked, catColor, direction, onOpen } = data
  const targetPos = direction === 'TB' ? Position.Top : Position.Left
  const sourcePos = direction === 'TB' ? Position.Bottom : Position.Right

  const handleCls =
    '!h-2.5 !w-2.5 !rounded-full !border-2 !border-white/90 !bg-zinc-900 !shadow-sm'

  const borderLeft = `4px solid ${catColor}`

  let cardBg = 'linear-gradient(165deg, #1e293b 0%, #0f172a 100%)'
  if (status === 'completed') {
    cardBg = 'linear-gradient(165deg, #166534 0%, #0f2918 100%)'
  } else if (status === 'available') {
    const c = catColor.length === 7 ? `${catColor}40` : catColor
    cardBg = `linear-gradient(165deg, ${c} 0%, #0f172a 100%)`
  }

  return (
    <div
      title={`${exercise.title} — double-click to open`}
      className={`relative cursor-pointer transition-all duration-150 ${
        dim ? 'opacity-[0.2] saturate-50' : 'opacity-100'
      } ${selected ? 'drop-shadow-[0_0_14px_rgba(34,211,238,0.45)]' : ''}`}
      style={{ width: NODE_W, height: NODE_H }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onOpen()
      }}
    >
      <Handle type="target" position={targetPos} className={handleCls} />
      <Handle type="source" position={sourcePos} className={handleCls} />
      <div
        className={`flex h-full w-full flex-col justify-center overflow-hidden rounded-lg border px-2 py-1.5 shadow-md ${
          selected ? 'border-go-cyan/80' : 'border-white/15'
        }`}
        style={{
          background: cardBg,
          borderLeft: borderLeft,
          boxShadow: selected ? '0 0 0 1px rgba(34, 211, 238, 0.35)' : '0 4px 14px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex min-w-0 items-start gap-1">
          {status === 'completed' && (
            <span className="mt-0.5 shrink-0 text-[11px] font-bold leading-none text-emerald-300">✓</span>
          )}
          <span className="line-clamp-2 text-left text-[10px] font-medium leading-snug text-slate-100">
            {exercise.title}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[9px] text-slate-500">{exercise.category}</div>
      </div>
      {bookmarked && (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 text-[11px] leading-none text-amber-400 drop-shadow-md">
          ★
        </span>
      )}
    </div>
  )
}

function StandaloneGroupNode({ data }: NodeProps<{ subtitle: string }>) {
  return (
    <div
      className="h-full w-full rounded-lg border border-go-border/70 bg-[#0a0f18]/90 shadow-inner"
      style={{ minWidth: 120, minHeight: 80 }}
    >
      <div className="rounded-t-md border-b border-go-border/50 bg-go-surface/40 px-2 py-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-go-muted">Standalone</div>
        <div className="text-[9px] leading-snug text-go-muted/80">{data.subtitle}</div>
      </div>
    </div>
  )
}

const nodeTypes = { exercise: ExerciseNode, standaloneGroup: StandaloneGroupNode }

function FitViewLargestTree({
  fitViewNodeIds,
  layoutKey,
}: {
  fitViewNodeIds: string[]
  /** Changes when layout / fit target changes (includes serialized fit-view ids) */
  layoutKey: string
}) {
  const { fitView } = useReactFlow()
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (fitViewNodeIds.length === 0) {
        fitView({ padding: 0.12, duration: 220 })
        return
      }
      fitView({
        nodes: fitViewNodeIds.map((nid) => ({ id: nid })),
        padding: 0.18,
        duration: 320,
        minZoom: 0.06,
        maxZoom: 2,
      })
    })
    return () => cancelAnimationFrame(id)
    // layoutKey drives when to re-fit; fitViewNodeIds matches that layout
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fitViewNodeIds tied to layoutKey
  }, [layoutKey, fitView])
  return null
}

type Props = {
  exercises: Exercise[]
  status: Record<string, ExerciseStatus>
  bookmarks?: Record<string, boolean>
  catColors: CatColors
  onSelectExercise: (e: Exercise) => void
}

function SkillTreeFlowInner({ exercises, status, bookmarks, catColors, onSelectExercise }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [direction, setDirection] = useState<'LR' | 'TB'>('TB')

  const isolatedIds = useMemo(() => findIsolatedExerciseIds(exercises), [exercises])

  const linkedExercises = useMemo(
    () => exercises.filter((e) => !isolatedIds.has(e.id)),
    [exercises, isolatedIds]
  )

  const isolatedSorted = useMemo(() => {
    return exercises
      .filter((e) => isolatedIds.has(e.id))
      .sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order)
  }, [exercises, isolatedIds])

  const dagrePositions = useMemo(() => layoutDagre(linkedExercises, direction), [linkedExercises, direction])

  const { positions, fitViewNodeIds, layoutKey } = useMemo(() => {
    const largest = findLargestConnectedComponentIds(exercises, isolatedIds)
    const centeredLinked = centerTopRankOnComponent(dagrePositions, largest, direction)

    const positions: Record<string, { x: number; y: number }> = { ...centeredLinked }

    let fitIds = [...largest]

    const nIso = isolatedSorted.length
    if (nIso > 0) {
      const { cols } = gridDimensions(nIso)
      const cellW = NODE_W + CELL_PAD_X
      const cellH = NODE_H + CELL_PAD_Y

      const bb = bboxLinked(
        linkedExercises.map((e) => e.id),
        centeredLinked
      )

      if (bb) {
        if (direction === 'LR') {
          positions[STANDALONE_GROUP_ID] = { x: bb.maxX + GAP_AFTER_MAIN, y: bb.minY }
        } else {
          positions[STANDALONE_GROUP_ID] = { x: bb.minX, y: bb.maxY + GAP_AFTER_MAIN }
        }
      } else {
        positions[STANDALONE_GROUP_ID] = { x: GROUP_PAD, y: GROUP_PAD }
      }

      isolatedSorted.forEach((ex, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        positions[ex.id] = {
          x: GROUP_PAD + col * cellW,
          y: HEADER_H + GROUP_PAD + row * cellH,
        }
      })

      if (fitIds.length === 0 && nIso > 0) {
        fitIds = [STANDALONE_GROUP_ID, ...isolatedSorted.map((e) => e.id)]
      }
    }

    const key = `${direction}-${exercises.length}-${isolatedSorted.length}-${linkedExercises.length}`

    return {
      positions,
      fitViewNodeIds: fitIds,
      layoutKey: key,
    }
  }, [dagrePositions, direction, exercises, isolatedSorted, isolatedIds, linkedExercises])

  const highlightSet = useMemo(() => computeHighlightSet(selectedId, exercises), [selectedId, exercises])

  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises])

  const openExercise = useCallback(
    (id: string) => {
      const ex = exerciseById.get(id)
      if (ex) onSelectExercise(ex)
    },
    [exerciseById, onSelectExercise]
  )

  const initialNodes = useMemo((): Node[] => {
    const nodes: Node[] = []
    const nIso = isolatedSorted.length

    if (nIso > 0) {
      const { width, height } = gridDimensions(nIso)
      nodes.push({
        id: STANDALONE_GROUP_ID,
        type: 'standaloneGroup',
        position: positions[STANDALONE_GROUP_ID] ?? { x: 0, y: 0 },
        style: { width, height, zIndex: 0 },
        selectable: false,
        draggable: false,
        data: {
          subtitle: 'No prerequisites · not required by other exercises',
        },
      })
    }

    for (const ex of exercises) {
      const pos = positions[ex.id]
      if (!pos) continue
      const st = status[ex.id] ?? 'locked'
      const cat = catColors[ex.category]?.node ?? '#64748b'
      const dim = highlightSet !== null && !highlightSet.has(ex.id)
      const isIso = isolatedIds.has(ex.id)

      nodes.push({
        id: ex.id,
        type: 'exercise',
        position: pos,
        parentId: isIso ? STANDALONE_GROUP_ID : undefined,
        extent: isIso ? 'parent' : undefined,
        zIndex: 1,
        data: {
          exercise: ex,
          status: st,
          dim,
          selected: selectedId === ex.id,
          bookmarked: !!bookmarks?.[ex.id],
          catColor: cat,
          direction,
          onOpen: () => openExercise(ex.id),
        },
      })
    }

    return nodes
  }, [
    exercises,
    positions,
    status,
    highlightSet,
    selectedId,
    bookmarks,
    catColors,
    isolatedSorted.length,
    isolatedIds,
    direction,
    openExercise,
  ])

  const initialEdges = useMemo((): Edge[] => {
    const edges: Edge[] = []
    for (const ex of exercises) {
      const col = catColors[ex.category]?.node ?? '#64748b'
      for (const req of ex.requires ?? []) {
        if (!exerciseById.has(req)) continue
        const onPath = highlightSet !== null && highlightSet.has(req) && highlightSet.has(ex.id)
        const faded = highlightSet !== null && !onPath
        edges.push({
          id: `${req}->${ex.id}`,
          source: req,
          target: ex.id,
          type: 'smoothstep',
          pathOptions: { borderRadius: 10, offset: 0 },
          style: {
            stroke: col,
            strokeWidth: onPath ? 2.75 : 1.5,
            opacity: highlightSet === null ? 0.38 : faded ? 0.08 : 0.92,
          },
          animated: onPath,
        })
      }
    }
    return edges
  }, [exercises, exerciseById, highlightSet, catColors])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  const fitViewIdsKey = fitViewNodeIds.join(',')

  const onNodeClick = useCallback((_evt: React.MouseEvent, node: Node) => {
    if (node.id === STANDALONE_GROUP_ID) return
    setSelectedId((prev) => (prev === node.id ? null : node.id))
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedId(null)
  }, [])

  const onNodeDoubleClick = useCallback(
    (_evt: React.MouseEvent, node: Node) => {
      if (node.id === STANDALONE_GROUP_ID) return
      openExercise(node.id)
    },
    [openExercise]
  )

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-go-border/40 bg-[#0d1117]">
      <div className="sticky top-0 z-20 shrink-0 border-b border-go-border/30 bg-[#0d1117]/95 px-3 py-2 backdrop-blur-sm">
        <p className="mb-2 text-[10px] leading-relaxed text-go-muted">
          <span className="text-go-text/90">Pan & zoom</span> the canvas (scroll / drag background).{' '}
          <span className="text-go-text/90">Click</span> a node to highlight its dependency cone.{' '}
          <span className="text-go-text/90">Double-click</span> a card to open that exercise (canvas double-click zoom is
          off so this works reliably).
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] text-go-muted">Layout:</span>
          <button
            type="button"
            onClick={() => setDirection('LR')}
            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
              direction === 'LR' ? 'bg-go-blue text-white' : 'bg-go-surface text-go-muted hover:text-go-text'
            }`}
          >
            Left → right
          </button>
          <button
            type="button"
            onClick={() => setDirection('TB')}
            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
              direction === 'TB' ? 'bg-go-blue text-white' : 'bg-go-surface text-go-muted hover:text-go-text'
            }`}
          >
            Top → bottom
          </button>
          {selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="ml-2 rounded px-2 py-0.5 text-[10px] text-go-muted underline hover:text-go-text"
            >
              Clear highlight
            </button>
          )}
        </div>
      </div>

      <div className="h-[min(70vh,560px)] min-h-[380px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onPaneClick}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          minZoom={0.06}
          maxZoom={2}
          fitView={false}
          className="bg-[#111827]"
          defaultEdgeOptions={{
            type: 'smoothstep',
            pathOptions: { borderRadius: 10 },
            interactionWidth: 22,
          }}
        >
          <FitViewLargestTree fitViewNodeIds={fitViewNodeIds} layoutKey={`${layoutKey}__${fitViewIdsKey}`} />
          <Background
            id="skill-tree-grid"
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1.15}
            color="#475569"
            className="opacity-[0.45]"
          />
          <Controls showInteractive={false} className="!rounded-lg !border !border-slate-600/80 !bg-slate-800/95 !shadow-xl" />
          <MiniMap
            className="!bg-go-darker/95 !border-go-border"
            maskColor="rgba(6, 10, 18, 0.72)"
            nodeStrokeWidth={2}
            zoomable
            pannable
            style={{ width: 120, height: 88 }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default function SkillTreeFlow(props: Props) {
  return (
    <ReactFlowProvider>
      <SkillTreeFlowInner {...props} />
    </ReactFlowProvider>
  )
}

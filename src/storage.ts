import type { Edge, Node } from '@xyflow/react'
import type { ArchNodeData } from './types'

const KEY = 'mind-diagram-v1'

export type SavedDiagram = {
  nodes: Node<ArchNodeData>[]
  edges: Edge[]
}

export function loadDiagram(): SavedDiagram | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedDiagram
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveDiagram(diagram: SavedDiagram) {
  localStorage.setItem(KEY, JSON.stringify(diagram))
}

export function downloadJson(diagram: SavedDiagram) {
  const blob = new Blob([JSON.stringify(diagram, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mind-arquitetura-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

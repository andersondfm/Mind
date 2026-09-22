import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  MarkerType,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import { CATALOG_BY_ID } from '../catalog'
import {
  applyPrefs,
  loadPrefs,
  nextFontScale,
  savePrefs,
  type Prefs,
} from '../prefs'
import { downloadPdf } from '../exportPdf'
import { downloadJson, loadDiagram, saveDiagram } from '../storage'
import type { ArchNodeData, CatalogItem } from '../types'
import { ArchNode } from './ArchNode'
import { Inspector } from './Inspector'
import { Sidebar } from './Sidebar'
import { Toolbar } from './Toolbar'

const nodeTypes = { arch: ArchNode }

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: '#8b97ab', strokeWidth: 1.7 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#8b97ab',
    width: 16,
    height: 16,
  },
}

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

function toArchNode(item: CatalogItem, position: { x: number; y: number }): Node<ArchNodeData> {
  const isText = item.id === 'textbox'
  return {
    id: nextId('n'),
    type: 'arch',
    position,
    style: isText ? { width: 260, height: 120 } : { width: 200, height: 72 },
    data: {
      catalogId: item.id,
      label: isText ? '' : item.name,
      note: '',
      color: item.color,
      initials: item.initials,
      category: item.category,
      status: 'none',
    },
  }
}

export function FlowCanvas() {
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const initial = loadPrefs()
    applyPrefs(initial)
    return initial
  })
  const saved = useMemo(() => loadDiagram(), [])
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ArchNodeData>>(
    saved?.nodes ?? [],
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(saved?.edges ?? [])
  const { screenToFlowPosition, fitView } = useReactFlow()
  const selectedItem = useRef<CatalogItem | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [exportingPdf, setExportingPdf] = useState(false)
  const selectedNode = nodes.find((node) => node.selected) ?? null
  const selectedEdge = selectedNode
    ? null
    : (edges.find((edge) => edge.selected) ?? null)

  useEffect(() => {
    saveDiagram({ nodes, edges })
  }, [nodes, edges])

  useEffect(() => {
    applyPrefs(prefs)
    savePrefs(prefs)
  }, [prefs])

  useEffect(() => {
    const color = prefs.theme === 'light' ? '#6b7688' : '#8b97ab'
    const labelFill = prefs.theme === 'light' ? '#1a2130' : '#e8edf5'
    const labelBg = prefs.theme === 'light' ? '#eef2f6' : '#10141c'
    setEdges((current) =>
      current.map((edge) => ({
        ...edge,
        style: { ...edge.style, stroke: color },
        labelStyle: { ...edge.labelStyle, fill: labelFill, fontSize: 11 },
        labelBgStyle: { ...edge.labelBgStyle, fill: labelBg },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color,
          width: 16,
          height: 16,
        },
      })),
    )
  }, [prefs.theme, setEdges])

  const edgeColor = prefs.theme === 'light' ? '#6b7688' : '#8b97ab'
  const edgeLabelFill = prefs.theme === 'light' ? '#1a2130' : '#e8edf5'
  const edgeLabelBg = prefs.theme === 'light' ? '#eef2f6' : '#10141c'

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            id: nextId('e'),
            label: '',
          },
          current,
        ),
      )
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData('application/mind-node')
      const item = raw
        ? (JSON.parse(raw) as CatalogItem)
        : selectedItem.current
      if (!item || !CATALOG_BY_ID.has(item.id)) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      setNodes((current) =>
        current
          .map((node) => ({ ...node, selected: false }))
          .concat({ ...toArchNode(item, position), selected: true }),
      )
    },
    [screenToFlowPosition, setNodes],
  )

  const addItemAtCenter = useCallback(
    (item: CatalogItem) => {
      const bounds = boardRef.current?.getBoundingClientRect()
      const origin = bounds
        ? {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const position = screenToFlowPosition(origin)
      setNodes((current) => {
        const col = current.length % 4
        const row = Math.floor(current.length / 4)
        return current
          .map((node) => ({ ...node, selected: false }))
          .concat({
            ...toArchNode(item, {
              x: position.x + col * 240 - 300,
              y: position.y + row * 150 - 60,
            }),
            selected: true,
          })
      })
    },
    [screenToFlowPosition, setNodes],
  )

  function changeNode(id: string, patch: Partial<ArchNodeData>) {
    setNodes((current) =>
      current.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...patch } }
          : node,
      ),
    )
  }

  function resizeNode(id: string, direction: 'up' | 'down') {
    const factor = direction === 'up' ? 1.18 : 0.85
    setNodes((current) =>
      current.map((node) => {
        if (node.id !== id) return node
        const width = Number(node.style?.width) || 200
        const height = Number(node.style?.height) || 72
        return {
          ...node,
          style: {
            ...node.style,
            width: Math.min(560, Math.max(140, Math.round(width * factor))),
            height: Math.min(380, Math.max(56, Math.round(height * factor))),
          },
        }
      }),
    )
  }

  function changeEdge(id: string, label: string) {
    setEdges((current) =>
      current.map((edge) => (edge.id === id ? { ...edge, label } : edge)),
    )
  }

  function removeSelected() {
    setNodes((current) => current.filter((node) => !node.selected))
    setEdges((current) => current.filter((edge) => !edge.selected))
  }

  function clearBoard() {
    if (nodes.length === 0 && edges.length === 0) return
    const ok = window.confirm('Limpar toda a lousa? Isso não pode ser desfeito.')
    if (!ok) return
    setNodes([])
    setEdges([])
  }

  async function importFile(file: File) {
    const text = await file.text()
    const parsed = JSON.parse(text) as { nodes?: Node<ArchNodeData>[]; edges?: Edge[] }
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      window.alert('Arquivo JSON inválido.')
      return
    }
    setNodes(parsed.nodes)
    setEdges(parsed.edges)
    requestAnimationFrame(() => fitView({ padding: 0.2 }))
  }

  return (
    <div className="workspace">
      <Toolbar
        nodeCount={nodes.length}
        edgeCount={edges.length}
        theme={prefs.theme}
        onFit={() => fitView({ padding: 0.2 })}
        onClear={clearBoard}
        onExport={() => downloadJson({ nodes, edges })}
        onExportPdf={() => {
          setExportingPdf(true)
          void downloadPdf(nodes)
            .catch(() => {
              window.alert('Não foi possível gerar o PDF.')
            })
            .finally(() => setExportingPdf(false))
        }}
        onImport={importFile}
        exportingPdf={exportingPdf}
        onToggleTheme={() =>
          setPrefs((current) => ({
            ...current,
            theme: current.theme === 'light' ? 'dark' : 'light',
          }))
        }
        onFont={(direction) =>
          setPrefs((current) => ({
            ...current,
            fontScale: nextFontScale(current.fontScale, direction),
          }))
        }
      />
      <div className="workspace-body">
        <Sidebar
          onDragItem={(item) => {
            selectedItem.current = item
          }}
          onAddItem={addItemAtCenter}
        />
        <div className="board" ref={boardRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              ...defaultEdgeOptions,
              style: { stroke: edgeColor, strokeWidth: 1.7 },
              labelStyle: { fill: edgeLabelFill, fontSize: 11 },
              labelBgStyle: { fill: edgeLabelBg },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: edgeColor,
                width: 16,
                height: 16,
              },
            }}
            fitView
            colorMode={prefs.theme}
            deleteKeyCode={['Backspace', 'Delete']}
            connectionLineStyle={{ stroke: '#5aa7ff', strokeWidth: 1.6 }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={22}
              size={1.2}
              color={prefs.theme === 'light' ? '#c5ced8' : '#2a3344'}
            />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => {
                const data = node.data as ArchNodeData
                if (data.status === 'done') return '#3dd68c'
                if (data.status === 'wip') return '#e8c547'
                if (data.status === 'debt') return '#e35d6a'
                return data.color
              }}
              maskColor={
                prefs.theme === 'light'
                  ? 'rgba(255, 255, 255, 0.62)'
                  : 'rgba(8, 10, 14, 0.72)'
              }
            />
          </ReactFlow>
          {nodes.length === 0 ? (
            <div className="empty-board">
              <ol>
                <li>Clique ou arraste React, Node, S3, AKS… da esquerda</li>
                <li>Ligue pelas bolinhas nas laterais do card</li>
                <li>Clique no componente para escrever um texto</li>
              </ol>
            </div>
          ) : null}
          {selectedNode || selectedEdge ? (
            <Inspector
              node={selectedNode}
              edge={selectedEdge}
              onChangeNode={changeNode}
              onChangeEdge={changeEdge}
              onResizeNode={resizeNode}
              onDelete={removeSelected}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

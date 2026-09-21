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
import { useCallback, useEffect, useMemo, useRef, type DragEvent } from 'react'
import { CATALOG_BY_ID } from '../catalog'
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
  return {
    id: nextId('n'),
    type: 'arch',
    position,
    data: {
      catalogId: item.id,
      label: item.name,
      note: '',
      color: item.color,
      initials: item.initials,
      category: item.category,
    },
  }
}

export function FlowCanvas() {
  const saved = useMemo(() => loadDiagram(), [])
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ArchNodeData>>(
    saved?.nodes ?? [],
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(saved?.edges ?? [])
  const { screenToFlowPosition, fitView } = useReactFlow()
  const selectedItem = useRef<CatalogItem | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const selectedNode = nodes.find((node) => node.selected) ?? null
  const selectedEdge = selectedNode
    ? null
    : (edges.find((edge) => edge.selected) ?? null)

  useEffect(() => {
    saveDiagram({ nodes, edges })
  }, [nodes, edges])

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
        onFit={() => fitView({ padding: 0.2 })}
        onClear={clearBoard}
        onExport={() => downloadJson({ nodes, edges })}
        onImport={importFile}
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
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            colorMode="dark"
            deleteKeyCode={['Backspace', 'Delete']}
            connectionLineStyle={{ stroke: '#5aa7ff', strokeWidth: 1.6 }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={22}
              size={1.2}
              color="#2a3344"
            />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => (node.data as ArchNodeData).color}
              maskColor="rgba(8, 10, 14, 0.72)"
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
              onDelete={removeSelected}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

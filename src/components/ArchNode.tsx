import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { IconTile } from '../icons/IconTile'
import type { ArchNodeData } from '../types'

export function ArchNode({ id, data, selected }: NodeProps<Node<ArchNodeData>>) {
  const { updateNodeData } = useReactFlow()

  return (
    <div className={`arch-node${selected ? ' is-selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="arch-handle" />
      <Handle type="target" position={Position.Top} id="top" className="arch-handle" />
      <IconTile id={data.catalogId} color={data.color} size="md" />
      <div className="arch-node-copy">
        <strong>{data.label}</strong>
        {selected ? (
          <textarea
            className="nodrag nowheel arch-inline"
            value={data.note}
            rows={2}
            placeholder="Escreva um texto..."
            onChange={(event) => updateNodeData(id, { note: event.target.value })}
          />
        ) : data.note ? (
          <p>{data.note}</p>
        ) : null}
      </div>
      <Handle type="source" position={Position.Right} className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
    </div>
  )
}

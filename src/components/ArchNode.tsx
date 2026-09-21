import {
  Handle,
  NodeResizer,
  Position,
  useReactFlow,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import { IconTile } from '../icons/IconTile'
import type { ArchNodeData } from '../types'

export function ArchNode({ id, data, selected }: NodeProps<Node<ArchNodeData>>) {
  const { updateNodeData } = useReactFlow()
  const isText = data.catalogId === 'textbox'
  const status = data.status ?? 'none'

  return (
    <div
      className={`arch-node${selected ? ' is-selected' : ''}${isText ? ' is-text' : ''} status-${status}`}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={56}
        color="#4ea1ff"
      />
      <Handle type="target" position={Position.Left} className="arch-handle" />
      <Handle type="target" position={Position.Top} id="top" className="arch-handle" />
      {isText ? null : <IconTile id={data.catalogId} color={data.color} size="md" />}
      <div className="arch-node-copy">
        {selected ? (
          <>
            <input
              className="nodrag nowheel arch-inline"
              value={data.label}
              placeholder={isText ? 'Título da caixa' : 'Nome'}
              onChange={(event) => updateNodeData(id, { label: event.target.value })}
            />
            <textarea
              className="nodrag nowheel arch-inline"
              value={data.note}
              rows={isText ? 4 : 2}
              placeholder={isText ? 'Escreva o texto...' : 'Escreva um texto...'}
              onChange={(event) => updateNodeData(id, { note: event.target.value })}
            />
          </>
        ) : (
          <>
            <strong>{data.label || (isText ? 'Título' : '')}</strong>
            {data.note ? <p>{data.note}</p> : null}
          </>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
    </div>
  )
}

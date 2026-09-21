import type { Edge, Node } from '@xyflow/react'
import type { ArchNodeData } from '../types'

type InspectorProps = {
  node: Node<ArchNodeData> | null
  edge: Edge | null
  onChangeNode: (id: string, patch: Partial<ArchNodeData>) => void
  onChangeEdge: (id: string, label: string) => void
  onDelete: () => void
}

export function Inspector({
  node,
  edge,
  onChangeNode,
  onChangeEdge,
  onDelete,
}: InspectorProps) {
  if (!node && !edge) {
    return (
      <aside className="inspector">
        <p className="sidebar-kicker">Detalhe</p>
        <h2>Nada selecionado</h2>
        <p className="inspector-hint">
          Clique em um componente para escrever um texto. Clique na linha para
          nomear a conexão, por exemplo <em>REST</em> ou <em>HTTPS</em>.
        </p>
      </aside>
    )
  }

  if (edge) {
    return (
      <aside className="inspector">
        <p className="sidebar-kicker">Conexão</p>
        <h2>Texto do link</h2>
        <label className="field">
          <span>Rótulo</span>
          <input
            value={typeof edge.label === 'string' ? edge.label : ''}
            onChange={(event) => onChangeEdge(edge.id, event.target.value)}
            placeholder="API, HTTPS, fila..."
          />
        </label>
        <button type="button" className="danger" onClick={onDelete}>
          Remover conexão
        </button>
      </aside>
    )
  }

  if (!node) return null

  return (
    <aside className="inspector">
      <p className="sidebar-kicker">Componente</p>
      <h2>{node.data.label}</h2>
      <label className="field">
        <span>Nome</span>
        <input
          value={node.data.label}
          onChange={(event) =>
            onChangeNode(node.id, { label: event.target.value })
          }
        />
      </label>
      <label className="field">
        <span>Texto</span>
        <textarea
          value={node.data.note}
          onChange={(event) =>
            onChangeNode(node.id, { note: event.target.value })
          }
          placeholder="Ex: autentica o usuário e chama a API"
          rows={5}
        />
      </label>
      <button type="button" className="danger" onClick={onDelete}>
        Remover componente
      </button>
    </aside>
  )
}

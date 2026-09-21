import type { Edge, Node } from '@xyflow/react'
import { BOX_STATUSES, type ArchNodeData } from '../types'

type InspectorProps = {
  node: Node<ArchNodeData> | null
  edge: Edge | null
  onChangeNode: (id: string, patch: Partial<ArchNodeData>) => void
  onChangeEdge: (id: string, label: string) => void
  onResizeNode: (id: string, direction: 'up' | 'down') => void
  onDelete: () => void
}

export function Inspector({
  node,
  edge,
  onChangeNode,
  onChangeEdge,
  onResizeNode,
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

  const isText = node.data.catalogId === 'textbox'
  const status = node.data.status ?? 'none'

  return (
    <aside className="inspector">
      <p className="sidebar-kicker">{isText ? 'Caixa de texto' : 'Componente'}</p>
      <h2>{node.data.label || (isText ? 'Título' : 'Componente')}</h2>
      <label className="field">
        <span>{isText ? 'Título' : 'Nome'}</span>
        <input
          value={node.data.label}
          placeholder={isText ? 'Título da caixa' : 'Nome'}
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
          placeholder={
            isText
              ? 'Descreva o bloco, a decisão ou a nota'
              : 'Ex: autentica o usuário e chama a API'
          }
          rows={5}
        />
      </label>

      <div className="field">
        <span>Cor da caixa</span>
        <div className="status-picks">
          {BOX_STATUSES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`status-pick${status === item.id ? ' is-on' : ''}`}
              onClick={() => onChangeNode(node.id, { status: item.id })}
            >
              <i style={{ background: item.color }} />
              {item.label}
            </button>
          ))}
        </div>
        <p className="inspector-hint">
          Verde: feito. Amarelo: em desenvolvimento. Vermelho: débito técnico.
        </p>
      </div>

      <div className="field">
        <span>Tamanho</span>
        <div className="size-picks">
          <button type="button" onClick={() => onResizeNode(node.id, 'down')}>
            Diminuir
          </button>
          <button type="button" onClick={() => onResizeNode(node.id, 'up')}>
            Aumentar
          </button>
        </div>
        <p className="inspector-hint">
          Ou arraste o canto da caixa selecionada.
        </p>
      </div>

      <button type="button" className="danger" onClick={onDelete}>
        Remover componente
      </button>
    </aside>
  )
}

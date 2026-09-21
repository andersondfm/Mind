import { useMemo, useRef, useState } from 'react'
import { CATALOG, CATEGORIES } from '../catalog'
import { IconTile } from '../icons/IconTile'
import type { CatalogItem, CategoryId } from '../types'

type SidebarProps = {
  onDragItem: (item: CatalogItem) => void
  onAddItem: (item: CatalogItem) => void
}

export function Sidebar({ onDragItem, onAddItem }: SidebarProps) {
  const dragging = useRef(false)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({
    architecture: true,
    languages: true,
    frontend: true,
    backend: true,
    databases: false,
    servers: false,
    aws: false,
    azure: false,
    devops: false,
  }))

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = needle
      ? CATALOG.filter((item) => {
          const name = item.name.toLowerCase()
          const tokens = name.split(/[\s./+-]+/)
          return (
            item.id.toLowerCase().includes(needle) ||
            item.initials.toLowerCase().includes(needle) ||
            name.startsWith(needle) ||
            tokens.some((token) => token.startsWith(needle))
          )
        })
      : CATALOG

    return CATEGORIES.map((category) => ({
      ...category,
      items: filtered.filter((item) => item.category === category.id),
    })).filter((group) => group.items.length > 0)
  }, [query])

  function toggle(id: CategoryId) {
    setOpen((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <p className="sidebar-kicker">Componentes</p>
        <h2>Clique ou arraste</h2>
        <label className="search">
          <span className="sr-only">Buscar componente</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar React, S3, AKS..."
          />
        </label>
      </div>

      <div className="sidebar-groups">
        {grouped.map((group) => (
          <section key={group.id} className="catalog-group">
            <button
              type="button"
              className="catalog-toggle"
              onClick={() => toggle(group.id)}
              aria-expanded={open[group.id] !== false}
            >
              <span>{group.label}</span>
              <em>{group.items.length}</em>
            </button>
            {open[group.id] !== false || query.trim() ? (
              <ul>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="catalog-item"
                      draggable
                      title={`${item.name} — arraste ou clique para soltar na lousa`}
                      onClick={() => {
                        if (dragging.current) return
                        onAddItem(item)
                      }}
                      onDragStart={(event) => {
                        dragging.current = true
                        event.dataTransfer.setData(
                          'application/mind-node',
                          JSON.stringify(item),
                        )
                        event.dataTransfer.effectAllowed = 'move'
                        const tile = event.currentTarget.querySelector('.icon-tile')
                        if (tile instanceof HTMLElement) {
                          event.dataTransfer.setDragImage(tile, 16, 16)
                        }
                        onDragItem(item)
                      }}
                      onDragEnd={() => {
                        window.setTimeout(() => {
                          dragging.current = false
                        }, 0)
                      }}
                    >
                      <IconTile id={item.id} color={item.color} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
        {grouped.length === 0 ? (
          <p className="empty-search">Nenhum componente com esse nome.</p>
        ) : null}
      </div>
    </aside>
  )
}

import type { Theme } from '../prefs'

type ToolbarProps = {
  nodeCount: number
  edgeCount: number
  theme: Theme
  onFit: () => void
  onClear: () => void
  onExport: () => void
  onImport: (file: File) => void
  onToggleTheme: () => void
  onFont: (direction: 'up' | 'down') => void
}

export function Toolbar({
  nodeCount,
  edgeCount,
  theme,
  onFit,
  onClear,
  onExport,
  onImport,
  onToggleTheme,
  onFont,
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
        </span>
        <div>
          <strong>MIND</strong>
          <small>Arquitetura por arrastar</small>
        </div>
      </div>

      <p className="toolbar-meta">
        {nodeCount} componentes · {edgeCount} links
      </p>

      <div className="toolbar-actions">
        <div className="toolbar-look">
          <button type="button" onClick={() => onFont('down')} title="Diminuir fonte">
            A-
          </button>
          <button type="button" onClick={() => onFont('up')} title="Aumentar fonte">
            A+
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Usar tema escuro' : 'Usar tema claro'}
          >
            {theme === 'light' ? 'Escuro' : 'Claro'}
          </button>
        </div>
        <button type="button" onClick={onFit}>
          Enquadrar
        </button>
        <label className="file-btn">
          Importar
          <input
            type="file"
            accept="application/json"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onImport(file)
              event.target.value = ''
            }}
          />
        </label>
        <button type="button" onClick={onExport}>
          Exportar JSON
        </button>
        <button type="button" className="ghost" onClick={onClear}>
          Limpar
        </button>
      </div>
    </header>
  )
}

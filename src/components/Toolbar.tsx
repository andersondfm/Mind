import type { Theme } from '../prefs'

type ToolbarProps = {
  nodeCount: number
  edgeCount: number
  theme: Theme
  onFit: () => void
  onClear: () => void
  onExport: () => void
  onExportPdf: () => void
  onImport: (file: File) => void
  onToggleTheme: () => void
  onFont: (direction: 'up' | 'down') => void
  exportingPdf?: boolean
}

export function Toolbar({
  nodeCount,
  edgeCount,
  theme,
  onFit,
  onClear,
  onExport,
  onExportPdf,
  onImport,
  onToggleTheme,
  onFont,
  exportingPdf = false,
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
          <button type="button" onClick={() => onFont('down')} title="Diminuir fonte das caixas">
            A-
          </button>
          <button type="button" onClick={() => onFont('up')} title="Aumentar fonte das caixas">
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
        <button type="button" onClick={onExportPdf} disabled={exportingPdf}>
          {exportingPdf ? 'Gerando PDF…' : 'Exportar PDF'}
        </button>
        <button type="button" className="ghost" onClick={onClear}>
          Limpar
        </button>
      </div>
    </header>
  )
}

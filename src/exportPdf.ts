import { getNodesBounds, getViewportForBounds, type Node } from '@xyflow/react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import type { ArchNodeData } from './types'

const MAX_SIDE = 3600
const PX_TO_MM = 25.4 / 96

type StyleBackup = {
  el: Element
  fillAttr: string | null
  fillStyle: string
}

/** html-to-image não resolve var() em SVG — grava fill concreto antes de capturar. */
function bakeEdgeLabelFills(): () => void {
  const text =
    getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e8edf5'
  const board =
    getComputedStyle(document.documentElement).getPropertyValue('--board').trim() || '#10141c'

  const backups: StyleBackup[] = []

  const paint = (selector: string, color: string) => {
    document.querySelectorAll(selector).forEach((el) => {
      const styled = el as HTMLElement | SVGElement
      backups.push({
        el,
        fillAttr: el.getAttribute('fill'),
        fillStyle: styled.style.fill,
      })
      el.setAttribute('fill', color)
      styled.style.fill = color
    })
  }

  paint('.react-flow__edge-text', text)
  paint('.react-flow__edge-textbg', board)

  return () => {
    for (const item of backups) {
      const styled = item.el as HTMLElement | SVGElement
      if (item.fillAttr === null) item.el.removeAttribute('fill')
      else item.el.setAttribute('fill', item.fillAttr)
      styled.style.fill = item.fillStyle
    }
  }
}

export async function downloadPdf(nodes: Node<ArchNodeData>[]) {
  if (nodes.length === 0) {
    window.alert('Não há componentes na lousa para exportar.')
    return
  }

  const viewportEl = document.querySelector('.react-flow__viewport')
  if (!(viewportEl instanceof HTMLElement)) {
    window.alert('Não foi possível capturar a lousa.')
    return
  }

  const bounds = getNodesBounds(nodes)
  const width = Math.max(960, Math.ceil(bounds.width + 180))
  const height = Math.max(540, Math.ceil(bounds.height + 180))
  const fit = Math.min(1, MAX_SIDE / width, MAX_SIDE / height)
  const imageWidth = Math.round(width * fit)
  const imageHeight = Math.round(height * fit)
  const viewport = getViewportForBounds(bounds, imageWidth, imageHeight, 0.1, 2, 0.12)
  const board =
    getComputedStyle(document.documentElement).getPropertyValue('--board').trim() || '#10141c'

  const restore = bakeEdgeLabelFills()
  try {
    // espera um frame para o DOM aplicar o fill inline
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    const dataUrl = await toPng(viewportEl, {
      backgroundColor: board,
      width: imageWidth,
      height: imageHeight,
      pixelRatio: 2,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    })

    const pageW = imageWidth * PX_TO_MM
    const pageH = imageHeight * PX_TO_MM
    const pdf = new jsPDF({
      orientation: pageW >= pageH ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pageW, pageH],
    })
    pdf.addImage(dataUrl, 'PNG', 0, 0, pageW, pageH)
    pdf.save(`mind-arquitetura-${new Date().toISOString().slice(0, 10)}.pdf`)
  } finally {
    restore()
  }
}

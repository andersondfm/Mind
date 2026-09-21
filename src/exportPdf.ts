import { getNodesBounds, getViewportForBounds, type Node } from '@xyflow/react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import type { ArchNodeData } from './types'

const MAX_SIDE = 3600
const PX_TO_MM = 25.4 / 96

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
}

export function contrastText(hex: string) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  const luma = (r * 299 + g * 587 + b * 114) / 1000
  return luma > 160 ? '#141820' : '#f7f9fc'
}

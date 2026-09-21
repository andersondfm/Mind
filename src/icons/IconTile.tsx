import { TechIcon, iconTileStyle } from './TechIcon'

type IconTileProps = {
  id: string
  color: string
  size?: 'sm' | 'md'
}

export function IconTile({ id, color, size = 'sm' }: IconTileProps) {
  const { bg } = iconTileStyle(color)
  const iconSize = size === 'md' ? 22 : 16

  return (
    <span
      className={`icon-tile icon-tile-${size}`}
      style={{ background: bg }}
    >
      <TechIcon id={id} color={color} size={iconSize} />
    </span>
  )
}

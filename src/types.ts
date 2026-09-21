export type CategoryId =
  | 'architecture'
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'servers'
  | 'aws'
  | 'azure'
  | 'devops'

export type BoxStatus = 'none' | 'done' | 'wip' | 'debt'

export const BOX_STATUSES: {
  id: BoxStatus
  label: string
  color: string
}[] = [
  { id: 'none', label: 'Sem cor', color: '#5d6778' },
  { id: 'done', label: 'Feito', color: '#3dd68c' },
  { id: 'wip', label: 'Em desenvolvimento', color: '#e8c547' },
  { id: 'debt', label: 'Débito técnico', color: '#e35d6a' },
]

export type CatalogItem = {
  id: string
  name: string
  category: CategoryId
  color: string
  initials: string
}

export type ArchNodeData = {
  catalogId: string
  label: string
  note: string
  color: string
  initials: string
  category: CategoryId
  status?: BoxStatus
}

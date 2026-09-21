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
}

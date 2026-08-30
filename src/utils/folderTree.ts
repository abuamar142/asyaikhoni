export type Folder = { id?: number, name: string, parent_id: number|null }

export function hasChildren(id: number, folders: Folder[]): boolean {
  return folders.some((f) => (f.parent_id ?? null) === id)
}

export function getFolderDepth(id: number, folders: Folder[]): number {
  const folder = folders.find((f) => f.id === id)
  if (!folder) return 0
  let depth = 0
  let curId: number | null = folder.parent_id ?? null
  const visited = new Set<number>()
  while (curId != null && !visited.has(curId)) {
    visited.add(curId)
    const parent = folders.find((f) => f.id === curId)
    if (!parent) break
    depth += 1
    curId = parent.parent_id ?? null
    if (depth > 20) break
  }
  return depth
}

export function getFolderPath(folder: Folder, folders: Folder[]): string {
  const parts: string[] = []
  let cur: Folder | undefined = folder
  const visited = new Set<number>()
  while (cur && cur.id != null && !visited.has(cur.id)) {
    visited.add(cur.id)
    parts.unshift(cur.name)
    if (cur.parent_id == null) break
    const pid: number | null = cur.parent_id
    cur = folders.find((f) => f.id === pid)
    if (parts.length > 20) break
  }
  return parts.join(' / ')
}

export function buildBreadcrumb(id: number|null, folders: Folder[]): Folder[] {
  if (id == null) return []
  const path: Folder[] = []
  let curId: number | null = id
  const visited = new Set<number>()
  while (curId != null && !visited.has(curId)) {
    visited.add(curId)
    const folder = folders.find((f) => f.id === curId)
    if (!folder) break
    path.unshift(folder)
    curId = folder.parent_id ?? null
    if (path.length > 20) break
  }
  return path
}

export function collectDescendants(rootId: number, folders: Folder[]): number[] {
  const result: number[] = []
  const visited = new Set<number>()
  const queue: number[] = [rootId]
  visited.add(rootId)
  let idx = 0
  while (idx < queue.length) {
    const cur = queue[idx++]
    result.push(cur)
    for (const f of folders) {
      if (f.id == null) continue
      if ((f.parent_id ?? null) === cur && !visited.has(f.id)) {
        visited.add(f.id)
        queue.push(f.id)
      }
    }
    if (result.length > 1000) break
  }
  return result
}

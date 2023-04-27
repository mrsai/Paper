export type IExt = '.rt' | '.md'

export type IType = 'Folder' | 'File'

export interface IDirectoryItem {
  pid: string | undefined
  id: string
  name: string
  path: string
  type: IType
  children?: IDirectoryItem[]
  updateAt: string
  origin: boolean
  isEditing: boolean
  isExpanded?: boolean
  isSaved: boolean
  isTemporary: boolean
  ext?: IExt
  icon?: string[]
  expIcon?: string[]
}

export type IFile = Omit<IDirectoryItem, 'children' | 'isExpanded'>

export type IFolder = Omit<IDirectoryItem, 'pid' | 'ext' | 'isSaved'>

export interface IDirectory {
  list: IDirectoryItem[] | undefined
  isSaved: boolean
  selectedKey: string | undefined | number
  expandedKey: string[] | number[]
  temporary?: IDirectoryItem | undefined
}

export enum ETypes {
  // eslint-disable-next-line no-unused-vars
  Folder = 'Folder',
  // eslint-disable-next-line no-unused-vars
  File = 'File'
}

export enum EExt {
  // eslint-disable-next-line no-unused-vars
  MarkDown = '.md',
  // eslint-disable-next-line no-unused-vars
  RichText = '.rt'
}

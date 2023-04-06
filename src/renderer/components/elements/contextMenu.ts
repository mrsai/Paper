import { h } from 'vue'
import { ETypes } from '@/renderer/types/sidebar'
// ⌘（command）
// ⌥（option）
// ⇧（shift）
// ⇪（caps lock）
// ⌃（control）
// ↩（return）
// ⌅（enter）
export const sidebarContextmenu = (event: any, cb: any, type: any) => {
  let filters: any = []
  // 不同的点击目标，显示不同的菜单
  if (type === ETypes.Folder) {
    filters = ['createFolder']
  } else if (type === ETypes.File) {
    filters = ['createMarkdown', 'createRichText', 'createFolder']
  } else {
    filters = ['rename', 'sync', 'extractTranslate', 'generateBlog', 'delete']
  }
  const defaultMenu = {
    theme: 'mac',
    x: event.x,
    y: event.y,
    zIndex: 3,
    items: [
      {
        key: 'createMarkdown',
        label: '新建Markdown',
        icon: 'el-icon-edit',
        onClick: cb.createMarkdown
      },
      {
        key: 'createRichText',
        label: '新建富文档',
        icon: 'el-icon-edit',
        onClick: cb.createRichText
      },
      {
        key: 'createFolder',
        label: '新建文件夹',
        icon: 'el-icon-edit',
        onClick: cb.createFolder
      },
      {
        key: 'rename',
        label: '重命名',
        icon: 'el-icon-edit',
        onClick: cb.rename
      },
      {
        key: 'sync',
        label: '同步',
        icon: 'el-icon-edit',
        onClick: cb.sync
      },
      {
        key: 'extractTranslate',
        label: '抽取翻译',
        icon: 'el-icon-edit',
        onClick: cb.extractTranslate
      },
      {
        key: 'generateBlog',
        label: '生成博客',
        icon: 'el-icon-edit',
        onClick: cb.generateBlog
      },
      {
        key: 'delete',
        label: h('div', { style: 'font-size:14px' }, [
          h('span', '删除'),
          h('span', { style: 'color: #999' }, '⌘N')
        ]),
        onClick: cb.delete
      }
    ]
  }

  const items = defaultMenu.items.filter((item: any) => !filters.includes(item.key))
  const options = { ...defaultMenu, items }
  return options
}

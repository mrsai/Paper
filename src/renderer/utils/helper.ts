/**
 * 帮助通信的一些工具函数
 */
import { ElMessageBox } from 'element-plus'
export const isString = (val: unknown): boolean => {
  return typeof val === 'string'
}

/**
 * tips to save
 */
export function tipsToSave(confirm: any, cancel: any) {
  ElMessageBox.confirm('是否保存文件?', '提示', {
    confirmButtonText: '选择保存目录',
    cancelButtonText: '不保存',
    type: 'warning'
  })
    .then(confirm)
    .catch((action) => {
      if(action === 'cancel') {
        cancel()
      }
    })
}

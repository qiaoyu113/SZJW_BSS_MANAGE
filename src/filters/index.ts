// Set utils function parseTime to filter
import store from '@/store'
export { parseTime, Timestamp, TimestampYMD, DataIsNull } from '@/utils'

// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const hidePhone = (cellValue:string) => {
  if (Number(cellValue) && String(cellValue).length === 11) {
    let mobile = String(cellValue)
    let reg = /^(\d{3})\d{4}(\d{4})$/
    return mobile.replace(reg, '$1****$2')
  } else {
    return cellValue
  }
}
export function isPermission(this:any, value:Array<any>) {
  let roles = store.state.user.roles
  if (value && value instanceof Array && value.length > 0) {
    let values = value.filter(item => {
      if (item.pUrl) {
        return item.pUrl.some((sub:string) => {
          return roles.includes(sub)
        })
      }
      return item
    })
    return values
  } else {
    return []
  }
}

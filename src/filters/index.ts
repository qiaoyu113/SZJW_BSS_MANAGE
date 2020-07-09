// Set utils function parseTime to filter
export { parseTime, Timestamp, DataIsNull } from '@/utils'

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

const endTime = 1000 * 60 * 60 * 24 - 1
const startTime = 1000 * 60 * 60 * 24
export const today = {
  text: '今天',
  onClick(picker: any) {
    const date = new Date().setHours(0, 0, 0, 0)
    const start = +date
    const end = +date + endTime
    picker.$emit('pick', [start, end])
  }
}
export const yesterday = {
  text: '昨天',
  onClick(picker: any) {
    const date = new Date().setHours(0, 0, 0, 0)
    const start = +date - startTime
    const end = +date - startTime + endTime
    picker.$emit('pick', [start, end])
  }
}
export const threeday = {
  text: '三天前',
  onClick(picker: any) {
    const date = new Date().setHours(0, 0, 0, 0)
    const start = +date - startTime * 3
    const end = +date + endTime
    picker.$emit('pick', [start, end])
  }
}
export const sevenday = {
  text: '七天前',
  onClick(picker: any) {
    const date = new Date().setHours(0, 0, 0, 0)
    const start = +date - startTime * 7
    const end = +date + endTime
    picker.$emit('pick', [start, end])
  }
}
export const month = {
  text: '本月',
  onClick(picker: any) {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const start = +new Date(y, m)
    const end = +new Date(y, m + 1) - 1
    picker.$emit('pick', [start, end])
  }
}
export const lastmonth = {
  text: '上月',
  onClick(picker: any) {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const start = +new Date(y, m - 1)
    const end = +new Date(y, m) - 1
    picker.$emit('pick', [start, end])
  }
}
export const threemonth = {
  text: '近三月',
  onClick(picker: any) {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()
    const start = +new Date(y, m - 3, d)
    const end = +new Date(y, m, d) + endTime
    picker.$emit('pick', [start, end])
  }
}

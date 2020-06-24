import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const tokenKey = 'token'
// export class User {
//     token: string
//     busiPermission: string[]
//     hash: string
//     query: Dictionary<string | (string | null)[]>
//     params: Dictionary<string>
//     fullPath: string
//     matched: RouteRecord[]
//     redirectedFrom?: string
//     meta?: any
// }
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const setUser = (user: any) => {
  localStorage.setItem(tokenKey, user.token)
  localStorage.setItem('role', user.busiPermission)
  localStorage.setItem('permission', user.stringPermissions)
  localStorage.setItem('bssLoginName', user.bssLoginName)
}
export const removeToken = () => Cookies.remove(tokenKey)

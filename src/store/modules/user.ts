import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken, setUser } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async Login(userInfo: { username: string, password: string}) {
    let { username, password } = userInfo
    username = username.trim()
    const { data } = await login({ username, password })
    setToken(data.data.token)
    setUser(data.data)
    let roleName = ''
    data.data.busiPermission.forEach((Item:any) => {
      if (Item === '0') roleName = '梧桐专车 '
      if (Item === '1') roleName = roleName + ' 梧桐共享'
    })
    this.SET_EMAIL(roleName)
    this.SET_TOKEN(data.data.token)
    this.SET_NAME(data.data.bssLoginName)
    this.SET_ROLES(['admin'])
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    this.SET_ROLES(['admin'])
    this.SET_AVATAR('https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/02c52c498d874ecfbca3685d4d1d6fd0')
    let roleName = ''
    let bssLoginName = (localStorage.getItem('bssLoginName') as any)
    let busiPermission = (localStorage.getItem('role') as any).split(',')
    busiPermission.forEach((Item:any) => {
      if (Item === '0') roleName = '梧桐专车 '
      if (Item === '1') roleName = roleName + ' 梧桐共享'
    })
    this.SET_EMAIL(roleName)
    this.SET_NAME(bssLoginName)
    // const { data } = await getUserInfo({ /* Your params here */ })
    // if (!data) {
    //   throw Error('Verification failed, please Login again.')
    // }
    // const { roles, name, avatar, introduction, email } = data.user
    // // roles must be a non-empty array
    // this.SET_ROLES(roles)
    // this.SET_NAME(name)
    // this.SET_AVATAR(avatar)
    // this.SET_INTRODUCTION(introduction)
    // this.SET_EMAIL(email)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    // if (this.token === '') {
    //   throw Error('LogOut: token is undefined!')
    // }
    // await logout()
    removeToken()
    resetRouter()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)

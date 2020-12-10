import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = Base url + request url
  timeout: 8000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['Authorization'] = UserModule.token
      config.headers['uuid'] = UserModule.uuid
      config.headers['platform'] = 1
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // let versions = localStorage.getItem('versions')
    // if (versions !== store.getters.version) {
    //   res.code = 40101
    // }
    if (res.errorCode) {
      res.message = res.errorMsg || '接口错误' + res.errorCode + ',请联系技术人员。'
    }
    if (res.code === 401 || res.code === 402 || res.code === 406 || res.code === 407 || res.code === 408) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 401    权限不足, 请登录
      // 402    登陆超时,请重新登陆
      // 406    您的信息被修改，请重新登录
      // 407   您的账号被其他人登录，请重新登录
      // 408   登陆状态已过期，请重新登录
      // 请自行在引入 MessageBox
      MessageBox.confirm('您无权访问该功能，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UserModule.ResetToken()
        location.reload()
      })
      // }
      return Promise.reject(res.message)
    } else {
      return response
    }
  },
  (error) => {
    if (error.message === 'timeout of 8000ms exceeded') {
      error.message = '网络连接超时'
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

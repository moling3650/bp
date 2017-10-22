import axios from 'axios'

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  console.error(error)
  return Promise.reject(error)
})

const ajax = config => axios(config)

export default ajax

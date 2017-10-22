import axios from 'axios'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  console.error(error)
  return Promise.reject(error)
})

const ajax = function (api, data = null) {
  if (!/^(get|post|put|delete) .+?$/i.test(api)) {
    return Promise.reject(new Error('api must be "[get|post|put|delete] model"'))
  }
  let [method, model] = api.split(/[ -_]+/, 2)
  if (!model.endsWith('s')) {
    model += 's'
  }

  const config = {
    method,
    url: `/api/${model}${(data && data.id) ? ('/' + data.id) : ''}`,
    params: /^get$/i.test(method) ? data : null,
    data: /^get$/i.test(method) ? null : data
  }

  return axios(config)
}

export default ajax

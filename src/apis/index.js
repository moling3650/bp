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
  response.errno = !response.data.IsTrue
  response.sqlMessage = response.data.MessageStr
  let data = response.data.ReturnValue ? JSON.parse(response.data.ReturnValue) : []
  if (Array.isArray(data)) {
    data.map(item => {
      delete item.$id
      delete item.EntityKey
    })
  } else if (data) {
    delete data.$id
    delete data.EntityKey
  }
  response.data = data
  return response
}, function (error) {
  // 对响应错误做点什么
  console.error(error)
  return Promise.reject(error)
})

const SpcMap = {
  project: 'XJBLL.ProjectBLL',
  building: 'XJBLL.BuildingBLL',
  buildingUnit: 'XJBLL.BuildUnitBLL',
  upper: 'XJBLL.UpperMonitorBLL',
  monitor: 'XJBLL.MonitorBLL',
  point: 'XJBLL.PointBLL'
}

const ajax = function (api, data = null) {
  if (!/^(get|post|put|delete) .+?$/i.test(api)) {
    return Promise.reject(new Error('api must be "[get|post|put|delete] model"'))
  }
  let [method, model] = api.split(' ')
  console.log('method: ', method, ' | model: ', model)

  let params = {
    spc: SpcMap[model.endsWith('s') ? model.substr(0, model.length - 1) : model]
  }
  if (api === 'get uppers by projectCode') {
    params.api = 'GetByProjectCode'
  } else if (api.endsWith('code')) {
    params.api = 'GetByCode'
  } else if (method === 'get' && model.endsWith('s')) {
    params.api = 'GetALL'
  } else if (method === 'get' && ~Object.keys(SpcMap).indexOf(model)) {
    params.api = 'GetByID'
  } else if (method === 'post') {
    params.api = 'Add'
    delete data.id
    data.create_date = new Date().toJSON()
  } else if (method === 'put') {
    params.api = 'Update'
  } else if (method === 'delete') {
    params.api = 'Delete'
  }

  if (data) {
    params.param = (typeof data === 'string') ? data : JSON.stringify(data)
  }
  console.log(params)
  method = 'get'
  const config = {
    method,
    url: '/ExecServerAPI.ashx',
    params
  }

  return axios(config)
}

export default ajax

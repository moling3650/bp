import ajax from '@/apis'

const TypeMap = {
  project: '项目',
  building: '建筑',
  buildingUnit: '建筑单元',
  upper: '上位机',
  monitor: 'LORA'
}

const codeValidator = (type, value, callback) => {
  if (!value) {
    return callback(new Error(`请输入${TypeMap[type]}代码`))
  }
  if (!/\w{4,16}$/.test(value)) {
    return callback(new Error('请输入4至16位的英文、数字或下划线'))
  }
  let params = {}
  params[`${type}Code`] = value
  ajax(`get ${type}`, params).then(res => {
    if (res.data.length) {
      throw new Error(`${TypeMap[type]}代码已占用`)
    }
    callback()
  }).catch(err => callback(err))
}

export {
  codeValidator
}

import ajax from '@/apis'

const TypeMap = {
  project: '项目',
  building: '建筑',
  upper: '上位机',
  monitor: 'LORA'
}

const codeValidator = (type, value, callback) => {
  if (!value) {
    return callback(new Error(`请输入${TypeMap[type]}代码`))
  }
  if (!/[\w-]{4,32}$/.test(value)) {
    return callback(new Error('请输入4至32位的英文、数字或中下划线'))
  }

  ajax(`get ${type} by code`, value).then(res => {
    console.log('codeValidator', res)
    if (!res.errno) {
      throw new Error(`${TypeMap[type]}代码已占用`)
    }
    callback()
  }).catch(err => callback(err))
}

export {
  codeValidator
}

<template>
  <div class="monitors-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="LORA代码" prop="monitor_code">
        <el-input v-model="form.monitor_code" :disabled="type !== 'create'"/>
      </el-form-item>

      <el-form-item label="LORA名称" prop="monitor_name">
        <el-input v-model="form.monitor_name" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="项目/上位机" prop="codes">
        <el-cascader
          :options="projects"
          v-model="form.codes"
          @active-item-change="projectChange"
          :disabled="type === 'view'"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="端口名称" prop="port_name">
        <el-input v-model="form.port_name" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="端口" prop="baud_rate">
        <el-input v-model="form.baud_rate" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="停止位" prop="stop_bit">
        <el-input v-model="form.stop_bit" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="奇偶校验" prop="parity_check" required>
        <el-switch v-model="form.parity_check" :on-value="1" :off-value="0" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="通道数量" prop="channel_count">
        <el-input v-model="form.channel_count" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item v-if="type !== 'view'">
        <el-button type="primary" @click="onSubmit">{{ id ? '保存' : '新建'}}</el-button>
        <el-button @click="reset(false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import axios from 'axios'

  export default {
    name: 'monitorsForm',
    props: {
      type: {
        type: String
      },
      id: {
        type: [String, Number]
      }
    },
    data () {
      return {
        projects: [],
        form: {
          id: '',
          monitor_code: '',
          monitor_name: '',
          codes: [],
          port_name: '',
          baud_rate: 0,
          stop_bit: 0,
          parity_check: 0,
          channel_count: 0,
          remark: ''
        },
        rules: {
          monitor_code: [{ required: true, message: '请输入LORA代码', trigger: 'blur' }],
          monitor_name: [{ required: true, message: '请输入LORA名称', trigger: 'blur' }]
          // codes: [{ required: true, message: '请选择项目/上位机', trigger: 'blur' }],
          // port_name: [{ required: true, message: '请输入端口名称', trigger: 'blur' }],
          // baud_rate: [{ required: true, type: 'number', message: '请输入端口', trigger: 'blur' }],
          // stop_bit: [{ required: true, type: 'number', message: '请输入停止位', trigger: 'blur' }],
          // channel_count: [{ required: true, type: 'number', message: '请输入通道数量', trigger: 'blur' }]
        }
      }
    },
    watch: {
      id: function (val, oldVal) {
        val && this.init(val)
      }
    },
    methods: {
      reset (flag) {
        this.form.id = ''
        this.$emit('close', flag, this.type)
        this.$refs.form.resetFields()
      },
      fetchProjects () {
        ajax('get projects').then(res => {
          this.projects = res.data.map(item => {
            return { label: item.project_name, value: item.project_code, children: [] }
          })
        })
      },
      fetchUppers (projectCode) {
        axios.get(`/api/projects/${projectCode}/uppers`).then(res => {
          const index = this.projects.findIndex(p => p.value === projectCode)
          if (~index) {
            this.projects[index].children = res.data
            this.form.codes.push(this.form.upper_code)
          }
        })
      },
      projectChange (codes) {
        this.fetchUppers(codes[0])
      },
      fetchMonitor (id) {
        ajax('get monitor', { id }).then(res => {
          if (res.data) {
            delete res.data.id
            this.form = Object.assign({}, res.data, {codes: []})
            this.form.codes.push(this.form.project_code)
            this.fetchUppers(this.form.project_code)
          }
        })
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let formData = Object.assign({}, this.form, { id: this.id })
            formData.project_code = formData.codes[0]
            formData.upper_code = formData.codes[1]
            delete formData.codes
            const api = (this.type === 'create') ? 'post monitor' : 'put monitor'
            ajax(api, formData).then(res => {
              res.errno && console.log(res.sqlMessage)
              this.reset(!res.errno)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      init (monitorId) {
        this.fetchProjects()
        monitorId && this.fetchMonitor(monitorId)
      }
    },
    mounted () {
      this.init(this.id)
    }
  }
</script>

<style lang="css" scoped>
</style>

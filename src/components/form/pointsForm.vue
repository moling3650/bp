<template>
  <div class="points-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">

      <el-form-item label="通道序号" prop="channel_index">
        <el-select v-model="form.channel_index" placeholder="请选择通道序号">
          <el-option
            v-for="index in 8"
            :key="index"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="LORA/监测单元" prop="codes">
        <el-cascader
          :options="monitors"
          v-model="form.codes"
          @active-item-change="monitorChange"
          :disabled="type === 'view'"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="信号类型" prop="signal_type">
        <el-select v-model="form.signal_type" placeholder="请选择信号类型">
          <el-option
            v-for="(item, index) in ['正弦', '热敏', '0~5V', '4~20MA']"
            :key="index"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上限" prop="upper_limit">
        <el-input v-model="form.upper_limit" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="下限" prop="lower_limit">
        <el-input v-model="form.lower_limit" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="状态" prop="state" required>
        <el-switch v-model="form.state" :on-value="1" :off-value="0"/>
      </el-form-item>

      <el-form-item v-if="type !== 'view'">
        <el-button type="primary" @click="onSubmit">{{ id ? '保存' : '新建'}}</el-button>
        <el-button @click="$emit('close', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'pointsForm',
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
        monitors: [],
        form: {
          channel_index: 1,
          codes: [],
          signal_type: 0,
          lower_limit: 0,
          upper_limit: 0,
          state: 1
        },
        rules: {
          monitor_code: [{ required: true, message: '请输入LORA代码', trigger: 'blur' }],
          // lower_limit: [{ required: true, message: '请输入端口名称', trigger: 'blur' }],
          // upper_limit: [{ required: true, type: 'number', message: '请输入端口', trigger: 'blur' }],
          // stop_bit: [{ required: true, type: 'number', message: '请输入其他配置', trigger: 'blur' }],
          channel_count: [{ required: true, type: 'number', message: '请输入通道数量', trigger: 'blur' }]
        }
      }
    },
    watch: {
      id: function (val, oldVal) {
        this.$refs.form.resetFields()
        val && this.init(val)
      }
    },
    methods: {
      fetchmonitors () {
        axios.get('/api/monitors').then(res => {
          this.monitors = res.data.map(item => {
            return { label: item.monitor_name, value: item.monitor_code, children: [] }
          })
        }).catch(err => console.log(err))
      },
      fetchBuildingUnits (monitorCode) {
        axios.get(`/api/monitors/${monitorCode}/buildingunits`).then(res => {
          const index = this.monitors.findIndex(p => p.value === monitorCode)
          if (~index) {
            this.monitors[index].children = res.data
            this.form.codes.push(this.form.unit_id)
          }
        }).catch(err => console.log(err))
      },
      monitorChange (codes) {
        this.fetchBuildingUnits(codes[0])
      },
      fetchMonitor (id) {
        axios.get(`/api/points/${id}`).then(res => {
          if (res.data) {
            this.form = Object.assign({}, res.data, {codes: []})
            this.form.codes.push(this.form.monitor_code)
            this.fetchBuildingUnits(this.form.monitor_code)
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let formData = Object.assign({}, this.form)
            formData.monitor_code = formData.codes[0]
            formData.unit_id = formData.codes[1]
            delete formData.codes
            console.log(formData)
            axios({
              url: `/api/points/${this.id}`,
              method: this.type === 'create' ? 'post' : 'put',
              data: formData
            }).then(res => {
              this.$refs.form.resetFields()
              res.errno && console.log(res.sqlMessage)
              this.$emit('close', !res.errno)
            }).catch(err => console.log(err))
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      init (monitorId) {
        this.fetchmonitors()
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

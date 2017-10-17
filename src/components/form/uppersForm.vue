<template>
  <div class="uppers-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="上位机代码" prop="upper_code">
        <el-input v-model="form.upper_code" :disabled="type !== 'create'"/>
      </el-form-item>

      <el-form-item label="上位机名称" prop="upper_name">
        <el-input v-model="form.upper_name"/>
      </el-form-item>

      <el-form-item label="选择项目" prop="project_code">
        <el-select v-model="form.project_code" placeholder="请选择项目">
          <el-option
            v-for="project in projects"
            :key="project.code"
            :label="project.name"
            :value="project.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-switch v-model="form.state" :on-value="1" :off-value="0"/>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ id ? '保存' : '新建'}}</el-button>
        <el-button @click="$emit('close', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'uppersForm',
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
          upper_code: '',
          upper_name: '',
          project_code: '',
          state: 0,
          remark: ''
        },
        rules: {
          upper_code: [{ required: true, message: '请输入上位机代码', trigger: 'blur' }],
          upper_name: [{ required: true, message: '请输入上位机名称', trigger: 'blur' }],
          state: [{ required: true, type: 'number', message: '请选择类型', trigger: 'blur' }],
          project_code: [{ required: true, message: '请选择项目', trigger: 'change' }]
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
      fetchProjects () {
        axios.get('/api/projects').then(res => {
          this.projects = res.data.map(item => {
            return { name: item.project_name, code: item.project_code }
          })
          if (this.projects.length > 0) {
            this.form.project_code = this.projects[0].code
          }
        }).catch(err => console.log(err))
      },
      fetchUpper (id) {
        axios.get(`/api/uppers/${id}`).then(res => {
          if (res.data) {
            this.form = res.data
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios({
              url: `/api/uppers/${this.id}`,
              method: this.type === 'create' ? 'post' : 'put',
              data: this.form
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
      init (upperId) {
        this.fetchProjects()
        upperId && this.fetchUpper(upperId)
      }
    },
    mounted () {
      this.init(this.id)
    }
  }
</script>

<style lang="css" scoped>
</style>

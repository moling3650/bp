<template>
  <div class="projects-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="项目代码" prop="project_code">
        <el-input v-model="form.project_code" :disabled="type !== 'create'"/>
      </el-form-item>

      <el-form-item label="项目名称" prop="project_name">
        <el-input v-model="form.project_name"/>
      </el-form-item>

      <el-form-item label="省份" prop="province">
        <el-input v-model="form.province"/>
      </el-form-item>

      <el-form-item label="城市" prop="city">
        <el-input v-model="form.city"/>
      </el-form-item>

      <el-form-item label="项目负责人" prop="pm">
        <el-input v-model="form.pm"/>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone_no">
        <el-input v-model="form.phone_no"/>
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
    name: 'projectsForm',
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
        form: {
          project_code: '',
          project_name: '',
          province: '',
          city: '',
          pm: '',
          phone_no: '',
          remark: ''
        },
        rules: {
          project_code: [{ required: true, message: '请输入项目代码', trigger: 'blur' }],
          project_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
          province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
          city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
          pm: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
          phone_no: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
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
      fetchProject (projectId) {
        axios.get(`/api/projects/${projectId}`).then(res => {
          if (res.data) {
            this.form = res.data
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios({
              url: `/api/projects/${this.id}`,
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
      init (projectId) {
        projectId && this.fetchProject(projectId)
      }
    },
    mounted () {
      this.init(this.id)
    }
  }
</script>

<style lang="css" scoped>
</style>

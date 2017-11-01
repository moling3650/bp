<template>
  <div class="projects-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="项目代码" prop="project_code">
        <el-input v-model="form.project_code" :disabled="type !== 'create'"/>
      </el-form-item>

      <el-form-item label="项目名称" prop="project_name">
        <el-input v-model="form.project_name"/>
      </el-form-item>

      <el-form-item label="省份/城市" prop="address">
        <el-cascader
          :options="cities"
          v-model="address"
          :disabled="type === 'view'"
          @change="cityChanged"
        ></el-cascader>
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
        <el-button @click="reset(false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import { codeValidator } from '@/apis/validators'

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
      var checkProjectCode = (rule, value, callback) => {
        (this.type !== 'create') ? callback() : codeValidator('project', value, callback)
      }
      var checkAddress = (rule, value, callback) => {
        if (this.address[1]) {
          callback()
        } else {
          callback(new Error('请选择省份/城市'))
        }
      }
      return {
        cities: [],
        address: [],
        form: {
          id: '',
          project_code: '',
          project_name: '',
          province: '',
          city: '',
          pm: '',
          phone_no: '',
          remark: ''
        },
        rules: {
          project_code: [{ required: true, validator: checkProjectCode, trigger: 'blur' }],
          project_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
          address: [{ required: true, validator: checkAddress, message: '请选择省份/城市' }],
          pm: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
          phone_no: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
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
        this.address = []
        this.$emit('close', flag, this.type)
        this.$refs.form.resetFields()
      },
      cityChanged () {
        this.form.province = this.address[0]
        this.form.city = this.address[1]
      },
      fetchProject (id) {
        ajax('get project', id).then(res => {
          if (res.data) {
            this.form = res.data
            this.address = [this.form.province, this.form.city]
          }
        })
      },
      fetchCities () {
        ajax('get cities by tree').then(res => {
          this.cities = res.data
        })
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const api = this.type === 'create' ? 'post project' : 'put project'
            ajax(api, this.form).then(res => {
              res.errno && console.log(res.sqlMessage)
              this.reset(!res.errno)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      init (projectId) {
        this.fetchCities()
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

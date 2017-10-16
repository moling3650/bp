<template>
  <div class="projects-form">
    <el-form ref="form" :model="form" label-width="100px">
      <h1 class="title">{{ id ? '编辑' : '新建'}}项目表单</h1>
      <el-form-item label="项目代码">
        <el-input v-model="form.project_code"/>
      </el-form-item>

      <el-form-item label="项目名称">
        <el-input v-model="form.project_name"/>
      </el-form-item>

      <el-form-item label="省份">
        <el-input v-model="form.province"/>
      </el-form-item>

      <el-form-item label="城市">
        <el-input v-model="form.city"/>
      </el-form-item>

      <el-form-item label="项目负责人">
        <el-input v-model="form.pm"/>
      </el-form-item>

      <el-form-item label="手机号码">
        <el-input v-model="form.phone_no"/>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ id ? '保存' : '新建'}}</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'projectsForm',
    data () {
      return {
        id: parseInt(this.$route.params.id) || '',
        method: 'post',
        form: {
          project_code: '',
          project_name: '',
          province: '',
          city: '',
          pm: '',
          phone_no: '',
          remark: ''
        }
      }
    },
    methods: {
      fetchProject (id) {
        axios.get(`/api/projects/${id}`).then(res => {
          if (res.data) {
            this.method = 'put'
            this.form = res.data
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        axios({
          url: `/api/projects/${this.id}`,
          method: this.method,
          data: this.form
        }).then(res => {
          if (!res.errno) {
            this.$router.push({ name: 'Index' })
          } else {
            console.log(res.sqlMessage)
          }
        }).catch(err => console.log(err))
      }
    },
    mounted () {
      if (this.id) {
        this.fetchProject(this.id)
      }
    }
  }
</script>

<style lang="css" scoped>
  .projects-form {
    width: 992px;
    padding: 10px;
    margin: 0 auto;
  }

  .title {
    margin: 15px 0 10px 0;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
</style>

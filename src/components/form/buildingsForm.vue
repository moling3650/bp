<template>
  <div class="buildings-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="建筑代码" prop="building_code">
        <el-input v-model="form.building_code" :disabled="type !== 'create'"/>
      </el-form-item>

      <el-form-item label="建筑名称" prop="building_name">
        <el-input v-model="form.building_name"/>
      </el-form-item>

      <el-form-item v-if="!projectCode" label="项目名称" prop="project_code">
        <el-select v-model="form.project_code" placeholder="请选择项目">
          <el-option
            v-for="project in projects"
            :key="project.code"
            :label="project.name"
            :value="project.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="建筑类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择建筑类型">
          <el-option
            v-for="(item, index) in ['楼塔', '桥梁', '隧道', '堤坝']"
            :key="index"
            :label="item"
            :value="index + 1">
          </el-option>
        </el-select>
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
    name: 'buildingsForm',
    props: {
      type: {
        type: String
      },
      id: {
        type: [String, Number]
      },
      projectCode: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        projects: [],
        form: {
          building_code: '',
          building_name: '',
          project_code: '',
          type: 1,
          remark: ''
        },
        rules: {
          building_code: [{ required: true, message: '请输入建筑代码', trigger: 'blur' }],
          building_name: [{ required: true, message: '请输入建筑名称', trigger: 'blur' }],
          type: [{ required: true, type: 'number', message: '请选择建筑类型', trigger: 'change' }],
          project_code: [{ required: true, message: '请选择项目', trigger: 'change' }]
        }
      }
    },
    watch: {
      id: function (val, oldVal) {
        val && this.init(val)
      }
    },
    methods: {
      reset () {
        this.$refs.form.resetFields()
      },
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
      fetchBuilding (id) {
        axios.get(`/api/buildings/${id}`).then(res => {
          if (res.data) {
            this.form = res.data
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios({
              url: `/api/buildings/${this.id}`,
              method: this.type === 'create' ? 'post' : 'put',
              data: this.form
            }).then(res => {
              res.errno && console.log(res.sqlMessage)
              this.$emit('close', !res.errno, this.type, this.form.building_name)
            }).catch(err => console.log(err))
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      init (buildingId) {
        if (this.projectCode) {
          this.form.project_code = this.projectCode
        } else {
          this.fetchProjects()
        }
        buildingId && this.fetchBuilding(buildingId)
      }
    },
    mounted () {
      this.init(this.id)
    }
  }
</script>

<style lang="css" scoped>
</style>

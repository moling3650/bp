<template>
  <div class="buildings">
    <h1 class="title">所有建筑</h1>
    <p class="btn-add">
      <el-select v-model="project_code" placeholder="请选择项目">
        <el-option
          v-for="project in projects"
          :key="project.code"
          :label="project.name"
          :value="project.code">
        </el-option>
      </el-select>
      <el-button type="success" icon="plus"
        @click="$router.push('/editor/buildings/new')">添加建筑</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="建筑代码" prop="building_code"/>
      <el-table-column align="center" label="建筑名称" prop="building_name"/>
      <el-table-column align="center" label="所属项目" prop="project_code"/>
      <el-table-column align="center" label="建筑类型" prop="type"/>
      <el-table-column align="center" label="创建时间" prop="create_date" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="$router.push(`/editor/buildings/${scope.row.id}`)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Buildings',
    data () {
      return {
        projects: [],
        project_code: '',
        tableData: []
      }
    },
    methods: {
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(`/api/buildings/${id}`).then(res => {
            this.fetchTableData()
            this.$message({ type: 'success', message: '删除成功!' })
          }).catch(err => console.log(err))
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        axios.get('/api/buildings').then(res => {
          this.tableData = res.data
        }).catch(err => console.log(err))
      },
      fetchProjectsData () {
        axios.get('/api/projects').then(res => {
          this.projects = res.data.map(item => {
            return { name: item.project_name, code: item.project_code }
          })
          if (this.projects.length) {
            this.project_code = this.projects[0].code
          } else {
            this.$confirm('没有查询到项目,将跳转新建项目页面', '提示', {
              type: 'warning'
            }).then(() => {
              this.$router.push('/editor/projects/new')
            }).catch(() => {
              this.$message({ type: 'error', message: '没有项目无法新建建筑' })
            })
          }
        }).catch(err => console.log(err))
      }
    },
    mounted () {
      this.fetchProjectsData()
    }
  }
</script>

<style lang="css" scoped>
  .title {
    margin: 15px 0 10px 0;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .btn-add {
    margin-bottom: 5px;
    text-align: right;
  }
</style>

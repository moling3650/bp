<template>
  <div class="index">
    <el-menu theme="dark" default-active="1" mode="horizontal">
      <el-menu-item index="1">项目管理</el-menu-item>
      <el-menu-item index="1">建筑管理</el-menu-item>
      <el-menu-item index="2">订单管理</el-menu-item>
    </el-menu>

    <h1 class="title">所有项目</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="$router.push('/editor/projects/new')">添加项目</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="项目代码" prop="project_code"/>
      <el-table-column align="center" label="项目名称" prop="project_name"/>
      <el-table-column align="center" label="省份" width="70" prop="province"/>
      <el-table-column align="center" label="城市" width="70" prop="city"/>
      <el-table-column align="center" label="项目负责人" prop="pm"/>
      <el-table-column align="center" label="手机号码" prop="phone_no"/>
      <el-table-column align="center" label="创建时间" prop="create_date" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="$router.push(`/editor/projects/${scope.row.id}`)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Index',
    data () {
      return {
        tableData: []
      }
    },
    methods: {
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      handleDelete (id) {
        axios.delete(`/api/projects/${id}`).then(res => {
          this.fetchTableData()
        }).catch(err => console.log(err))
      },
      fetchTableData () {
        axios.get('/api/projects').then(res => {
          this.tableData = res.data
        }).catch(err => console.log(err))
      }
    },
    mounted () {
      this.fetchTableData()
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

<template>
  <div class="uppers">
    <h1 class="title">所有上位机</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="openDialog('create', '')">添加上位机</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="上位机代码" prop="building_code"/>
      <el-table-column align="center" label="上位机名称" prop="building_name"/>
      <el-table-column align="center" label="所属项目" prop="project_code"/>
      <el-table-column align="center" label="上位机类型" prop="type" :formatter="fmtType"/>
      <el-table-column align="center" label="创建时间" prop="create_date" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="上位机表单" :visible.sync="dialogFormVisible">
      <uppers-form :type="dialogFormType" :id="buildingId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import uppersForm from '@/components/form/uppersForm'

  export default {
    name: 'uppers',
    data () {
      return {
        dialogFormVisible: false,
        dialogFormType: 'create',
        buildingId: '',
        tableData: []
      }
    },
    components: {
      uppersForm
    },
    methods: {
      openDialog (type, buildingId) {
        this.dialogFormType = type
        this.buildingId = buildingId
        this.dialogFormVisible = true
      },
      closeDialog (flag) {
        if (flag) {
          this.fetchTableData()
          this.$message({ type: 'success', message: '编辑成功' })
        } else {
          this.$message({ type: 'info', message: '已取消编辑' })
        }
        this.buildingId = ''
        this.dialogFormVisible = false
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      fmtType (row, column, type) {
        return ['楼塔', '桥梁', '隧道', '堤坝'][type - 1]
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该上位机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(`/api/uppers/${id}`).then(res => {
            this.fetchTableData()
            this.$message({ type: 'success', message: '删除成功!' })
          }).catch(err => console.log(err))
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        axios.get('/api/uppers').then(res => {
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

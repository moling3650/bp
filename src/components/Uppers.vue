<template>
  <div class="uppers">
    <h1 class="title">所有上位机</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="openDialog('create', '')">添加上位机</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="上位机代码" prop="upper_code"/>
      <el-table-column align="center" label="上位机名称" prop="upper_name"/>
      <el-table-column align="center" label="所属项目" prop="project_code"/>
      <el-table-column align="center" label="状态" prop="state" :formatter="fmtState"/>
      <el-table-column align="center" label="创建时间" prop="create_date" width="160" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="上位机表单" :visible.sync="dialogFormVisible" :before-close="resetForm">
      <uppers-form ref="form" :type="dialogFormType" :id="buildingId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/apis'
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
      resetForm (done) {
        this.$refs.form.reset(false)
        done()
      },
      openDialog (type, buildingId) {
        this.dialogFormType = type
        this.buildingId = buildingId
        this.dialogFormVisible = true
      },
      closeDialog (flag, type) {
        const action = (type === 'create') ? '新建' : '编辑'
        if (flag) {
          this.fetchTableData()
          this.$message({ type: 'success', message: `${action}成功` })
        } else {
          this.$message({ type: 'info', message: `已取消${action}` })
        }
        this.buildingId = ''
        this.dialogFormVisible = false
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      fmtState (row, column, state) {
        return state ? '有效' : '无效'
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该上位机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => ajax('delete upper', id)
        ).then(res => {
          this.fetchTableData()
          this.$message({ type: 'success', message: '删除成功!' })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        ajax('get uppers').then(res => {
          this.tableData = res.data
        })
      }
    },
    mounted () {
      this.fetchTableData()
    }
  }
</script>

<style lang="css" scoped>
</style>

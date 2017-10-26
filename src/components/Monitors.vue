<template>
  <div class="monitors">
    <h1 class="title">所有LORA</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="openDialog('create', '')">添加LORA</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="LORA代码" prop="monitor_code"/>
      <el-table-column align="center" label="LORA名称" prop="monitor_name"/>
      <el-table-column align="center" label="所属项目" prop="project_code"/>
      <el-table-column align="center" label="所属上位机" prop="upper_code"/>
      <el-table-column align="center" label="端口名称" prop="port_name"/>
      <el-table-column align="center" label="端口" prop="baud_rate"/>
      <el-table-column align="center" label="停止位" prop="stop_bit"/>
      <el-table-column align="center" label="奇偶校验" prop="parity_check"/>
      <el-table-column align="center" label="通道数量" prop="channel_count"/>
      <el-table-column align="center" label="创建时间" prop="create_date" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="openDialog('view', scope.row.id)">查看</el-button>
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="LORA表单" :visible.sync="dialogFormVisible" top="5%" :before-close="resetForm">
      <monitors-form ref="form" :type="dialogFormType" :id="monitorId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import monitorsForm from '@/components/form/monitorsForm'

  export default {
    name: 'monitors',
    data () {
      return {
        dialogFormVisible: false,
        dialogFormType: 'create',
        monitorId: '',
        tableData: []
      }
    },
    components: {
      monitorsForm
    },
    methods: {
      resetForm (done) {
        this.$refs.form.reset(false)
        done()
      },
      openDialog (type, monitorId) {
        this.dialogFormType = type
        this.monitorId = monitorId
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
        this.monitorId = ''
        this.dialogFormVisible = false
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该LORA, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => ajax('delete monitor', id)
        ).then(res => {
          this.fetchTableData()
          this.$message({ type: 'success', message: '删除成功!' })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        ajax('get monitors').then(res => {
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

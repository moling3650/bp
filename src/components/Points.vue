<template>
  <div class="points">
    <h1 class="title">所有节点</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="openDialog('create', '')">添加节点</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="LORA代码" prop="monitor_code"/>
      <el-table-column align="center" label="监测单元" width="100" prop="unit_id"/>
      <el-table-column align="center" label="节点名称" width="100" prop="point_name"/>
      <el-table-column align="center" label="监测组" width="100" prop="group_name"/>
      <el-table-column align="center" label="通道序号" width="100" prop="channel_idx"/>
      <el-table-column align="center" label="信号类型" width="100" prop="signal_type" :formatter="fmtSignalType"/>
      <el-table-column align="center" label="上限" width="80" prop="upper_limit"/>
      <el-table-column align="center" label="下限" width="80" prop="lower_limit"/>
      <el-table-column align="center" label="状态" width="80" prop="state" :formatter="fmtState"/>
      <el-table-column align="center" label="创建时间" prop="create_date" width="160" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="small" @click="openDialog('view', scope.row.id)">查看</el-button>
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="节点表单" :visible.sync="dialogFormVisible" top="5%" :before-close="resetForm">
      <points-form ref="form" :type="dialogFormType" :id="monitorId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import pointsForm from '@/components/form/pointsForm'

  export default {
    name: 'points',
    data () {
      return {
        dialogFormVisible: false,
        dialogFormType: 'create',
        monitorId: '',
        tableData: []
      }
    },
    components: {
      pointsForm
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
      fmtSignalType (row, column, signalType) {
        return ['正弦', '热敏', '0~5V', '4~20MA'][signalType]
      },
      fmtState (row, column, state) {
        return ['关', '开'][state]
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => ajax('delete point', id)
        ).then(res => {
          this.fetchTableData()
          this.$message({ type: 'success', message: '删除成功!' })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        ajax('get points').then(res => {
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

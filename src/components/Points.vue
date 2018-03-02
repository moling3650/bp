<template>
  <div class="points">
    <h1 class="title">所有节点</h1>
    <p class="btn-add">
      <el-cascader :options="buildings" placeholder="请先选择建筑" @change="buildingChange"/>
      <el-button type="success" icon="plus" @click="openDialog('create', '')">添加节点</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="所属LORA" prop="monitor_name"/>
      <el-table-column align="center" label="所属建筑单元" prop="unit_name"/>
      <el-table-column align="center" label="监测组" prop="group_name"/>
      <el-table-column align="center" label="节点信息">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p class="popover-detail">节点ID: {{ scope.row.id }}</p>
            <p class="popover-detail">节点名称: {{ scope.row.point_name }}</p>
            <p class="popover-detail">通道序号: {{ scope.row.channel_idx }}</p>
            <p class="popover-detail">信号类型: {{ fmtSignalType(scope.row.signal_type) }}</p>
            <p class="popover-detail">上限: {{ scope.row.upper_limit }}</p>
            <p class="popover-detail">下限: {{ scope.row.lower_limit }}</p>
            <p class="popover-detail">状态: {{ fmtState(scope.row.state) }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ `${scope.row.id}: ${scope.row.point_name}` }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
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
        buildings: [],
        buildingCode: '',
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
          this.fetchTableData(this.buildingCode)
          this.$message({ showClose: true, type: 'success', message: `${action}成功` })
        } else {
          this.$message({ showClose: true, type: 'info', message: `已取消${action}` })
        }
        this.monitorId = ''
        this.dialogFormVisible = false
      },
      fmtSignalType (signalType) {
        return ['正弦', '热敏', '0~5V', '4~20MA'][signalType]
      },
      fmtState (state) {
        return ['关', '开'][state]
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      buildingChange (codes) {
        this.buildingCode = codes[1]
        this.fetchTableData(this.buildingCode)
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => ajax('delete point', id)
        ).then(res => {
          this.fetchTableData(this.buildingCode)
          this.$message({ showClose: true, type: 'success', message: '删除成功!' })
        }).catch(() => {
          this.$message({ showClose: true, type: 'info', message: '已取消删除' })
        })
      },
      fetchBuildings () {
        ajax('get buildings by tree').then(res => {
          this.buildings = res.data
        })
      },
      fetchTableData (buildingCode) {
        ajax('get points by buildingCode', buildingCode).then(res => {
          this.tableData = res.data
        })
      },
      init () {
        this.fetchBuildings()
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="css" scoped>
  .popover-detail {
    font-size: 16px;
    line-height: 1.5;
  }
</style>

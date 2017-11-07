<template>
  <div class="building-units">
    <h1 class="title">所有建筑单元</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="openDialog('create', '')">添加建筑单元</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="建筑单元名称" prop="unit_name"/>
      <el-table-column align="center" label="所属建筑" prop="building_name"/>
      <el-table-column align="center" label="创建时间" prop="create_date" width="160" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="small" @click="openDialog('view', scope.row.id)">查看</el-button>
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="建筑单元表单" :visible.sync="dialogFormVisible" :before-close="resetForm">
      <building-units-form ref="form" :type="dialogFormType" :id="unitId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import buildingUnitsForm from '@/components/form/buildingUnitsForm'

  export default {
    name: 'BuildingUnits',
    data () {
      return {
        dialogFormVisible: false,
        dialogFormType: 'create',
        unitId: '',
        tableData: []
      }
    },
    components: {
      buildingUnitsForm
    },
    methods: {
      resetForm (done) {
        this.$refs.form.reset(false)
        done()
      },
      openDialog (type, unitId) {
        this.dialogFormType = type
        this.unitId = unitId
        this.dialogFormVisible = true
      },
      closeDialog (flag, type) {
        const action = (type === 'create') ? '新建' : '编辑'
        if (flag) {
          this.fetchTableData()
          this.$message({ showClose: true, type: 'success', message: `${action}成功` })
        } else {
          this.$message({ showClose: true, type: 'info', message: `已取消${action}` })
        }
        this.unitId = ''
        this.dialogFormVisible = false
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该建筑单元, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => ajax('delete buildingUnit', id)
        ).then(res => {
          this.fetchTableData()
          this.$message({ showClose: true, type: 'success', message: '删除成功!' })
        }).catch(() => {
          this.$message({ showClose: true, type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        ajax('get buildingUnits').then(res => {
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

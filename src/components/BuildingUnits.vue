<template>
  <div class="building-units">
    <h1 class="title">所有建筑单元</h1>
    <p class="btn-add">
      <el-button type="success" icon="plus"
        @click="openDialog('create', '')">添加建筑单元</el-button>
    </p>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="建筑单元名称" prop="unit_name"/>
      <el-table-column align="center" label="所属建筑" prop="building_code"/>
      <el-table-column align="center" label="创建时间" prop="create_date" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="openDialog('view', scope.row.id)">查看</el-button>
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="建筑单元表单" :visible.sync="dialogFormVisible">
      <building-units-form :type="dialogFormType" :id="unitId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
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
      openDialog (type, unitId) {
        this.dialogFormType = type
        this.unitId = unitId
        this.dialogFormVisible = true
      },
      closeDialog (flag) {
        if (flag) {
          this.fetchTableData()
          this.$message({ type: 'success', message: '编辑成功' })
        } else {
          this.$message({ type: 'info', message: '已取消编辑' })
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
        }).then(() => {
          axios.delete(`/api/buildingunits/${id}`).then(res => {
            this.fetchTableData()
            this.$message({ type: 'success', message: '删除成功!' })
          }).catch(err => console.log(err))
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        axios.get('/api/buildingunits').then(res => {
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

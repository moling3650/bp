<template>
  <div class="index">
    <h1 class="title">所有项目</h1>
    <div class="button-group">
      <el-button-group>
        <el-button type="info" icon="setting" @click="$router.push('/manage/admin/buildings')">超级管理</el-button>
        <el-button type="success" icon="plus" @click="openDialog('create', '')">添加项目</el-button>
      </el-button-group>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="项目代码" prop="project_code"/>
      <el-table-column align="center" label="项目名称" prop="project_name"/>
      <el-table-column align="center" label="项目地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目负责人">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p class="popover-detail">姓名: {{ scope.row.pm }}</p>
            <p class="popover-detail">手机: {{ scope.row.phone_no }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.pm }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="create_date" width="160" :formatter="fmtDate"/>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="small" type="info" @click="$router.push(`/manage/${scope.row.id}/buildings`)">管理建筑</el-button>
          <el-button size="small" @click="openDialog('edit', scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="项目表单" :visible.sync="dialogFormVisible" :before-close="resetForm">
      <projects-form ref="form" :type="dialogFormType" :id="projectId" @close="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import projectsForm from '@/components/form/projectsForm'

  export default {
    name: 'Index',
    data () {
      return {
        dialogFormVisible: false,
        dialogFormType: 'create',
        projectId: null,
        tableData: []
      }
    },
    components: {
      projectsForm
    },
    methods: {
      resetForm (done) {
        this.$refs.form.reset(false)
        done()
      },
      openDialog (type, projectId) {
        this.dialogFormType = type
        this.projectId = projectId
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
        this.projectId = ''
        this.dialogFormVisible = false
      },
      fmtDate (row, column, dateStr) {
        return dateStr ? dateStr.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{2}:\d{2}).*/, '$1 $2') : ''
      },
      handleDelete (id) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => ajax('delete project', id)
        ).then(res => {
          this.fetchTableData()
          this.$message({ showClose: true, type: 'success', message: '删除成功' })
        }).catch(() => {
          this.$message({ showClose: true, type: 'info', message: '已取消删除' })
        })
      },
      fetchTableData () {
        ajax('get projects').then(res => {
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
  .popover-detail {
    font-size: 16px;
    line-height: 1.5;
  }
</style>

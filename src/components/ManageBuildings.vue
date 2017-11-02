<template>
  <div class="ManageBuildings">
    <h1 class="title">项目建筑管理</h1>
    <el-row>
      <el-col :span="8" :offset="1">

        <el-select v-model="projectCode" placeholder="请选择项目"
        :disabled="$route.params.projectId !== 'admin'"
        @change="projectChange"
        >
          <el-option
            v-for="project in projects"
            :key="project.code"
            :label="project.name"
            :value="project.code">
          </el-option>
        </el-select>

        <el-button-group style="float: right;">
          <el-button type="success" @click="addBuilding">新增建筑</el-button>
          <el-button type="danger" @click="deleteItem">删除建筑</el-button>
        </el-button-group>

        <el-tree
          :data="treeData"
          :load="loadNode"
          highlight-current
          accordion
          lazy
          style="margin-top: 50px"
          ref="tree"
          @node-click="handleNodeClick">
        </el-tree>
      </el-col>

      <el-col :span="12" :offset="2">
        <component class="form" v-if="formId !== null" type="edit" key="editForm" :is="type + 'sForm'" :id="formId"
          :projectCode="projectCode" :buildingCode="buildingCode" :unitId="unitId" @close="closeForm" :isReset="false"
        />
      </el-col>
    </el-row>

    <el-dialog title="新增建筑" :visible.sync="dialogFormVisible" :before-close="resetForm">
      <buildings-form ref="form" type="create" key="createForm" id=""
        :projectCode="projectCode" :buildingCode="buildingCode" :unitId="unitId" @close="closeForm"
      />
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import buildingsForm from '@/components/form/buildingsForm'
  import buildingUnitsForm from '@/components/form/buildingUnitsForm'

  export default {
    name: 'ManageBuildings',
    data () {
      return {
        dialogFormVisible: false,
        type: 'building',
        formId: null,
        projectCode: '',
        buildingCode: '',
        unitId: 0,
        node: null,
        projects: [],
        treeData: []
      }
    },
    components: {
      buildingsForm,
      buildingUnitsForm
    },
    methods: {
      addBuilding () {
        if (this.projectCode) {
          this.dialogFormVisible = true
        } else {
          this.$message({ showClose: true, type: 'info', message: '先选择一个项目' })
        }
      },
      deleteItem () {
        if (this.type !== 'building' || !this.formId) {
          return void this.$message({ showClose: true, type: 'info', message: '先选择一个建筑' })
        }
        const bIndex = this.treeData.findIndex(item => item.value === this.buildingCode)
        if (this.type === 'building') {
          this.$confirm('此操作将永久删除该建筑, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => ajax('delete building', this.formId)
          ).then(res => {
            this.treeData.splice(bIndex, 1)
            this.formId = null
            this.$message({ showClose: true, type: 'success', message: '删除成功!' })
          }).catch(() => {
            this.$message({ showClose: true, type: 'info', message: '已取消删除' })
          })
        }
      },
      resetForm (done) {
        this.$refs.form.reset()
        done()
      },
      closeForm (flag, type, label) {
        if (flag) {
          this.$message({ showClose: true, type: 'success', message: '编辑成功' })
          if (type === 'create') {
            this.projectChange(this.projectCode)
          } else if (type === 'edit') {
            this.node.data.label = label
          }
        } else {
          this.$message({ showClose: true, type: 'info', message: '已取消编辑' })
        }
        this.dialogFormVisible = false
      },
      handleNodeClick (data, node) {
        this.type = data.type
        this.formId = data.id
        if (data.type === 'building') {
          this.buildingCode = data.value
        } else if (data.type === 'buildingUnit') {
          this.unitId = data.value
        }
        this.node = node
      },
      loadNode (node, resolve) {
        if (node.data.type === 'project') {
          this.fetchBuildings(node.data.value).then(nodes => resolve(nodes))
        } else if (node.data.type === 'building') {
          this.fetchBuildingUnits(node.data.value).then(nodes => resolve(nodes))
        }
        return resolve([])
      },
      projectChange (projectCode) {
        this.projectCode = projectCode
        this.fetchBuildings(projectCode).then(data => {
          this.treeData = data
        })
      },
      fetchProjects () {
        ajax('get projects').then(res => {
          this.projects = res.data.map(item => {
            return {
              code: item.project_code,
              name: item.project_name
            }
          })
        })
      },
      fetchProject (projectId) {
        ajax('get project', projectId).then(res => {
          this.projectCode = res.data.project_code
        })
      },
      fetchBuildings (projectCode) {
        return ajax('get buildings by projectCode', projectCode).then(res => {
          return res.data.map(item => {
            return {
              type: 'building',
              id: item.id,
              label: item.building_name,
              value: item.building_code
            }
          })
        })
      },
      fetchBuildingUnits (buildingCode) {
        return ajax('get buildingUnits by buildingCode', buildingCode).then(res => {
          return res.data.map(item => {
            return {
              type: 'buildingUnit',
              id: item.id,
              label: item.unit_name,
              value: item.id
            }
          })
        })
      },
      init () {
        this.fetchProjects()
        this.$route.params.projectId !== 'admin' && this.fetchProject(this.$route.params.projectId)
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="css" scoped>
  .empty-form {
    font-size: 20px;
    text-align: center;
    line-height: 5;
  }

  .form {
    margin-top: 80px;
  }
</style>

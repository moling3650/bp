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
          <el-button type="danger">删除</el-button>
        </el-button-group>

        <el-tree
          :data="treeData"
          :load="loadNode"
          highlight-current
          accordion
          lazy
          style="margin-top: 50px"
          @node-click="handleNodeClick">
        </el-tree>
      </el-col>

      <el-col :span="12" :offset="2">
        <component v-if="formId !== null" type="edit" key="editForm" :is="type + 'sForm'" :id="formId"
          :projectCode="projectCode" :buildingCode="buildingCode" :unitId="unitId" @close="closeForm"
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
  import axios from 'axios'
  // import projectsForm from '@/components/form/projectsForm'
  import buildingsForm from '@/components/form/buildingsForm'
  import buildingUnitsForm from '@/components/form/buildingUnitsForm'
  // import pointsForm from '@/components/form/pointsForm'

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
      // projectsForm,
      buildingsForm,
      buildingUnitsForm
      // pointsForm
    },
    methods: {
      addBuilding () {
        if (this.projectCode) {
          this.dialogFormVisible = true
        } else {
          this.$message({ type: 'info', message: '先选择一个项目' })
        }
      },
      resetForm (done) {
        this.$refs.form.reset()
        done()
      },
      closeForm (flag, type, label) {
        if (flag) {
          this.$message({ type: 'success', message: '编辑成功' })
          if (type === 'create') {
            this.projectChange(this.projectCode)
          } else if (type === 'edit') {
            this.node.data.label = label
          }
        } else {
          this.$message({ type: 'info', message: '已取消编辑' })
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
        // else if (node.data.type === 'buildingUnit') {
        //   this.fetchPoints(node.data.value).then(nodes => resolve(nodes))
        // }
        return resolve([])
      },
      projectChange (projectCode) {
        this.fetchBuildings(projectCode).then(data => {
          this.treeData = data
        })
      },
      fetchProjects () {
        axios.get(`/api/projects`).then(res => {
          this.projects = res.data.map(item => {
            return {
              code: item.project_code,
              name: item.project_name
            }
          })
        }).catch(err => console.log(err))
      },
      fetchProject (projectId) {
        axios.get(`/api/projects/${projectId}`).then(res => {
          this.projectCode = res.data.project_code
          // this.treeData = [{
          //   type: 'project',
          //   id: res.data.id,
          //   label: res.data.project_name,
          //   value: res.data.project_code
          // }]
        }).catch(err => console.log(err))
      },
      fetchBuildings (projectCode) {
        return axios.get(`/api/buildings?projectCode=${projectCode}`).then(res => {
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
        return axios.get(`/api/buildingunits?buildingCode=${buildingCode}`).then(res => {
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
      // fetchPoints (unitId) {
      //   return axios.get(`/api/points?unitId=${unitId}`).then(res => {
      //     return res.data.map(item => {
      //       return {
      //         type: 'point',
      //         id: item.id,
      //         label: `节点 － ${item.id}`,
      //         value: item.id
      //       }
      //     })
      //   })
      // },
      init () {
        this.fetchProjects()
        this.fetchProject(this.$route.params.projectId)
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
</style>

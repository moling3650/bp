<template>
  <div class="ManageBuildings">
    <h1 class="title">项目建筑管理</h1>
    <el-row>

      <el-col :span="8" :offset="1">
        <el-button-group>
          <el-button type="success" v-if="type !== 'point'">{{ addButtonText }}</el-button>
          <el-button type="info">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </el-button-group>
        <el-tree
          :data="treeData"
          :load="loadNode"
          highlight-current
          accordion
          lazy
          @node-click="handleNodeClick">
        </el-tree>
      </el-col>

      <el-col :span="12" :offset="2">
        <component :is="type + 'sForm'" :type="formType" :id="formId"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import projectsForm from '@/components/form/projectsForm'
  import buildingsForm from '@/components/form/buildingsForm'
  import buildingUnitsForm from '@/components/form/buildingUnitsForm'
  import pointsForm from '@/components/form/pointsForm'

  export default {
    name: 'ManageBuildings',
    data () {
      return {
        type: 'project',
        formId: null,
        formType: '',
        projectCode: '',
        buildingCode: '',
        unitId: 0,
        treeData: []
      }
    },
    computed: {
      addButtonText () {
        const textMap = {
          project: '新建建筑',
          building: '新建建筑单元',
          buildingUnit: '新建节点'
        }
        return textMap[this.type]
      }
    },
    components: {
      projectsForm,
      buildingsForm,
      buildingUnitsForm,
      pointsForm
    },
    methods: {
      handleNodeClick (data) {
        this.type = data.type
        this.formId = data.id
      },
      loadNode (node, resolve) {
        if (node.data.type === 'project') {
          this.fetchBuildings(node.data.value).then(nodes => resolve(nodes))
        } else if (node.data.type === 'building') {
          this.fetchBuildingUnits(node.data.value).then(nodes => resolve(nodes))
        } else if (node.data.type === 'buildingUnit') {
          this.fetchPoints(node.data.value).then(nodes => resolve(nodes))
        }
        return resolve([])
      },
      fetchProject (projectId) {
        axios.get(`/api/projects/${projectId}`).then(res => {
          this.projectCode = res.data.project_code
          this.treeData = [{
            type: 'project',
            id: res.data.id,
            label: res.data.project_name,
            value: res.data.project_code
          }]
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
      fetchPoints (unitId) {
        return axios.get(`/api/points?unitId=${unitId}`).then(res => {
          return res.data.map(item => {
            return {
              type: 'point',
              id: item.id,
              label: `节点 － ${item.id}`,
              value: item.id
            }
          })
        })
      }
    },
    mounted () {
      this.fetchProject(this.$route.params.projectId)
    }
  }
</script>

<style lang="css" scoped>
</style>

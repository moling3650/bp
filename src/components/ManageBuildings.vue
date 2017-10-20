<template>
  <div class="ManageBuildings">
    <h1 class="title">项目建筑管理</h1>
    <el-row>
      <!-- :render-content="renderNode" -->
      <el-col :span="8">
        <el-tree
          :data="treeData"
          :load="loadNode"
          accordion
          lazy
          @node-click="handleNodeClick">
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'ManageBuildings',
    data () {
      return {
        projectCode: '',
        treeData: []
      }
    },
    methods: {
      handleNodeClick () {
        // console.log(arguments)
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
      // append (store, data) {
      //   console.log(data)
      //   store.append({ value: 'id++', label: 'testtest', children: [] }, data)
      // },
      // remove (store, data) {
      //   store.remove(data)
      // },
      // renderNode (h, { node, data, store }) {
      //   return (
      //     <span>
      //       <span>
      //         <span>{node.label}</span>
      //       </span>
      //       <span style="float: right; margin-right: 20px">
      //         <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>
      //         <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>
      //       </span>
      //     </span>
      //   )
      // },
      fetchProject (projectId) {
        axios.get(`/api/projects/${projectId}`).then(res => {
          this.projectCode = res.data.project_code
          this.treeData = [{
            type: 'project',
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

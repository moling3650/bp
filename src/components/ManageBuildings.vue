<template>
  <div class="ManageBuildings">
    <h1 class="title">项目建筑管理</h1>
    <el-row>
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
        projectCode: this.$route.params.projectCode,
        treeData: []
      }
    },
    methods: {
      handleNodeClick () {
        // console.log(arguments)
      },
      loadNode (node, resolve) {
        if (node.data.type === 'building') {
          this.fetchBuildingUnits(node.data.value).then(nodes => resolve(nodes))
        } else if (node.data.type === 'buildingUnit') {
          this.fetchPoints(node.data.value).then(nodes => resolve(nodes))
        }
        return resolve([])
      },
      fetchBuildings (projectCode) {
        axios.get(`/api/buildings?projectCode=${projectCode}`).then(res => {
          this.treeData = res.data.map(item => {
            return {
              type: 'building',
              label: item.building_name,
              value: item.building_code
            }
          })
        }).catch(err => console.log(err))
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
      this.fetchBuildings(this.projectCode)
    }
  }
</script>

<style lang="css" scoped>
</style>

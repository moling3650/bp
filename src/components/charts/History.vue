<template>
  <div class="history-charts">

    <h1 class="title">历史数据查询</h1>

    <el-form :inline="true" :model="form">
      <el-row :gutter="5">
        <el-col :span="7" :offset="4">
          <el-form-item label="选择项目/建筑： ">
            <el-cascader
              :options="buildings"
              v-model="form.projectBuilding"
              @change="selectBuilding"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="选择日期： ">
            <el-date-picker
              v-model="form.dates"
              type="daterange"
              range-separator=" 至 "
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
  import ajax from '@/apis'

  export default {
    name: 'HistoryCharts',
    data () {
      return {
        buildings: [],
        buildingUnits: [],
        form: {
          projectBuilding: [],
          dates: []
        }
      }
    },
    methods: {
      selectBuilding (codes) {
        console.log(arguments)
        ajax('get buildingUnits group by buildingCode', codes[1]).then(res => {
          this.buildingUnits = res.data
        })
      },
      onSubmit () {

      },
      fetchBuildings () {
        ajax('get buildings').then(res => {
          let projects = {}
          res.data.map(item => {
            if (!projects[item.project_code]) {
              projects[item.project_code] = {
                label: item.project_name,
                value: item.project_code,
                children: []
              }
            }
            projects[item.project_code].children.push({ label: item.building_name, value: item.building_code })
          })
          this.buildings = Object.values(projects)
        })
      }
    },
    mounted () {
      this.fetchBuildings()
    }
  }
</script>

<style lang="css" scoped>
</style>

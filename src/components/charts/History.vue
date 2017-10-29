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

    <el-row v-for="unit in buildingUnits" :key="unit.unit_id" :gutter="20">
      <h1 class="title">{{ unit.unit_name }}</h1>
      <el-col :span="12" v-for="group in unit.groups" :key="group" :style="{ marginBottom: '10px' }">
        <el-card :body-style="{ height: '200px', padding: '10px' }">
          <line-chart :group="group" :unit-id="unit.unit_id" :start-time="form.dates[0]" :end-time="form.dates[1]"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ajax from '@/apis'
  import lineChart from '@/components/charts/lineChart'

  export default {
    name: 'HistoryCharts',
    components: {
      lineChart
    },
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
        }).catch(err => {
          console.log(err)
          this.buildingUnits = [{ 'unit_id': 1, 'unit_name': '建筑整体', 'groups': ['AA'] }]
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
        }).catch(err => {
          console.log(err)
          this.buildings = [{ label: '开发测试', value: 'test', children: [{ label: '开发建筑', value: 'tb' }] }]
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

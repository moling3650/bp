<template>
  <div class="history-charts">

    <h1 class="title">历史数据查询</h1>

    <el-form :inline="true" :model="form" :rules="rules" ref="form">
      <el-row :gutter="5">
        <el-col :span="7" :offset="4">
          <el-form-item label="选择项目/建筑： " prop="building">
            <el-cascader
              :options="buildings"
              v-model="form.projectBuilding"
              @change="selectBuilding"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="选择日期： " prop="date">
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

    <el-row v-if="showCharts" v-for="unit in buildingUnits" :key="unit.unit_id" :gutter="20">
      <h1 class="title">{{ unit.unit_name }}</h1>
      <el-col :span="12" v-for="group in unit.groups" :key="group" :style="{ marginBottom: '10px' }">
        <el-card :body-style="{ height: '250px', padding: '10px' }">
          <line-chart :title="`${unit.unit_id}_${group}`" ref="lineChart"/>
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
      const checkBuilding = (rule, value, callback) => {
        (this.form.projectBuilding[1]) ? callback() : callback(new Error('请选择建筑'))
      }
      const checkDate = (rule, value, callback) => {
        (this.form.dates[1]) ? callback() : callback(new Error('请选择日期'))
      }
      return {
        showCharts: false,
        buildings: [],
        buildingUnits: [],
        form: {
          projectBuilding: [],
          dates: []
        },
        rules: {
          building: [{ required: true, validator: checkBuilding, message: '请选择建筑' }],
          date: [{ required: true, validator: checkDate, message: '请选择日期' }]
        }
      }
    },
    methods: {
      selectBuilding (codes) {
        this.fetchBuildingUnits(codes[1])
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.fetchPointData()
            this.showCharts = true
          } else {
            return void console.log('error submit!!')
          }
        })
      },
      fetchPointData () {
        const params = {
          buildingCode: this.form.projectBuilding[1],
          startTime: this.form.dates[0],
          endTime: this.form.dates[1]
        }
        console.log(params)
        ajax('get pointDatas by buildingCode', params).then(res => {
          console.log(res.data)
          let datas = {}
          res.data.map(item => {
            const key = `${item.unit_id}_${item.group_name}`
            if (!datas[key]) {
              datas[key] = {}
            }
            if (!datas[key][item.point_id]) {
              datas[key][item.point_id] = {
                point_id: item.point_id,
                point_name: item.point_name,
                data: []
              }
            }
            datas[key][item.point_id].data.push([item.input_time, item.val])
          })
          this.$refs.lineChart.map(chart => chart.setData(datas[chart.title]))
        })
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
        .catch(err => {
          console.log(err)
          this.buildings = [{ label: '开发测试', value: 'test', children: [{ label: '开发建筑', value: 'tb' }] }]
        })
      },
      fetchBuildingUnits (buildingCode) {
        ajax('get buildingUnits group by buildingCode', buildingCode).then(res => {
          this.buildingUnits = res.data
        })
        .catch(err => {
          console.log(err)
          this.buildingUnits = [
            { 'unit_id': 1, 'unit_name': '建筑整体', 'groups': ['AA', 'BB'] },
            { 'unit_id': 2, 'unit_name': '地基', 'groups': ['AA'] }
          ]
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

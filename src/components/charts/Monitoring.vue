<template>
  <div class="Monitoring">
    <h1 class="title">建筑监控</h1>

    <el-form :inline="true" :model="form">
      <el-row :gutter="5">
        <el-col :span="7" :offset="2">
          <el-form-item label="选择项目/建筑： ">
            <el-cascader
              :options="buildings"
              v-model="form.projectBuilding"
              placeholder="选择项目/建筑"
              @change="selectBuilding"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="样本容量： ">
            <el-input-number v-model="form.sampleSize" controls-position="right" :min="0" :max="300"/>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="刷新间隔(秒)： ">
            <el-input v-model="form.interval" placeholder="默认不刷新"/>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">监控</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row v-for="unit in buildingUnits" :key="unit_id" :gutter="20">
      <h1 class="title">{{ unit.unit_name }}</h1>
      <el-col :span="12" v-for="group in unit.groups" :key="group" :style="{ marginBottom: '10px' }">
        <el-card :header="group" :body-style="{ height: '200px', padding: '10px' }"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ajax from '@/apis'

  export default {
    name: 'Monitoring',
    data () {
      return {
        buildings: [],
        buildingUnits: [],
        startTime: '',
        form: {
          projectBuilding: [],
          sampleSize: 200,
          interval: null
        }
      }
    },
    methods: {
      selectBuilding (codes) {
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

<template>
  <div class="charts">
    <h1 class="title">建筑监测图</h1>

      <el-form :inline="true" :model="form">
        <el-row :gutter="5">
          <el-col :span="4" :offset="2">
            <el-form-item>
              <el-cascader
                :options="buildings"
                v-model="form.projectBuilding"
                placeholder="选择项目/建筑"
                @active-item-change="projectChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-date-picker
                v-model="form.dates"
                type="daterange"
                range-separator=" 至 "
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>


          <el-col :span="5">
            <el-form-item label="样本容量： ">
              <el-input-number v-model="form.sampleSize" controls-position="right" :min="0" :max="300"/>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="刷新间隔(秒)： ">
              <el-input v-model="form.interval" placeholder="默认不刷新"/>
            </el-form-item>
          </el-col>

          <el-col :span="2">
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
    name: 'Charts',
    data () {
      return {
        buildings: [],
        form: {
          projectBuilding: [],
          dates: [],
          sampleSize: 200,
          interval: null
        }
      }
    },
    methods: {
      projectChange () {

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

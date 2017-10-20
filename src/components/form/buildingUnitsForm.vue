<template>
  <div class="building-units-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="建筑单元" prop="unit_name">
        <el-input v-model="form.unit_name" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item label="选择建筑" prop="building_code">
        <el-select v-model="form.building_code" placeholder="请选择建筑" :disabled="type === 'view'">
          <el-option
            v-for="building in buildings"
            :key="building.code"
            :label="building.name"
            :value="building.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" :disabled="type === 'view'"/>
      </el-form-item>

      <el-form-item v-if="type !== 'view'">
        <el-button type="primary" @click="onSubmit">{{ id ? '保存' : '新建'}}</el-button>
        <el-button @click="$emit('close', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'buildingUnitsForm',
    props: {
      type: {
        type: String
      },
      id: {
        type: [String, Number]
      }
    },
    data () {
      return {
        buildings: [],
        form: {
          unit_name: '',
          building_code: '',
          remark: ''
        },
        rules: {
          unit_name: [{ required: true, message: '请输入建筑单元名称', trigger: 'blur' }],
          building_code: [{ required: true, message: '请选择建筑', trigger: 'change' }]
        }
      }
    },
    watch: {
      id: function (val, oldVal) {
        val && this.init(val)
      }
    },
    methods: {
      reset () {
        this.$refs.form.resetFields()
      },
      fetchBuildings () {
        axios.get('/api/buildings').then(res => {
          this.buildings = res.data.map(item => {
            return { name: item.building_name, code: item.building_code }
          })
          if (this.buildings.length > 0) {
            this.form.building_code = this.buildings[0].code
          }
        }).catch(err => console.log(err))
      },
      fetchBuildingUnit (id) {
        axios.get(`/api/buildingunits/${id}`).then(res => {
          if (res.data) {
            this.form = res.data
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios({
              url: `/api/buildingunits/${this.id}`,
              method: this.type === 'create' ? 'post' : 'put',
              data: this.form
            }).then(res => {
              res.errno && console.log(res.sqlMessage)
              this.$emit('close', !res.errno)
            }).catch(err => console.log(err))
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      init (unitId) {
        this.fetchBuildings()
        unitId && this.fetchBuildingUnit(unitId)
      }
    },
    mounted () {
      this.init(this.id)
    }
  }
</script>

<style lang="css" scoped>
</style>

<template>
  <div class="buildings-form">
    <el-form ref="form" :model="form" label-width="100px">
      <h1 class="title">{{ id ? '编辑' : '新建'}}建筑</h1>
      <el-form-item label="建筑代码">
        <el-input v-model="form.building_code"/>
      </el-form-item>

      <el-form-item label="建筑名称">
        <el-input v-model="form.building_name"/>
      </el-form-item>

      <el-form-item label="建筑类型">
        <el-select v-model="form.type" placeholder="请选择建筑类型">
          <el-option
            v-for="(item, index) in ['楼塔', '桥梁', '隧道', '堤坝']"
            :key="index"
            :label="item"
            :value="index + 1">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ id ? '保存' : '新建'}}</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'buildingsForm',
    data () {
      return {
        id: parseInt(this.$route.params.id) || '',
        method: 'post',
        form: {
          building_code: '',
          building_name: '',
          type: 1,
          remark: ''
        }
      }
    },
    methods: {
      fetchbuilding (id) {
        axios.get(`/api/buildings/${id}`).then(res => {
          if (res.data) {
            this.method = 'put'
            this.form = res.data
          }
        }).catch(err => console.log(err))
      },
      onSubmit () {
        axios({
          url: `/api/buildings/${this.id}`,
          method: this.method,
          data: this.form
        }).then(res => {
          if (!res.errno) {
            this.$router.push({ name: 'Buildings' })
          } else {
            console.log(res.sqlMessage)
          }
        }).catch(err => console.log(err))
      }
    },
    mounted () {
      if (this.id) {
        this.fetchbuilding(this.id)
      }
    }
  }
</script>

<style lang="css" scoped>
  .buildings-form {
    width: 992px;
    padding: 10px;
    margin: 0 auto;
  }

  .title {
    margin: 15px 0 10px 0;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
</style>

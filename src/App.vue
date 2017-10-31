<template>
  <div id="app">
    <el-menu theme="dark" default-active="/" mode="horizontal" router>
      <el-menu-item index="/">项目管理</el-menu-item>
      <el-menu-item index="/buildings">建筑管理</el-menu-item>
      <el-menu-item index="/buildingunits">建筑单元管理</el-menu-item>
      <el-menu-item index="/uppers">上位机管理</el-menu-item>
      <el-menu-item index="/monitors">LORA管理</el-menu-item>
      <el-menu-item index="/points">节点管理</el-menu-item>
      <el-submenu index="/charts">
        <template slot="title">监测图</template>
        <el-menu-item index="/charts/monitoring">监控数据</el-menu-item>
        <el-menu-item index="/charts/history">历史数据</el-menu-item>
      </el-submenu>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  .title {
    margin: 15px 0 15px 0;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .button-group, .btn-add {
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: right;
  }
</style>

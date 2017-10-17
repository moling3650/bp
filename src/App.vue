<template>
  <div id="app">
    <el-menu theme="dark" default-active="/" mode="horizontal" router>
      <el-menu-item index="/">项目管理</el-menu-item>
      <el-menu-item index="/buildings">建筑管理</el-menu-item>
      <el-menu-item index="/buildingunits">建筑单元管理</el-menu-item>
      <el-menu-item index="/uppers">上位机管理</el-menu-item>
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
</style>

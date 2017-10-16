<template>
  <div class="editor">
    <component :is="formName"></component>
  </div>
</template>

<script>
  import projectsForm from '@/components/form/projectsForm'

  export default {
    name: 'Editor',
    components: {
      projectsForm
    },
    data () {
      return {
        formName: this.$route.params.type + 'Form'
      }
    }
  }
</script>

<style lang="css" scoped>
</style>

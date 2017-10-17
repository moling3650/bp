<template>
  <div class="editor">
    <component :is="formName"></component>
  </div>
</template>

<script>
  import projectsForm from '@/components/form/projectsForm'
  import buildingsForm from '@/components/form/buildingsForm'

  export default {
    name: 'Editor',
    components: {
      projectsForm,
      buildingsForm
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

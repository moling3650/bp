import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Buildings from '@/components/Buildings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/buildings',
      name: 'Buildings',
      component: Buildings
    }
  ]
})

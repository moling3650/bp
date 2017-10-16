import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Editor from '@/components/Editor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/editor/:type/:id',
      name: 'Editor',
      component: Editor
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Buildings from '@/components/Buildings'
import BuildingUnits from '@/components/BuildingUnits'
import Uppers from '@/components/Uppers'
import Monitors from '@/components/Monitors'
import Points from '@/components/Points'

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
    },
    {
      path: '/buildingunits',
      name: 'BuildingUnits',
      component: BuildingUnits
    },
    {
      path: '/uppers',
      name: 'Uppers',
      component: Uppers
    },
    {
      path: '/monitors',
      name: 'Monitors',
      component: Monitors
    },
    {
      path: '/points',
      name: 'Points',
      component: Points
    }
  ]
})

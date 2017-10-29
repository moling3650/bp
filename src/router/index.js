import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Buildings from '@/components/Buildings'
import BuildingUnits from '@/components/BuildingUnits'
import Uppers from '@/components/Uppers'
import Monitors from '@/components/Monitors'
import Points from '@/components/Points'
import ManageBuildings from '@/components/ManageBuildings'
import HistoryCharts from '@/components/charts/History'
import MonitoringCharts from '@/components/charts/Monitoring'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/manage/:projectId/buildings',
      name: 'ManageBuildings',
      component: ManageBuildings
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
    },
    {
      path: '/charts',
      redirect: '/charts/monitoring'
    },
    {
      path: '/charts/history',
      name: 'HistoryCharts',
      component: HistoryCharts
    },
    {
      path: '/charts/monitoring',
      name: 'MonitoringCharts',
      component: MonitoringCharts
    }
  ]
})

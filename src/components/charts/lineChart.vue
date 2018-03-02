<template>
  <div class="line-chart" ref="lineChart"></div>
</template>

<script>
  import Echarts from 'echarts'

  export default {
    name: 'lineChart',
    props: {
      title: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 50
      }
    },
    data () {
      return {
        chart: null,
        isInitDataZoom: false
      }
    },
    methods: {
      setData (dataMap, isMonitoring) {
        if (!dataMap) {
          return this.chart.showLoading({ text: '没有数据...' })
        }
        this.chart || this.init()
        const legend = {
          data: Object.values(dataMap).map(item => item.point_name)
        }
        const series = Object.values(dataMap).map(item => {
          return {
            name: item.point_name,
            type: 'line',
            hoverAnimation: false,
            data: item.data
          }
        })
        const option = { legend, series }
        if (!this.isInitDataZoom) {
          option.dataZoom = this.getDataZoom(dataMap, 50)
          this.isInitDataZoom = true
        }
        if (!isMonitoring) {
          this.isInitDataZoom = false
        }
        this.chart.setOption(option)
        this.chart.hideLoading()
      },
      getDataZoom (dataMap, size) {
        const maxCount = Math.max(...Object.values(dataMap).map(item => item.data.length))
        const start = maxCount <= size ? 0 : (100 - Math.floor((100 / (maxCount / size))))
        return [
          {
            type: 'slider',
            show: true,
            handleSize: 8,
            filterMode: 'filter',
            start
          },
          {
            type: 'inside',
            filterMode: 'filter',
            start
          }
        ]
      },
      init () {
        this.chart = Echarts.init(this.$refs.lineChart)
        const option = {
          title: {
            text: this.title
          },
          grid: {
            top: 35,
            right: 30,
            bottom: 80,
            left: 50
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          toolbox: {
            feature: {
              myExport: {
                show: true,
                title: '导出',
                icon: 'path://M467.985218 937.525717c0.122866 0.124914 0.24778 0.248804 0.372694 0.370646 11.174684 10.873662 25.852081 16.831651 41.412066 16.831651 0.277473 0 0.554946-0.001024 0.832419-0.005119 15.837458-0.217064 30.643864-6.574368 41.702849-17.905707l334.741901-339.769178c9.525205-9.667525 9.408482-25.226487-0.259043-34.750668-9.666501-9.524181-25.227511-9.408482-34.750668 0.259043l-315.80719 320.551874L536.230246 88.475979c0-13.5716-11.001648-24.573248-24.573248-24.573248-13.5716 0-24.573248 11.001648-24.573248 24.573248l0 798.397108L166.360888 561.132161c-9.52111-9.670597-25.080071-9.791415-34.750668-0.269282-9.670597 9.52111-9.791415 25.080071-0.270306 34.750668L467.985218 937.525717z',
                onclick () {
                  alert('myToolHandler1')
                }
              }
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            min (value) {
              return value.min - (value.max - value.min) / 4
            },
            max (value) {
              return value.max + (value.max - value.min) / 4
            },
            splitLine: {
              show: false
            }
          },
          series: []
        }
        this.chart.setOption(option)
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="css" scoped>
  .line-chart {
    height: 100%;
  }
</style>

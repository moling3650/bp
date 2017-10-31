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
      setData (dataMap) {
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
            left: 30
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
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
            boundaryGap: [0, '100%'],
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

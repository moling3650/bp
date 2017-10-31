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
        chart: null
      }
    },
    methods: {
      setData (dataMap) {
        this.chart || this.init()
        const dataZoom = this.getDataZoom(dataMap, this.size)
        const legend = {
          data: Object.keys(dataMap).map(key => ({ name: key }))
        }
        const series = Object.values(dataMap).map(item => {
          return {
            name: item.point_id,
            type: 'line',
            hoverAnimation: false,
            data: item.data
          }
        })
        this.chart.setOption({ dataZoom, legend, series })
        this.chart.hideLoading()
      },
      getDataZoom (dataMap, size) {
        const maxCount = Math.max(...Object.values(dataMap).map(item => item.data.length))
        const start = maxCount <= size ? maxCount : (100 - Math.floor((100 / (maxCount / size))))
        return [
          {
            type: 'slider',
            show: true,
            handleSize: 8,
            filterMode: 'none',
            start
          },
          {
            type: 'inside',
            filterMode: 'none',
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
        this.chart.showLoading({
          text: '查询数据中...'
        })
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

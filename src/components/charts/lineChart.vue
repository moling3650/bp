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
        this.chart.setOption({ legend, series })
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
            bottom: 35,
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

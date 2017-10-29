<template>
  <div class="line-chart" ref="lineChart"></div>
</template>

<script>
  import Echarts from 'echarts'

  export default {
    name: 'lineChart',
    props: {
      group: {
        type: String,
        required: true
      },
      unitId: {
        type: Number,
        required: true
      },
      startTime: {
        type: Date,
        default: new Date(Date.now() - (1000 * 3600 * 24))
      },
      endTime: {
        type: Date
      },
      interval: {
        type: String
      }
    },
    data () {
      return {
        chart: null
      }
    },
    methods: {
      setData (data) {
        this.chart || this.init()
        const series = data.map(item => {
          return {
            name: item.group_name,
            type: 'line',
            hoverAnimation: false,
            data: item.data
          }
        })
        this.chart.setOption({ series })
      },
      init () {
        this.chart = Echarts.init(this.$refs.lineChart)
        const option = {
          title: {
            text: this.group
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

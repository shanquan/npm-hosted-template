const COLORS = ["#409eff", "#F56C6C", "#67C23A", "#E6A23C", "#eadf4b", "#606266"]
const barOption = {
  color: COLORS,
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  xAxis: {
    type: 'category',
    show: true,
    data: []
  },
  yAxis: {
    type: 'value',
    show: true
  },
  series: {}
}
const pieOption = {
  color: COLORS,
  tooltip: {
    trigger: 'item'
  },
  legend: {
    // orient: 'vertical',
    // left: 'left',
  },
  series: {
    type: 'pie',
    radius: '50%',
    data: [],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }
}
export default {
  bar: barOption,
  pie: pieOption
}
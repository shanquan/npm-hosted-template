<!--
@author: wang.weili
@since : 2021/06/04
@recommand: https://v-charts.js.org/#/
@official: https://ecomfe.github.io/vue-echarts/
-->
<template>
  <div ref="dom" class="chart-box" />
</template>

<script>
import * as echarts from "echarts/lib/echarts";
import { TitleComponent } from "echarts/components";
echarts.use([TitleComponent]);
import { TooltipComponent } from "echarts/components";
echarts.use([TooltipComponent]);
import { LegendComponent } from "echarts/components";
import { ToolboxComponent } from "echarts/components";
echarts.use([ToolboxComponent]);
echarts.use([LegendComponent]);
import { GridComponent } from "echarts/components";
echarts.use([GridComponent]);
import { BarChart } from "echarts/charts";
echarts.use([BarChart]);
import { LineChart } from "echarts/charts";
echarts.use([LineChart]);
import { PieChart } from "echarts/charts";
echarts.use([PieChart]);

import Options from "./echart.js";

const defaultOption = {
  color: ["#409eff", "#F56C6C", "#67C23A", "#E6A23C", "#eadf4b", "#606266"],
  xAxis: {
    show: false,
  },
  yAxis: {
    show: false,
  },
  series: [],
};
export default {
  name: "Chart",
  props: {
    type: {
      type: String,
      default: "bar", // bar,line,horizontalbar,pie,doughnut
    },
    chartData: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    data: {
      handler() {
        this.drawing();
      },
      deep: true,
    },
    chartData: {
      handler() {
        this.drawingData();
      },
      deep: true,
    },
  },
  data() {
    return {
      dom: null,
    };
  },
  mounted() {
    const option = Object.assign({}, defaultOption, this.data);
    this.dom = echarts.init(this.$refs.dom);
    this.dom.setOption(option);
    if (this.data) this.drawing();
    if (this.chartData) this.drawingData();
    // this.$root.charts.push(this);
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    // this.$root.charts = this.$root.charts.filter(el=>el._uid!=this._uid);
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    deepClone(source, hash = new WeakMap()) {
      if (typeof source != "object" || !source) return source;
      if (hash.has(source)) return hash.get(source);
      const target = Array.isArray(source) ? [] : {};
      hash.set(source, target);
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = this.deepClone(source[key], hash);
        }
      }
      return target;
    },
    resize() {
      this.dom.resize();
    },
    drawing() {
      if (this.data) this.dom.setOption(this.data,true);
    },
    drawingData() {
      try {
        if(!this.chartData.length) return;
        var columns = Object.keys(this.chartData[0]);
        var category = this.chartData.map(
          (el) => el[columns[0]]
        );
        var opts = {};
        if (
          this.type.startsWith("bar") ||
          this.type.startsWith("line") ||
          this.type.startsWith("area") ||
          this.type == "horizontalbar"
        ) {
          opts = this.deepClone(Object.assign({}, Options.bar));
          if (this.type == "horizontalbar") {
            opts.xAxis.type = "value";
            opts.yAxis.type = "category";
            opts.yAxis.data = category;
          } else {
            opts.xAxis.data = category;
          }
        } else if (this.type == "pie" || this.type == "doughnut") {
          opts = this.deepClone(Object.assign({}, Options.pie));
          if (this.type == "doughnut") opts.series.radius = ["40%", "70%"];
        }
        if (this.type == "pie" || this.type == "doughnut") {
          opts.series.data = this.chartData.map((el) => {
            return {
              name: el[columns[0]],
              value: el[columns[1]],
            };
          });
        } else{
          let series = [];
          let type =
            this.type.split(",").length > 1 ? this.type.split(",") : this.type;
          if (type == "horizontalbar") type = "bar";
          for (let i = 1; i < columns.length; i++) {
            let sdata = {
              type: this.type.split(",").length > 1 ? type[i - 1] : type,
              smooth: true,
              label:{
                show: true,
                // position: 'top'
              },
              name: columns[i],
              data: this.chartData.map(
                (el) => el[columns[i]]
              ),
            }
            if(type=='area'){
              sdata.type = 'line'
              sdata.areaStyle = {}
            }
            series.push(sdata);
          }
          opts.series = series;
        }
        this.dom.setOption(opts,true);
      } catch (e) {
        const option = Object.assign({}, defaultOption);
        this.dom.setOption(option,true);
        console.error(e);
      }
    },
  },
};
</script>
<style>
.chart-box {
  min-height: 180px;
}
</style>
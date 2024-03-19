<!--
@author: wang.weili
@since : 2021/01/06
@description: 首页-工厂在制订单
-->
<template>
  <div class="orderProgress">
  <el-row :gutter="10" v-for="item in data" :key="item.$index">
    <el-col :span="16">
      <div style="line-height:30px">
      <el-row>
        <el-col class="header" :span="14">{{item.name}}</el-col>
        <el-col :span="2" class="center">{{item.qty}}{{$t('L10223')}}</el-col>
        <el-col :span="8" class="center">{{item.progress}}%</el-col>
        <!-- {{$t('L10224')}}： -->
      </el-row>
      </div>
      <el-progress :class="getPcgClass(item.progress)" :stroke-width="17" :show-text="false" :percentage="item.progress"></el-progress>
    </el-col>
    <el-col :span="4" class="center pt6">
      {{$t('L10224')}}<br><label>{{item.progress}}%</label>
    </el-col>
    <el-col :span="4">
      <el-progress :color="getPcgColor(item.progress)" type="circle" :width="50" :stroke-width="12" :show-text="false" stroke-linecap="butt" :percentage="item.progress"></el-progress>
    </el-col>
  </el-row>
  </div>
</template>

<script>
const order={
  name: "B18S01-DWB0035",
  qty: 1,
  progress: 76
}
export default {
  name: 'orderProgress',
  props: {
    data: {
      type: Array,
      default: () => [order,Object.assign({},order,{progress: 92}),Object.assign({},order,{progress: 22}),order,Object.assign({},order,{progress: 22})],
    },
  },
  methods:{
    refresh(){
      this.data.reverse();
    },
    getPcgClass(p){
      let c = "middle";
      if(p<=30){
        c = "slow"
      }else if(p>=90){
        c = "fast"
      }
      return c;
    },
    getPcgColor(p){
      let c = "rgb(58,160,255)";
      if(p<=30){
        c = "rgb(245,166,35)"
      }else if(p>=90){
        c = "rgb(113,201,16)"
      }
      return c;
    }
  }
}
</script>
<style>
.orderProgress{font-size:12px;color:rgb(0,0,0,.85);margin-top:-10px;}
.orderProgress > .el-row{
  border-bottom: 1px solid #ccc;
  padding: 10px 2px;
}
.el-col.header{font-size:14px;font-weight: bolder;}
.orderProgress .el-col label{font-size:16px;}
.middle .el-progress-bar__outer{background-color:rgb(191,228,253)}
.middle .el-progress-bar__inner{background-color:rgb(58,160,255)}
.slow .el-progress-bar__outer{background-color:rgb(255,228,184)}
.slow .el-progress-bar__inner{background-color:rgb(245,166,35)}
.fast .el-progress-bar__outer{background-color:rgb(212,255,165)}
.fast .el-progress-bar__inner{background-color:rgb(113,201,16)}
</style>

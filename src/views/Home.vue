<!--
@author: wang.weili
@since : 2020/11/12
-->
<template>
  <div>
  <!-- web -->
  <el-container class="home" v-if="pageType==0">
    <el-row :gutter="12">
    <!-- <el-row type="flex" class="xs-vertical" :gutter="12"> -->
      <el-col :xs="24" :sm="12">
        <el-card class="box-card pv">
          <div slot="header">
            <span>{{$t('L10218')}}</span>
            <span class="notes float-right">{{$t('L10219')}}：{{datetime}}</span>
          </div>
          <chart-area :data="pvData"></chart-area>
        </el-card>
        <!-- 网页内全屏，css实现 -->
        <!-- <el-card class="box-card" :class="fullscreen?'fullscreen':''"> -->
        <el-card id="r2Box1" class="box-card">
          <div slot="header">
            <span>{{$t('L10220')}}</span>
            <span class="notes">（{{$t(`${$http.project.projectCode}.L10221`)==`${$http.project.projectCode}.L10221`?$t('L10221'):$t(`${$http.project.projectCode}.L10221`)}}）</span>
            <span class="float-right"><i class="el-icon-full-screen primary" @click="toggle"></i><i class="el-icon-refresh success" @click="refresh"></i></span>
          </div>
          <pageView ref="pageView"></pageView>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card-person">
          <div slot="header">
            <span>{{$t('L10222')}}</span>
          </div>
          <shiftPerson></shiftPerson>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>{{$t('L10225')}}</span>
            <span class="float-right"><i class="el-icon-refresh success" @click="refresh2"></i></span>
          </div>
          <apiLog ref="apiLog"></apiLog>
        </el-card>
      </el-col>
      <!-- chart组件循环 -->
      <!-- <el-col v-for="item in pvList" :key="item.$index" :xs="24" :sm="12">
        <el-card class="box-card pv">
          <div slot="header">
            <span>{{item.$index}}</span>
          </div>
          <chart-area :data="item"></chart-area>
        </el-card>
      </el-col> -->
    </el-row>
  </el-container>

  <!-- mobile -->
  <el-container class="mobile-menu" v-else>
    <!-- level 1 -->
    <div v-if="levelTop" class="padding">
      <el-card shadow="hover" v-for="(item,index) in $root.mobileList" :key="index">
        <div class="list-item" @click="goLevel(index,item)">
          <img width="32" class="el-icon-i" v-if="item.iconAddress" :src="item.iconAddress"/>
          <i v-else :class="item.icon"></i>
          <span>{{$t(item.index)}}</span></div>
      </el-card>
    </div>
    <!-- level 2 -->
    <div v-else>
      <router-link class="el-collapse-item__header" v-for="(item,index) in subList" :key="index" :to="item.index"><span>{{$t(item.index)}}</span><i class="el-collapse-item__arrow el-icon-arrow-right"></i></router-link>
      <div class="center mt10"><el-button round @click="goLevel1">{{$t('L00012')}}</el-button></div>
    </div>
  </el-container>
  </div>
</template>
<script>
import Vue from 'vue'
import fullscreen from 'vue-fullscreen';
Vue.use(fullscreen);
import shiftPerson from '../app/components/home/ShiftPerson.vue'
import apiLog from '../app/components/home/ApiLog.vue'
import pageView from '../app/components/home/PageView.vue'
import chartArea from '@/components/Chart.vue'
let option = {
  title: {
	text: '',
	left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b} <br/>{a} : {c}',
    axisPointer: {
      type: 'line'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '1%',
    top: '15%',
    containLabel: true
  },
  xAxis: [
	{
	  type: 'category',
    show: false,
	  data: [],
	  axisLabel: {
		formatter:(value)=>{
		  return value.substring(10)
		}
	  },
	  axisTick: {
		alignWithLabel: true
	  }
	}
  ],
  yAxis: [
	{
	  type: 'value'
	}
  ],
  // 颜色配置
  color: ['rgb(69,165,255)'],
  series: [
    {
      name: '访问量',
      // 类型配置
      type: 'line',
      areaStyle: {
        color: 'rgb(209,233,255)'
      },
      smooth: true,
      // 数据配置
      data: [],
      itemStyle: {
        normal: {
          label: {
            show: true,
            fontSize: 14,
            position: 'top',
            formatter: '{c}'
          }
        }
      }
    }
  ]
}
export default {
  name: 'home',
  created(){
    this.$root.$children[0].showFrame = true;
    let query = this.$route.query;
    if(query.index>=0&&query.index<this.$root.mobileList.length){
      this.levelTop = this.$root.mobileList[query.index].subs==undefined?true:false;
    }
    if(this.pageType!=0){
      this.$store.commit('setPageType',1)
    }else{
      this.getPV();
    }
  },
  components: {
    shiftPerson,apiLog,pageView,
    chartArea
  },
  computed:{
    pageType(){
      return this.$store.state.pageType
    },
    subList(){
      let query = this.$route.query;
      let subList = [];
      if(query.index>=0&&query.index<this.$root.mobileList.length){
        subList = this.$root.mobileList[query.index].subs;
      }
      if(this.subIdx!==""){
        subList = this.$root.mobileList[this.subIdx].subs;
      }
      return subList;
    },
  },
  data(){
    return{
      levelTop: true,
      subIdx:"",
      fullscreen: false,
      datetime: "2020-12-22 19:20:00",
      pvData:option,
      pvList:[this.$root.deepClone(option),this.$root.deepClone(option)]
    }
  },
  methods:{
    refresh(){
      this.$refs.pageView.refresh()
    },
    toggle () {
      // this.fullscreen = !this.fullscreen;
      this.$fullscreen.toggle(document.getElementById('r2Box1'), {
        wrap: false,
        callback: (f)=>{
          this.fullscreen = f;
          if(!this.fullscreen)
          this.$refs.pageView.resize()
        }
      })
    },
    refresh2(){
      this.$refs.apiLog.refresh()
    },
    goLevel1(){
      this.levelTop=true;
      this.$root.clearMsgBox();
    },
    goLevel(idx,item){
      this.levelTop=false;
      if(item.subs){
        this.subIdx = idx;
      }else{
        this.$router.push({ path: item.index })
      }
    },
    getPV(){
      this.$http.showError=false;
      this.$http.axios.post(`${this.$http.user_url}sysAccessLog/getPV`,null,{
        headers:{
          addLog: false
        }
      }).then(res=>{
        this.pvData.xAxis[0].data = res.DATA.list.map(el=>el.label);
        this.pvData.xAxis[0].show = true;
        this.pvData.series[0].data = res.DATA.list.map(el=>el.value);
        // this.pvList = this.pvList.map(el=>{
        //   el.xAxis[0].data = res.DATA.list.map(el=>el.label);
        //   el.xAxis[0].show = true;
        //   el.series[0].data = res.DATA.list.map(el=>el.value+parseInt(Math.random()*10));
        //   return el
        // })
        this.datetime = res.DATA.time;
      })
    },
  },
  beforeRouteLeave (to,from,next) {
    if(this.pageType!=0&&this.levelTop==false&&to.name!="login"){
      this.$store.commit('setPageType',2)
      this.$root.$children[0].title = this.$root.getMobileTitle(to.path);
    }
    next();
  }
}
</script>
<style>
.home{/*height: calc(100% - 50px);*/
    display: flex;
    justify-content: center;
    align-items: center;background-color:rgb(240,244,254);}
.home .el-row{width:100%;height:100%}
.box-card{width:100%;height:calc(50% - 10px);margin-bottom:10px;overflow-y:auto}
.box-card .el-card__header{padding:11px 20px;font-size:16px;color:rgba(0,0,0,0.85)}
.box-card .el-card__body{min-width:410px;min-height:228px}
.box-card-person{width:100%;margin-bottom:10px}
.box-card-person .el-card__header{padding:11px 20px;font-size:16px;color:rgba(0,0,0,0.85)}
.box-card-person .el-card__body{min-width:410px;height:242px;padding-top:5px;}
.notes{font-size:12px;color:rgba(0,0,0,0.45);line-height:22px;}
.el-card__header i{margin-left:10px}
label.last{margin-left:60px}
.pv .el-card__body{height:calc(100% - 84px);}
.mobile-menu .el-container{
  flex-direction:column;
  margin-top:20px
}
.mobile-menu .el-card{
  margin-top:10px
}
.mobile-menu .el-card__body{padding:0px}
.list-item{line-height: 45px;
    padding-left: 48px;
    font-size:18px;
    position: relative;}
.list-item i:first-child,.list-item img[class^=el-icon-]{font-size:32px;position:absolute;top:7px;left:6px;color:var(--primary)}
.mobile-menu .el-collapse-item__header{padding-left:10px}
.mobile-menu .el-collapse-item__header span{font-size:16px}
.mobile-menu div{width:100%}
@media only screen and (max-width: 767px){
  .xs-vertical{
    -ms-flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
  }
  .box-card{height:auto}
}
i.el-icon-camera-solid{position:absolute;right:0;top:0px}
</style>
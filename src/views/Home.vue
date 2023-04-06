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
        <el-card id="orderBox" class="box-card">
          <div slot="header">
            <span>{{$t('L10220')}}</span>
            <span class="notes">（{{$t(`${$http.projectCode}.L10221`)==`${$http.projectCode}.L10221`?$t('L10221'):$t(`${$http.projectCode}.L10221`)}}）</span>
            <span class="float-right"><i class="el-icon-full-screen primary" @click="toggle"></i><i class="el-icon-refresh success" @click="refresh"></i></span>
          </div>
          <orderProgress :data="orderData"></orderProgress>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card-person">
          <div slot="header">
            <span>{{$t('L10222')}}</span>
          </div>
          <!-- <el-row :gutter="10" style="margin-bottom:-15px">
            <el-col :span="12" v-for="item in persons" :key="item.$index" class="info">
              <-- <i class="el-icon-user primary-bg white"></i> --
              <el-avatar size="small" src="images/user.png"></el-avatar>
              <span>{{item.name}}</span>
              <p>{{$t('email')}}：<a :href="'mailto:'+item.email">{{item.email}}</a></p>
              <p>{{$t('tel')}}：<label>{{item.tel}}</label></p>
              <label class="last">{{item.phone}}</label>
            </el-col>
          </el-row> -->
          <el-table stripe border :data="listPersonFilter" :header-cell-style="{'text-align':'center'}"
          style="width:100%" class="info">
            <el-table-column prop="personDay" :label="$t('dayShift')" :span="12">
              <template v-if="scope.row.personDay!=null" slot-scope="scope">
                <el-avatar size="small" src="img/user.png"></el-avatar>
                <span>{{scope.row.personDay.name}}</span>
                <p>{{$t('email')}}：<a :href="'mailto:'+scope.row.personDay.email">{{scope.row.personDay.email}}</a></p>
                <p>{{$t('tel')}}：<label>{{scope.row.personDay.tel}}</label></p>
                <!-- <label class="last">{{scope.row.personDay.phone}}</label> -->
              </template>
            </el-table-column>
            <el-table-column prop="personNight" :label="$t('nightShift')" :span="12">
              <template v-if="scope.row.personNight!=null" slot-scope="scope">
                <el-avatar size="small" src="img/user.png"></el-avatar>
                <span>{{scope.row.personNight.name}}</span>
                <p>{{$t('email')}}：<a :href="'mailto:'+scope.row.personNight.email">{{scope.row.personNight.email}}</a></p>
                <p>{{$t('tel')}}：<label>{{scope.row.personNight.tel}}</label></p>
                <!-- <label class="last">{{scope.row.personNight.phone}}</label> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>{{$t('L10225')}}</span>
          </div>
          <apiTop :data="apiData"></apiTop>
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
const api={
  name: "LoadMaterialUp",
  ip: "170.20.200.119",
  url: "#",
  time: "7.23",
  upward: true
}
const order={
  name: "B18S01-DWB0035",
  qty: 1,
  progress: 76
}
import apiTop from '@/components/home/ApiTop.vue'
import orderProgress from '@/components/home/OrderProgress.vue'
import chartArea from '@/components/Chart.vue'
const listPersonCount=6000,scrollNum=1;
let playTimer;
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
    this.getPV();
    this.getPersons();
    this.$root.$on('detected',(data)=>{
      console.log(data);
    })
    if(this.pageType!=0){
      this.$store.commit('setPageType',1)
    }
  },
  components: {
    apiTop,orderProgress,
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
    listPersonFilter(){
      return this.listPerson.slice(this.listPersonIndex*scrollNum,this.listPersonIndex*scrollNum+3);
    }
  },
  data(){
    return{
      levelTop: true,
      subIdx:"",
      fullscreen: false,
      datetime: "2020-12-22 19:20:00",
      pvData:option,
      apiData:[Object.assign({},api,{time:"12.23"}),Object.assign({},api,{upward:false}),api,Object.assign({},api,{upward:false,time:"2.23"}),api,api,api,api,api,api],
      orderData:[order,Object.assign({},order,{progress: 92}),Object.assign({},order,{progress: 22}),order,Object.assign({},order,{progress: 22})],
      listPerson: [{personDay:{ name: "李康琦", email: "abuitgrp@byd.com", tel: "13925260062", phone: "" },
        personNight:{ name: "熊川川", email: "abuitgrp@byd.com", tel: "15919912371", phone: "" }},
        {personDay:{ name: "庄崇", email: "abuitgrp@byd.com", tel: "13925262175", phone: "" },
        personNight:{ name: "张海群", email: "abuitgrp@byd.com", tel: "18680396526", phone: "" }}
      ],
      listPersonIndex:0,
      pvList:[this.$root.deepClone(option),this.$root.deepClone(option)]
    }
  },
  methods:{
    refresh(){
      this.orderData.reverse();
    },
    toggle () {
      // this.fullscreen = !this.fullscreen;
      this.$fullscreen.toggle(document.getElementById('orderBox'), {
        wrap: false,
        callback: (f)=>{this.fullscreen = f}
      })
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
      this.$http.axios.post(`${this.$http.user_url}sysAccessLog/getPV`).then(res=>{
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
    getPersons(){
      var param = {};
      // this.$http.getMockFile('mesSysMaintainSche_getList.json')
      this.$http.axios.post(`${this.$http.pre_url}mesSysMaintainSche/getList`,param,{
          headers: {
            showError: false,
          },
        })
        .then(res=>{
        let listDay = res.DATA.filter(el=>el.workClass=="白班");
        let listNight = res.DATA.filter(el=>el.workClass=="夜班");

        let iPersonDay = listDay.length;
        let iPersonNight = listNight.length;
        if (iPersonDay>0 || iPersonNight>0) {
          this.listPerson = [];
          let iLength = (iPersonDay>=iPersonNight)?iPersonDay:iPersonNight;
          for (let i=0; i<iLength; i++) {
            this.listPerson.push({personDay:((i<=iPersonDay-1)?listDay[i]:null), personNight:((i<=iPersonNight-1)?listNight[i]:null)});
          }
        }
        if(this.listPerson.length>3){ // 启动轮播定时器
          if(playTimer)
          window.cancelInterval(playTimer);
          playTimer = setInterval(()=>{
            if(this.listPersonIndex>=Math.floor(this.listPerson.length/scrollNum)-1){
              this.listPersonIndex = 0
            }else{
              ++this.listPersonIndex
            }
          },listPersonCount)
        }
      });
    }
  },
  beforeRouteLeave (to,from,next) {
    if(this.pageType!=0&&this.levelTop==false&&to.name!="login"){
      this.$store.commit('setPageType',2)
      this.$root.$children[0].title=this.$root.getMobileTitle(to.path);
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
.box-card-person{width:100%;height:calc(50% - 10px);margin-bottom:10px;overflow-y:auto}
.box-card-person .el-card__header{padding:11px 20px;font-size:16px;color:rgba(0,0,0,0.85)}
.box-card-person .el-card__body{min-width:410px;height:242px;padding-top:5px}
#orderBox .el-card__body{height: 346px}
.notes{font-size:12px;color:rgba(0,0,0,0.45);line-height:22px;}
.el-card__header i{margin-left:10px}
/* .info{margin-bottom:24px} */
.info i{
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 50%;
  margin-right: 12px;
  vertical-align: middle;
}
.info .el-avatar{width:24px;height:24px;margin-right:12px;vertical-align: middle;}
.info span{
  vertical-align: middle;
  font-size:14px;
}
.info p{
  padding-left: 36px;
  font-size: 12px;
  color:rgba(0,0,0,0.45);
  /* margin-top: 8px; */
  white-space: nowrap;
  text-overflow: ellipsis;
}
.info a{color:rgb(74,144,226)}
.info label{font-size:12px;color:rgba(0,0,0,0.85);}
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
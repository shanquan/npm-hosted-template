<!--
@author: wang.weili
@since : 2024/03/19
@description: 接口调用日志TOP10
-->
<template>
  <div class="apiLog">
    <el-table
      header-row-class-name="rowh-a"
      row-class-name="row-a"
      :data="data"
      v-loading="showLoading"
      style="width:100%;margin-top:-10px">
      <el-table-column
        type="index"
        :label="$t('L10226')"
        width="50">
        <template slot-scope="scope">
          <el-avatar size="small" :class="scope.$index<3?'trendup':''">{{scope.$index+1}}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="processName"
        :label="$t('processName')"
        class-name="nowrap"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="content"
        :label="$t('L10227')"
        class-name="nowrap"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <i v-if="scope.row.content&&scope.row.content.length>50" @click="showLog(scope.row.content)" class="primary el-icon-search"></i>
          <span v-else>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        :label="$t('L10228')"
        class-name="nowrap"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <label :class="scope.$index<3?'trendup':''">{{scope.row.ip}}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        :label="$t('L10229')+'(ms)'"
        width="170"
        class-name="nowrap rtime">
        <template slot-scope="scope">
          <el-progress :stroke-width="17" :show-text="false" :color="scope.$index<3?'rgb(238,134,136)':'rgb(191,228,253)'" :percentage="Math.min(scope.row.cost,10)*100/10"></el-progress>
          <span class="ml5">{{scope.row.cost}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 详情对话框 -->
    <el-dialog custom-class="el-message--success" :visible.sync="detailVisible" width="80%">
      <div id="detailBox" class="el-message__content"></div>
    </el-dialog>
  </div>
  
</template>

<script>
import axios from 'axios'
const axiosIns = axios.create();
const api={
  processName: "GRO-MLB-MAIN330-TESTVI",
  ip: "170.20.200.119",
  content: "#",
  cost: "7.23"
}
export default {
  name: 'apiLog',
  data(){
    return {
      showLoading:true,
      data:[],
      detailVisible:false,
    }
  },
  created(){
    this.$app.eventBus.$on('getLogUrl',(log_url)=>{
      if(log_url)
      this.getData(log_url)
    })
  },
  methods:{
    refresh(){
      if(this.$http.log_url)
      this.getData(this.$http.log_url)
    },
    getData(url){
      this.showLoading = true;
      axiosIns.post(`${url}log/exi/topN?topN=10`).then(res=>{
        this.showLoading = false;
        if(res.data.RESULT=='PASS'){
          this.data = res.data.DATA.sort((a,b)=>{
            return Number(b.cost) - Number(a.cost)
          });
        }
      }).catch(err=>{
        this.showLoading = false;
      })
    },
    showLog(txt){
      this.detailVisible = true
      this.$nextTick(()=>{
        document.getElementById('detailBox').innerHTML = txt.replace(/\n/g,'<br>');
      })
    }
  }
}
</script>
<style>
.rowh-a th{padding:6px 0;color:rgb(0,0,0,.52);background-color: rgb(250,250,250);}
.row-a td{padding:4px 0;color:rgb(0,0,0,.45)}
.row-a .el-avatar{width:17px;line-height:17px;height:17px;vertical-align: middle;}
.el-avatar.trendup{background-color:rgb(235,114,116)}
.row-a td a{color:rgb(24,144,255)}
.row-a label.trendup{color: rgb(0,0,0,.65)}
td.rtime{color: rgb(0,0,0,.65)}
.rtime .el-progress{display:inline-block;width:120px;vertical-align: middle;}
.rtime i{float:right;margin-top:3px}
.rtime .colorUp{color:rgb(238,134,136)}
.rtime .colorDown{color:rgb(126,211,33)}
</style>

<!--
@author: wang.weili
@since : 2020/11/13
-->
<template>
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
</template>

<script>
const listPersonCount=6000,scrollNum=1,showRows=3;
let playTimer;
export default {
  name: 'shiftPerson',
  created(){
    this.getPersons()
  },
  data(){
    return {
      listPerson: [],
      listPersonIndex:0,
    }
  },
  computed:{
    listPersonFilter(){
      return this.listPerson.slice(this.listPersonIndex*scrollNum,this.listPersonIndex*scrollNum+showRows);
    }
  },
  methods:{
    getPersons(){
      var param = {};
      // this.$http.getMockFile('mesSysMaintainSche_getList.json')
      this.$http.axios.post(`${this.$http.mes_url}mesSysMaintainSche/getList`,param,{
          headers: {
            showError: false,
            addLog: false
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
        if(this.listPerson.length>showRows){ // 启动轮播定时器
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
  }
}
</script>
<style>
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
</style>

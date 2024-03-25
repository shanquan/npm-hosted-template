<!--
@author: wang.weili
@since : 2024/03/19
-->
<template>
  <div class="pageView">
    <el-row>
      <el-button @click="goto(item.functionCode)" v-for="item in pvData" class="mt10" :key="item.$index">{{ item.functionName }}</el-button>
    </el-row>
    <chart-box ref="pvBar" :chart-data="pvDataFilter"></chart-box>
    <el-radio-group v-model="labelType" class="mt18">
      <el-radio-button label="0">显示功能名称</el-radio-button>
      <el-radio-button label="1">显示功能代码</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import chartBox from '@/components/Chart.vue'
export default {
  name: 'pageView',
  created(){
    this.refresh()
  },
  components: {
    chartBox
  },
  computed:{
    pvDataFilter(){
      return this.pvData.map(el=>{
        return {
          label: this.labelType=='0'?el.functionName:el.functionCode,
          "访问量": el.num
        }
      })
    }
  },
  data(){
    return {
      labelType:'0',
      pvData:[]
    }
  },
  methods:{
    toggleLabel(){
      this.isLabelName=!this.isLabelName
    },
    refresh(){
      this.pvData = []
      this.$http.axios.post('user/api/MesPageFrequencyUser/getPageFrequency',{"projectId":this.$http.project.id},{
        headers:{'showError': false}
      }).then(res => {
        this.pvData = res.BAR;
      })
    },
    resize(){
      this.$refs.pvBar.resize()
    },
    goto(path){
      this.$router.push({path:path});
    }
  }
}
</script>

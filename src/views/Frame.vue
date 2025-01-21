<!--
@author: wang.weili
@since : 2024/09/14
@deprecated 页面iframe不支持缓存，已弃用
@description: iframe集成Demo, BI报表 > 内部集成页面CQA
@sample: 
1. frame/http%3A%2F%2F10.12.4.119%3A8180%2Fwebroot%2Fdecision%2Flink%2FoWgO , http://10.12.4.119:8180/webroot/decision/link/oWgO
2. frame/http%3A%2F%2F10.12.5.99%2Fflames-web%2FCQAProductionDashboardFrame%3FprojectCode%3Dkirbyops%26projectId%3D183, http://10.12.5.99/flames-web/CQAProductionDashboardFrame?projectCode=kirbyops&projectId=183
3. frame/https%3A%2F%2Fereport.byd.com.cn%3A8181%2Fwebroot%2Fdecision%2Flink%2FsTAB, https://ereport.byd.com.cn:8181/webroot/decision/link/sTAB
4. frame/%2Fadmin%2FmesSysUsers%3FshowFrame%3Dfalse%26keep%3Dtrue
-->
<template>
  <iframe :src="url" id="extFrame"
      width="100%"
      height="100%"
      frameborder="0" scrolling="no"></iframe>
</template>

<script>
export default {
  name: 'frame',
  beforeRouteEnter(to, from, next){
    next(vm=>{
      vm.setUrl();
    })
  },
  beforeRouteUpdate(to, from, next){
    next();
    this.setUrl()
  },
  mounted(){},
  data() {
    return {
      url: ""
    }
  },
  methods:{
    setUrl(){
      if(this.$route.params.url){
        this.url = decodeURIComponent(this.$route.params.url);
        this.$nextTick(()=>{
          if(document.getElementById('extFrame')&&this.url!=document.getElementById('extFrame').src){
            document.getElementById('extFrame').src = this.url
          }
        })
      }
    }
  }
}
</script>
<style>
#extFrame{
  height: calc(100% - 50px)
}
</style>

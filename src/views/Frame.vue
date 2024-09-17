<!--
@author: wang.weili
@since : 2024/09/14
@description: iframe集成Demo
-->
<template>
  <iframe :src="url" id="extFrame"
      width="100%"
      height="100%"
      frameborder="0"></iframe>
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
    this.setUrl();
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
      }
    }
  }
}
</script>
<style>
#extFrame{
  height: calc(100% - 42px)
}
</style>

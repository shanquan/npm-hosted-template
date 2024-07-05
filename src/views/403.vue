<!--
@author: wang.weili
@since : 2021/1/15
-->
<template>
  <div class="error-wrapper">
    <div class="error-content">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="pic-error">
            <img src="~@/assets/403.png" alt="403">
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="bullshit">
            <div class="bullshit-oops">{{$t('L10501')}}</div>
            <div class="bullshit-headline">{{$t('L10502')}}</div>
            <div class="bullshit-info">{{$t('L10503')}}</div>
            <div class="bullshit-return-home router-link-active" @click="goHome">{{$t('L10504')}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'c403',
  methods: {
    goHome () {
      this.$router.push({ path: this.$root.homePath });
      if(this.$root.hasTabs){
        this.$root.$children[0].editableTabsValue = this.$root.homePath;
        this.$root.$children[0].editableTabs = this.$root.$children[0].editableTabs.filter((tab) => tab.path !== '/403');
      }
    }
  }
}
</script>
<style>
@import "../assets/error-page.css";
</style>

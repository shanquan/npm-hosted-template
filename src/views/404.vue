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
            <img src="~@/assets/404.png" alt="404">
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="bullshit">
            <div class="bullshit-oops">{{$t('L10501')}}</div>
            <div class="bullshit-headline">{{$t('L10505')}}</div>
            <div class="bullshit-info">{{$t('L10506')}}</div>
            <router-link class="bullshit-return-home" to="/">{{$t('L10504')}}</router-link>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'c404'
}
</script>

<style>
@import "../assets/error-page.css";
</style>

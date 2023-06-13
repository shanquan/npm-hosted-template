<!--
@author: wang.weili
@since : 2021/01/06
@description: 接口调用执行TOP10
-->
<template>
  <el-table
    header-row-class-name="rowh-a"
    row-class-name="row-a"
    :data="data"
    :loading="true"
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
      prop="name"
      :label="$t('L10227')"
      class-name="nowrap"
      :show-overflow-tooltip="true">
      <template slot-scope="scope">
        <router-link :to="scope.row.url" target="_blank" v-if="scope.$index<3">{{scope.row.name}}</router-link>
        <span v-else>{{scope.row.name}}</span>
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
      prop="time"
      :label="$t('L10229')"
      width="200"
      class-name="nowrap rtime">
      <template slot-scope="scope">
        <el-progress :stroke-width="17" :show-text="false" :color="scope.$index<3?'rgb(238,134,136)':'rgb(191,228,253)'" :percentage="Math.min(scope.row.time,10)*100/10"></el-progress>
        <span class="ml5">{{scope.row.time}}</span>
        <i :class="scope.row.upward?'el-icon-caret-top colorUp':'el-icon-caret-bottom colorDown'"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'apiTop',
  props: {
    data: Array
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

<!--
@author: wang.weili
@since : 2023/3/21
-->
<template>
  <el-menu :router="false" :default-active="$route.path" :unique-opened="true"  :collapse="isCollapse" :mode="menuMode" >
    <el-menu-item v-if="menuMode=='vertical'" index="" @click="menuChange()">
      <i class="el-icon-menu"></i>
      <span slot="title">{{$t('L00014')}}</span>
    </el-menu-item>
    <!-- <el-menu-item index="/">
      <i class="el-icon-star-on"></i>
      <span slot="title">首页</span>
    </el-menu-item> -->
    <el-menu-item v-if="!isCollapse&&menuMode=='vertical'">
      <el-select v-model="selected" placeholder="" clearable filterable @change="onSelectChange">
        <i slot="prefix" class="el-icon-search"></i>
        <el-option
          v-for="item in $root.$children[0].menuPages"
          :key="item.$index"
          :label="$t(item.index)"
          :value="item.index">
        </el-option>
      </el-select>
    </el-menu-item>
    <el-submenu v-for="(item,index) in menuList" :index="item.index" :key="index" :popper-class="item.hasLever3?'':'ovfauto'">
      <template slot="title">
        <img class="el-icon-i" v-if="item.iconAddress" :src="item.iconAddress"/>
        <i v-else :class="item.icon"></i>
        <span slot="title">{{$t(item.index)}}</span>
      </template>
      <div v-for="(subit,subidx) in item.subs" :key="subidx">
        <el-submenu v-if="subit.subs" :index="subit.index">
          <span slot="title">{{$t(subit.index)}}</span>
          <el-menu-item v-for="(sub2it,sub2idx) in subit.subs"
            @click="handleLink(sub2it)"
            :key="sub2idx" 
            :index="sub2it.index" :title="$t(sub2it.index)+' '+sub2it.index">{{$t(sub2it.index)}}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else 
          @click="handleLink(subit)"
          :index="subit.index" :title="$t(subit.index)+' '+subit.index">{{$t(subit.index)}}
          <!-- <a v-if="subit.index.startsWith('http')" :href="subit.index" target="_blank">{{$t(subit.index)}}</a>
          <router-link v-else :to="subit.index">{{$t(subit.index)}}</router-link> -->
        </el-menu-item>
      </div>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'mainMenu',
  props: {
    menuMode: String,
    menuList: Array
  },
  data(){
    return {
      selected: "",
    }
  },
  computed:{
    isCollapse(){
      return this.$store.state.menuCollapse
    },
  },
  methods:{
    menuChange(){
      this.$store.commit('changeMenu');
    },
    onSelectChange(){
      if(this.selected&&this.selected!=this.$root.$children[0].editableTabsValue){
        let path = this.selected.startsWith('/')?this.selected.substring(1):this.selected;
        this.goto(path);
        this.selected = "";
      }
    },
    handleLink(data) {
      let path = data.index.startsWith('/')?data.index.substring(1):data.index;
      this.goto(path);
    },
    goto(path){
        if(path.startsWith('http')){
          window.open(path,'_blank');
        }else if(path.startsWith('$')){ // $admin/abc -> /abc | $xyz/abc -> /xyz/abc
          let prefix = path.match(/^\$((?!\/).)*/)[0]?.substring(1);
          if(`/${prefix}/`==process.env.BASE_URL){
            path = path.substring(prefix.length+2)
            this.gotoRouter(path)
          }else{
            path = '/'+path.substring(1)
            window.location.href = path;
          }
        }else{
          this.gotoRouter(path)
        }
        if(this.$root.$children[0].hasTabs)
        this.$root.$children[0].addTab({name:`/${path}`,path:`/${path}`})
    },
    gotoRouter(path){
      // 查找指定路径的router
      let r = this.$router.matcher.match(path)
      if(r&&r.meta&&r.meta.blank){
        window.open(process.env.BASE_URL+path,'_blank');
      }else{
        this.$router.push({ path: `/${path}` });
      }
    }
  }
}
</script>
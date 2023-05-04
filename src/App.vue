<!--
@author: wang.weili
@since : 2020/11/26
@description: 框架公共文件，慎重修改
-->
<template>
  <el-container :class="[$app.mobileClass(),$i18n.locale,$root.theme]" style="height:100vh;">
    <!-- https://www.iconfont.cn/ -->
    <!-- <link
      rel="stylesheet"
      type="text/css"
      href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
    /> -->
    <Icons></Icons>
    <!-- web page header -->
    <el-header v-if="showFrame&&(pageType==0||pageType==1)" class="main">
      <div class="logo" :class="pageType==1||isCollapse||menuMode=='horizontal'?'':'logo-bg'">
        <img src="~@/assets/byd1.png" height="36" alt="BYD" class="header-logo" />
      </div>
      <main-menu v-if="pageType==0&&menuMode=='horizontal'" :menuList="$root.menuList" :menuMode="menuMode"></main-menu>
      <span class="notice" v-if="pageType==0&&noticeMsg"><i class="el-icon-message-solid"></i> {{$t('L10217')}}：<marquee>{{noticeMsg}}</marquee></span>
      <div class="ad">
        <!-- <span class="mr10">{{$root.project?$root.project.projectName:''}}</span> -->
        <el-select class="w100 mr10" v-model="systemCode">
          <el-option
              v-for="item in systemArr"
              :key="item.$index"
              :label="item.projectName"
              :value="item.id"
            ><a target="_self" :href="item.url?item.url+'?token='+$http.token+'&projectId='+item.id:'#'">{{item.projectName}}</a></el-option>
        </el-select>
        <el-avatar size="small" src="img/user.png"></el-avatar>
        <!-- <img width="24" height="24" src="images/person-outline.svg"/> -->
        <el-dropdown @command="handleDp" trigger="click">
          <span class="el-dropdown-link">
            {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="false&&pageType==0" command="chgMenuMode">{{$t('L10234')}}</el-dropdown-item>
            <el-dropdown-item command="switchVConsole">{{vConsoleVisible?$t('L10056'):$t('L10055')}}</el-dropdown-item>
            <el-dropdown-item command="chgPsw">{{$t('L00037')}}</el-dropdown-item>
            <el-dropdown-item command="logout">{{$t('L00015')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="false" @command="$root.handleLang" trigger="click">
          <span class="el-dropdown-link">
            <svg class="icon-inner">
              <use xlink:href="#language-outline"></use>
            </svg><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in $root.langOptions" :key="item.value" :command="item.value" :disabled="$i18n.locale == item.value">{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- mobile page header -->
    <el-header height="45px" class="mb-header" v-if="showFrame&&pageType==2"><el-page-header @back="goBack" :content="title"></el-page-header></el-header>
    <el-main>
    <!-- common parts -->
    <el-backtop target=".el-scroll" :bottom="100"></el-backtop>
    <audio id="passAudio" src="./assets/audio/startup.wav" hidden="true"></audio>
    <audio id="failAudio" src="./assets/audio/exclam.wav" hidden="true"></audio>
    <input id="copyIpt" type="text"/>
    <change-psw :dialogVisible="dialogVisible" @close="dialogVisible=false"></change-psw>
    <el-container :class="{ topper: pageType==2, frame: showFrame }">
      <!-- web side-menu -->
      <el-aside class="asidebg" v-if="showFrame&&this.pageType==0&&menuMode=='vertical'" style="width:auto">
        <main-menu :menuMode="menuMode" :menuList="$root.menuList"></main-menu>
        <div v-if="!isCollapse" class="footer asidebg">{{$t('L10210')}}：{{$root.getAppVersion()}}</div>
      </el-aside>
      <el-main class="el-scroll">
        <div class="mt10" v-if="showFrame&&noticeMsg&&pageType==1"><span class="notice"><i class="el-icon-message-solid"></i> {{$t('L10217')}}：<marquee>{{noticeMsg}}</marquee></span></div>
        <el-header height="46px" class="tab-head" v-if="showFrame&&this.pageType==0&&($route.path=='/'||hasTabs)">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
              @tab-click="link"
            >
            <el-tab-pane
                :label="$t('L00016')"
                name="/"
                class="unclosable"
                :closable="false"
              ></el-tab-pane>
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.$index"
                :label="$t(item.name)"
                :name="item.path"
              ></el-tab-pane>
            </el-tabs>
            <span v-if="hasTabs &&editableTabs.length" :title="$t('L10230')" @click="closeTabs"><i class="el-icon-circle-close"></i></span>
            <span v-else class="icon primary" @click="showHelpFn" :title="$t('L50109')"><i class="el-icon-question"></i></span>
          </el-header>
        <el-header height="38px" class="breadcrumbs-head" v-if="showFrame&&this.pageType==0&&$route.path!='/'&&hasBreadcrumb">
          <el-breadcrumb v-if="pageType!=2&&breadcrumbs.length" class="padding" separator-class="el-icon-arrow-right"  :class="hasTabs?'has-tabs':''">
            <el-breadcrumb-item :to="{ path: '/' }">{{$t('L00016')}}</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,idx) in breadcrumbs" :to="item.path?{path: item.path}:''" :key="idx">{{$t(item.index)}}</el-breadcrumb-item>
          </el-breadcrumb>
          <span class="icon primary" @click="showHelpFn" :title="$t('L50109')" v-if="showHelp"><i class="el-icon-question"></i></span>
        </el-header>
          <keep-alive :max="5">
            <router-view ref="rv" v-if="$route.meta.keepAlive" :class="viewClass"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" :class="viewClass"></router-view>
          <el-dialog :visible.sync="operationDialogVisible" width="50%">
            <div v-html="html"></div>
          </el-dialog>
      </el-main>
    </el-container>
    </el-main>
  </el-container>
</template>

<script>
import Icons from '@/components/Icons.vue';
import ChangePsw from '@/components/ChangePsw.vue';
import MainMenu from '@/components/MainMenu.vue';
export default {
  name: 'app',
  created(){
    document.addEventListener("deviceready", this.onDevReady, false);
    this.$root.getTheme();
    if(this.$http.token)
    try{
      let auth = JSON.parse(localStorage.getItem(`${process.env.VUE_APP_CODE}_Auth`))
      this.$root.auth = this.$root.deepClone(auth)
      this.$root.initSession(auth)
      this.$root.getAuthed = true
    }catch(e){console.log(e)}
  },
  mounted(){
    window.addEventListener('resize',()=>{
      this.$root.screenSize = document.documentElement.clientWidth+'*'+document.documentElement.clientHeight;
    });
  },
  components: {
    Icons,ChangePsw,MainMenu
  },
  watch:{
    $route: {
      async handler(nVal){
        this.showFrame = this.$http.token&&this.$route.meta.loginPass!=true&&this.$route.meta.showFrame!=false;
        this.$root.clearMsgBox();
        if(this.$root.getAuthed==undefined&&this.$http.token){
          this.$root.getAuthed = true;
          await this.$http.axios.get(`${this.$http.user_url}getAuthorityMenu?code=${this.$http.token}&projectId=${this.$http.projectId}`).then(response=>{
            let auth = response.DATA.AUTHORITIES
            this.$root.auth = this.$root.deepClone(auth)
            this.$root.initSession(auth)
          })
        }
        if(this.pageType==2)
        this.title = this.$root.getMobileTitle(nVal.path);
        //页面的breadcrumbs
        if(this.hasBreadcrumb)
        this.getBreadcrumbs(nVal);
        if(this.pageType == 0){
          // 路由权限拦截
          if(!nVal.meta.authPass)
          try{
            let p = this.$root.getMatchedPath(nVal);
            let authItem = this.$root.findMenuItem(p,this.$root.auth);
            if(!authItem&&this.$root.authCheck){
              this.$router.push({path:'/403'})
            }
          }catch(e){
            console.error(e)
          }
          if(!this.hasTabs){
            return;
          }
          // 初始tab显示
          if(this.editableTabsValue=="/"){
            let item = this.$root.findMenuItem(nVal.path,this.$root.menuList);
            // console.log(nVal.path,item)
            if(item){
              this.editableTabsValue = item.index;
              this.editableTabs = [{name:item.index,path:item.index}];
            }else if(nVal.path!="/login"){// 非菜单项页面
              let p = this.$root.getMatchedPath(nVal);
              this.editableTabsValue = nVal.path;
              this.editableTabs = [{name:p,path:nVal.path}];
            }
          }
          // 更新tab.path
          let tabIdx1 = this.editableTabs.findIndex(el=>el.path==this.editableTabsValue);
          let tabIdx2 = this.editableTabs.findIndex(el=>el.path==nVal.path);
          let menuIdx = this.menuPages.findIndex(el=>el.index==nVal.path);
          if(tabIdx1>-1){
            if(tabIdx2==-1&&menuIdx==-1){
              this.editableTabs[tabIdx1].path=nVal.path;
            }else if(menuIdx>-1){
              this.addTab({name:nVal.path,path:nVal.path})
            }
            this.editableTabsValue = nVal.path;
          }
        }
      }
    },
    // 统一设置监听窗口事件
    // '$root.screenSize':function(){
    //   let $tb = document.querySelector('.el-table');
    //   // 如果页面中有表格，且表格设置了Height属性
    //   if($tb&&Array.from($tb.classList).includes('el-table--scrollable-y'))
    //   this.$root.resizeTable();
    // }
  },
  computed:{
    isCollapse(){
      return this.$store.state.menuCollapse
    },
    pageType(){
      return this.$store.state.pageType
    },
    showHelp(){
      let menuIdx = this.menuPages.findIndex(el=>el.index==this.$route.path);
      return menuIdx!=-1||this.$route.path=='/'
    },
    menuPages(){
      return this.getMenuPages(this.$root.menuList)
    }
  },
  data(){
    return{
      user:this.$store.state.user,
      title:"",
      editableTabsValue: "/",
      editableTabs: [],
      noticeMsg: "", // 系统通知
      dialogVisible: false,
      breadcrumbs: [],
      operationDialogVisible: false,
      html: "",
      showFrame: false,
      systemCode:"",
      systemArr:[],
      hasBreadcrumb: this.$root.hasBreadcrumb,
      hasTabs: this.$root.hasTabs, 
      menuMode: 'vertical',
      vConsoleVisible: false
    }
  },
  methods:{
    getBreadcrumbs(nVal) {
      let breadcrumbs = [];
      let p = this.$root.getMatchedPath(nVal);
      let findMenu = false;
      let findIt = function(el) {
        if (findMenu) { return; }
        let idx = el.index.startsWith('/') ? el.index : '/' + el.index;
        if (idx == p) {
          findMenu = true;
        } else {
          if (el.subs) {
            let subCount = el.subs.length;
            let i=0;
            el.subs.forEach(it => {
              if (findMenu) { return; }
              i++;
              if(it.subs&&it.subs.length&&it.subs[0].isMenu){
                breadcrumbs.push({index: it.index})
              }else{
                breadcrumbs.push({index: it.index.startsWith('/') ? it.index : '/' + it.index});
              }
              findIt(it);
            });
            if ((i==subCount)&&(!findMenu)) { breadcrumbs.splice(breadcrumbs.length-1,1); }
          } else {
            breadcrumbs.splice(breadcrumbs.length-1,1);
          }
        }
      }
      this.$root.auth.forEach(el => {
        if (findMenu) { return; }
        findIt(el);
        this.breadcrumbs = breadcrumbs.map(el=>{
          el.index = this.$t(el.index);
          return el;
        });
      })
    },
    chgMenuMode(){
      if(this.menuMode == 'vertical'){
        this.$store.commit('changeMenu',false);
        this.menuMode = 'horizontal'
      }else{
        this.$store.commit('changeMenu',true);
        this.menuMode = 'vertical'
      }
    },
    logout(){
      this.closeTabs(true);
      this.$root.clearSession();
      this.$router.push('login');
    },
    chgPsw(){
      this.dialogVisible = true;
    },
    goBack(){
      this.$store.commit('setPageType',1)
      let index = this.$root.getMobileIndex(this.$route.name);
      const homePath = process.env.VUE_APP_HOME=='/'||!process.env.VUE_APP_HOME ? `/?index=${index}`: process.env.VUE_APP_HOME;
      this.$router.push({ path: homePath });
    },
    /**
     * 手动添加页面breadcrumbs，适用于authPass:true的页面
     */
    addBreadcrumb(route){
      let p = this.$root.getMatchedPath(route);
      if(this.hasBreadcrumb && p)
      this.breadcrumbs.push({
        index: this.$t(p)
      })
    },
    /**
     * 添加tab
     * @param {Object} targetName
     */
    addTab(targetName) {
      let tabIdx = this.editableTabs.findIndex(el=>el.name==targetName.name);
      if(tabIdx>-1){
        this.editableTabs[tabIdx].path = targetName.path;
      }else{
        this.editableTabs.push(targetName);
      }
      if (this.editableTabsValue != targetName.path) {
        this.editableTabsValue = targetName.path;
      }
    },
    /**
     * 删除tab
     * @param {Object} targetName
     */
    removeTab(targetName) {
      // see ref: https://github.com/vuejs/vue/issues/6509
      // 以下key仅支持当前页
      // let key = this.$refs.rv.$vnode.key == null
      //           ? this.$refs.rv.$vnode.componentOptions.Ctor.cid + (this.$refs.rv.$vnode.componentOptions.tag ? `::${this.$refs.rv.$vnode.componentOptions.tag}` : '')
      //           : this.$refs.rv.$vnode.key;
      try{
        let vm = this.$router.getMatchedComponents(targetName);
        if(vm&&vm[0]){
          let key = vm[0]._Ctor[0].cid;
          this.removeCache(key);
        }
      }catch(e){console.log(e)}

      let tabs = this.editableTabs;
      var nextTab = "";
      if (this.editableTabsValue === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            nextTab = tabs[index + 1] || tabs[index - 1] || {path:'/'};
          }
        });
      }
      if(nextTab){
        this.editableTabsValue = nextTab.path;
        this.$router.push({ path: nextTab.path });
      }
      this.editableTabs = tabs.filter((tab) => tab.path !== targetName);
    },
    /**
     * 移除keep-alive中的缓存组件
     */
    removeCache(key){
      let cache = this.$refs.rv.$vnode.parent.componentInstance.cache;
      let keys = this.$refs.rv.$vnode.parent.componentInstance.keys;
      if (cache[key])
      {
          if (keys.length) {
              var index = keys.indexOf(key);
              if (index > -1) {
                  keys.splice(index, 1);
              }
          }
          cache[key].componentInstance.$destroy();
          delete cache[key];
      }
    },
    /**
     * 点击切换路由
     * @param {Object} tab
     *
     */
    link(tab) {
      if (tab) {
        if (this.$router.currentRoute.fullPath == tab.name) return;
        this.$router.push(tab.name);
      }
    },
    /**
     * 获取所有index以`/`开头的菜单项
     * @param {Array} list as mobileList or menuList
     */
    getMenuPages(list){
        let res=[];
        let getPage=function(lst){
          lst.forEach(el=>{
            if(el.index.startsWith('/')){
              res.push(el)
            }
            if(el.subs&&el.subs.length){
              getPage(el.subs);
            }
          })
        }
        getPage(list);
        return res;
    },
    handleDp(command){
      if(this[command]&&typeof this[command]=="function")
      this[command]();
    },
    closeTabs(pushnone){
      this.editableTabs.forEach(tab=>{
        try{
          // 根据tab.path找到对应component并清除缓存
          let vm = this.$router.getMatchedComponents(tab.path);
          if(vm&&vm[0]){
            let key = vm[0]._Ctor[0].cid;
            this.removeCache(key);
          }
        }catch(e){console.log(e)}
      })
      this.editableTabs = [];
      this.editableTabsValue = '/';
      if(pushnone!==true)
      this.$router.push("/")
    },
    showHelpFn(){
      this.$http.showLoading = true;
      let title = this.$route.path=="/"?"web页面":this.$t(this.$route.path,'zh');
      this.$http.axios.get(`${this.$http.pre_url}mesSysWebhelp/getHtmlByTitle?title=${title}`,{
        headers: {
          showError: false
        }
      }).then(res=>{
        if(res.DATA===""){
          this.html = "<p align='center'>"+this.$t('L10232')+"</p>";
        }else{
          this.html = res.DATA;
        }
        this.operationDialogVisible = true;
      })
    },
    viewClass(){
      let className="main-view";
      if(this.pageType==0&&this.$root.hasTabs&&!this.$root.hasBreadcrumb){
        className="tab-view";
      }else if(this.pageType==0&&this.$root.hasBreadcrumb&&!this.$root.hasTabs&&this.$route.path!=='/'){
        className="breadcrumb-view";
      }else if(this.pageType==0&&this.$root.hasBreadcrumb&&this.$root.hasTabs){
        className=this.$route.path=='/'?'tab-view':'mix-view'
      }
      return className;
    },
    onDevReady(){
      this.$root.getMac();
      this.$app.devReady();
    },
    switchVConsole(){
      this.vConsoleVisible = !this.vConsoleVisible;
      if(window.vConsole){
        const $vc = document.getElementById('__vconsole');
        if(this.vConsoleVisible){
          $vc.style.display=""
        }else{
          // window.vConsole.destroy();
          $vc.style.display="none"
        }
      }else{
        this.$http.initVConsole()
      }
    }
  }
}
</script>
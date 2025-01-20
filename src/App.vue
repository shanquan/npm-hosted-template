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
        <!-- <span class="mr10">{{$http.project?$http.project.projectName:''}}</span> -->
        <el-select v-if="$root.showSysLink" class="w100 mr10" v-model="systemCode">
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
    <el-header height="45px" class="mb-header" v-if="showFrame&&pageType==2"><i v-if="false" class="el-icon-s-home" @click="goBack(true)"></i><el-page-header :class="$root.mbVersionPos" @back="goBack(true)" :content="title"></el-page-header></el-header>
    <el-main>
    <!-- common parts -->
    <el-backtop target=".el-scroll" :bottom="100"></el-backtop>
    <audio id="passAudio" src="./assets/audio/startup.wav" hidden="true"></audio>
    <audio id="failAudio" src="./assets/audio/exclam.wav" hidden="true"></audio>
    <input id="copyIpt" type="text"/>
    <change-psw :dialogVisible="dialogVisible" @close="dialogVisible=false"></change-psw>
    <el-container :class="{ topper: pageType==2, frame: showFrame, noframe: !showFrame }" :direction="pageType==0?'horizontal':'vertical'">
      <!-- web side-menu -->
      <el-aside class="asidebg" v-if="showFrame&&pageType==0&&menuMode=='vertical'" style="width:auto">
        <main-menu :menuMode="menuMode" :menuList="$root.menuList"></main-menu>
        <div v-if="!isCollapse" class="footer asidebg">{{$t('L10210')}}：{{appVersion}}</div>
      </el-aside>
      <el-main class="el-scroll">
        <div class="mt10" v-if="showFrame&&noticeMsg&&pageType==1"><span class="notice"><i class="el-icon-message-solid"></i> {{$t('L10217')}}：<marquee>{{noticeMsg}}</marquee></span></div>
        <el-header height="46px" class="tab-head" v-if="showFrame&&pageType==0&&(isHome||hasTabs)">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
              @tab-click="link"
            >
            <el-tab-pane
                :label="$t('L00016')"
                :name="homePath"
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
        <el-header height="38px" class="breadcrumbs-head" v-if="showFrame&&pageType==0&&!isHome&&hasBreadcrumb">
          <el-breadcrumb v-if="pageType!=2&&breadcrumbs.length" class="padding" separator-class="el-icon-arrow-right"  :class="hasTabs?'has-tabs':''">
            <el-breadcrumb-item :to="{ path: homePath }">{{$t('L00016')}}</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,idx) in breadcrumbs" :to="item.path?{path: item.path}:''" :key="idx">{{$t(item.index)}}</el-breadcrumb-item>
          </el-breadcrumb>
          <span class="icon primary" @click="showHelpFn" :title="$t('L50109')" v-if="showHelp"><i class="el-icon-question"></i></span>
        </el-header>
          <keep-alive :max="10" :include="kpRoutes">
            <router-view ref="rv" :class="viewClass" :key="$route.fullPath"></router-view>
          </keep-alive>
          <iframe v-for="(item,idx) in ifrList" v-show="$root.hasTabs&&item.path==editableTabsValue||!$root.hasTabs&&$route.path.startsWith('/frame')" :src="item.url" :key="idx" class="extFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
          <el-dialog :visible.sync="operationDialogVisible" width="50%">
            <div v-html="html"></div>
          </el-dialog>
      </el-main>
      <el-footer class="center" height="40" v-if="pageType==1&&isHome||(pageType==2&&$root.mbVersionPos=='bottom')">{{appVersion}}</el-footer>
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
    if(this.$root.localTheme){
      this.$root.setDefaultTheme();
    }else{
      this.$root.getTheme();
    }

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
        if(this.$route.query.showFrame=='false'&&this.$route.query.keep=='true')
        this.keepNoFrame = true
        this.showFrame = !this.keepNoFrame&&this.$http.token&&this.$route.meta.loginPass!=true&&this.$route.meta.showFrame!=false&&this.$route.query.showFrame!='false';
        this.$root.clearMsgBox();
        if(this.$http.token && this.$root.getAuthed==undefined){
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
        let p,authItem;
        try{
          p = this.$root.getMatchedPath(nVal);
          authItem = this.$root.findMenuItem(p,this.$root.auth);
          // 记录页面访问
          if(authItem&&this.$root.userMode=='mes'&&!this.$root.pvList.find(el=>el==authItem.code)){
            this.$root.pvList.push(authItem.code)
            const formData={
              functionCode: authItem.code,
              functionName: authItem.menuName,
              client: this.pageType == 0?'web':'mobile',
              projectId: this.$http.project.id,
              workNo: this.$store.state.user.workNo
            }
            this.$http.axios.post('user/api/MesPageFrequencyUser/save',formData,{
              headers:{
                showError: false
              }
            })
          }
        }catch(e){
          console.error(e)
        }
        if(this.pageType == 0){
          // 路由权限拦截
          if(this.$root.authCheck&&!nVal.meta.authPass&&!authItem)
          this.$router.push({path:'/403'})
          if(!this.hasTabs||this.$root.authCheck&&!nVal.meta.authPass&&!authItem){
            return;
          }
          // 初始tab显示
          if(this.editableTabsValue==this.homePath){
            let item = this.$root.findMenuItem(nVal.path,this.$root.menuList);
            if(item){
              this.editableTabsValue = item.index;
              this.editableTabs = [{name:item.index,path:item.index}];
            }else if(nVal.path!="/login"&&!this.isHome){// 非菜单项页面
              let p = this.$root.getMatchedPath(nVal);
              this.editableTabsValue = nVal.path;
              this.editableTabs = [{name:p,path:nVal.path}];
            }
          }
          // 更新tab.path
          let tabIdx1 = this.editableTabs.findIndex(el=>el.path==this.editableTabsValue);
          let tabIdx2 = this.editableTabs.findIndex(el=>el.path==nVal.fullPath);
          let p = this.$root.getMatchedPath(nVal);
          let tabIdx3 = this.editableTabs.findIndex(el=>el.name==p);
          let menuIdx = this.menuPages.findIndex(el=>el.index==nVal.fullPath);
          if(tabIdx1>-1){
            if(this.$root.addNewTabMode){
              if(tabIdx3==-1&&p&&p!=this.homePath){
                this.addTab({name:p,path:nVal.fullPath})
              }else if(tabIdx3>-1){
                this.editableTabs[tabIdx3].path = nVal.fullPath
              }
            }else{
              if(tabIdx2==-1&&menuIdx==-1){
                this.editableTabs[tabIdx1].path=nVal.fullPath;
              }else if(menuIdx>-1){
                this.addTab({name:nVal.path,path:nVal.fullPath})
              }
            }
            this.editableTabsValue = nVal.fullPath;
          }
        }
        
      }
    },
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
      return menuIdx!=-1||this.isHome
    },
    menuPages(){
      return this.getMenuPages(this.$root.menuList)
    },
    isHome(){
      return this.$route.path==this.homePath
    },
    kpRoutes(){
      let kps = [];
      this.editableTabs.forEach(el=>{
        const vm = this.$router.getMatchedComponents(el.path);
        const r = this.$router.matcher.match(el.path)
        if(vm&&vm[0]&&vm[0].name&&(r?.meta==undefined||r?.meta?.keepAlive!==false)){
          kps.push(vm[0].name)
        }
      })
      try{
          let cache = this.$refs.rv.$vnode.parent.componentInstance.cache;
          Object.keys(cache).forEach(k=>{
            if(cache[k]==null){
              delete cache[k]
            }
          })
          // console.log(kps,cache)
      }catch(e){console.log(e)}
      return kps
    },
    ifrList(){
      let res = []
      if(this.$root.hasTabs){
        res = this.editableTabs.filter(el=>{
          return el.name.startsWith('/frame')
        }).map(el=>{
          el.url = decodeURIComponent(el.path.substring(7));
          return el
        })
      }else if(this.$route.path.startsWith('/frame')){
        res = [{
          name: this.$route.path,
          url: decodeURIComponent(this.$route.path.substring(7))
        }]
      }
      return res
    }
  },
  data(){
    return{
      user:this.$store.state.user,
      title:"",
      homePath: this.$root.homePath || '/',
      editableTabsValue: this.$root.homePath || '/',
      editableTabs: [],
      noticeMsg: "", // 系统通知
      dialogVisible: false,
      breadcrumbs: [],
      operationDialogVisible: false,
      html: "",
      showFrame: false,
      keepNoFrame: false,
      systemCode:"",
      systemArr:[],
      hasBreadcrumb: this.$root.hasBreadcrumb,
      hasTabs: this.$root.hasTabs, 
      menuMode: 'vertical',
      vConsoleVisible: false,
      appVersion:this.$root.getAppVersion()
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
      this.$router.push('/login');
    },
    chgPsw(){
      this.dialogVisible = true;
    },
    goBack(isHome){
      if(isHome){
        this.$store.commit('setPageType',1)
        let index = this.$root.getMobileIndex(this.$route.name);
        const homePath = this.homePath=='/' ? `/?index=${index}`: this.homePath;
        this.$router.push({ path: homePath });
      }else{
        this.$router.go(-1)
      }
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
      let tabs = this.editableTabs;
      var nextTab = "";
      if (this.editableTabsValue === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            nextTab = tabs[index + 1] || tabs[index - 1] || {path:this.homePath};
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
    removeCache(path){
      // see ref: https://github.com/vuejs/vue/issues/6509
      // 以下key仅支持当前页
      // let key = this.$refs.rv.$vnode.key == null
      //           ? this.$refs.rv.$vnode.componentOptions.Ctor.cid + (this.$refs.rv.$vnode.componentOptions.tag ? `::${this.$refs.rv.$vnode.componentOptions.tag}` : '')
      //           : this.$refs.rv.$vnode.key;
      try{
        let cache = this.$refs.rv.$vnode.parent.componentInstance.cache;
        let keys = this.$refs.rv.$vnode.parent.componentInstance.keys;
        const pathIndex = keys.findIndex(el=>el==path);
        if(pathIndex>-1)
        keys.splice(pathIndex, 1);
        if(cache[path]){
          cache[path].componentInstance.$destroy();
          delete cache[path];
        }
        // console.log(cache,keys)
      }catch(e){console.log(e)}
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
      this.editableTabs = [];
      this.editableTabsValue = this.homePath;
      if(pushnone!==true)
      this.$router.push(this.homePath)
    },
    showHelpFn(){
      this.$http.showLoading = true;
      let title = this.isHome?this.$t(this.$root.menuRoot,'zh-CN'):this.$t(this.$route.path,'zh-CN');
      this.$http.axios.get(`${this.$http.mes_url}mesSysWebhelp/getHtmlByTitle?title=${title}`,{
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
      }else if(this.pageType==0&&this.$root.hasBreadcrumb&&!this.$root.hasTabs&&!this.isHome){
        className="breadcrumb-view";
      }else if(this.pageType==0&&this.$root.hasBreadcrumb&&this.$root.hasTabs){
        className=this.isHome?'tab-view':'mix-view'
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
<!--
@author: wang.weili
@since : 2024/03/19
-->
<template>
  <div class="commonList">
    <el-form ref="form" :inline="true" label-position="right" :model="form" class="form-bar" :label-width="config.labelWidth">
      <el-form-item class="inline-form input-outline-x" v-for="item in querysFilter"
        :key="item.$index">
        <el-input v-if="!item.type||['number','textarea','slider','color'].includes(item.type)" 
          :type="['number','textarea'].includes(item.type)?item.type:'text'"
          :placeholder="item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)"
          :rows="1"
          resize="none"
          v-model="form[item.value]" clearable>
          <template :slot="item.type=='textarea'?'label':'prefix'">{{item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)}}</template>
        </el-input>
        <el-select 
          v-if="!item.queryUrl&&!item.remoteUrl&&item.options&&['select','radio','check','switch'].includes(item.type)" 
          v-model="form[item.value]"
          :placeholder="item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)"
          clearable>
          <template slot="prefix">{{item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)}}</template>
          <el-option
            v-for="op in item.options"
            :key="op.$index"
            :label="op.label?$t(`${config.model}.${op.label}`):$t(`${config.model}.${op.value}`)"
            :value="op.value">
          </el-option>
        </el-select>
        <!-- el-select filter 有小bug -->
        <el-select @focus="focusEl=item.value" 
          v-if="(item.queryUrl||item.remoteUrl||item.source)&&['select','radio','check','switch'].includes(item.type)" v-model="form[item.value]" 
          :multiple="item.multiple?true:false" collapse-tags 
          :filterable="item.queryUrl||item.remoteUrl?true:false" :filter-method="item.queryUrl?filterMethod:null" 
          :remote="item.remoteUrl?true:false" :remote-method="item.remoteUrl?remoteMethod:null" 
          :placeholder="item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)"
          clearable>
          <template slot="prefix">{{item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)}}</template>
          <el-option
            v-for="op in item.source?$root[item.source]:item.options"
            :key="op.$index"
            :label="op.label?$t(op.label):$t(op.value)"
            :value="op.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="item.type=='datetimerange'"
          v-model="form[item.type]"
          :start-placeholder="$t('createTime')"
          value-format="yyyy-MM-dd"
          type="datetimerange">
          <template slot="prefix">{{$t('createTime')}}</template>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showQueryCollapse" class="colbtn" @click="queryCollapse=!queryCollapse">{{ queryCollapse?'展开':'收起'}}<i class="el-icon--right" :class="queryCollapse?'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-button>
        <el-button type="primary" @click="search()">{{$t('L00002')}}</el-button>
        <el-button type="primary" @click="reset()">{{$t('L00013')}}</el-button>
        <el-button v-if="auth.add" type="primary" @click="goto(null, 'add')"
          >{{$t('L00005')}}</el-button>
        <el-button v-if="auth.delete" type="primary" @click="dels()">{{$t('L00004')}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="auth.export" icon="el-icon-download" @click="exportExcel()">{{$t('L00008')}}</el-button>
        <el-upload v-if="auth.add"
          class="import-btn"
          :action="uploadUrl"
          name="excelFile"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :limit="1"
          :show-file-list="false"
          :on-success="onUploadSuccess"
          :on-error="onUploadError"
          :before-upload="beforeUpload">
          <el-button :disabled="!enabledUploadBtn" :icon="enabledUploadBtn?'el-icon-upload':'el-icon-loading'" slot="trigger">{{enabledUploadBtn?this.$t('L00009'):this.$t('L00024')}}</el-button>
        </el-upload>
        <el-link v-if="auth.add" class="ml10" type="primary" href="./mock/export.xlsx" download='export.xls'
          >{{$t('L00018')}}</el-link>
      </el-form-item>
    </el-form>
    <a id="aExport" href="#" class="hide"></a>
    <!--表格 -->
    <el-table
      stripe
      border
      height="300"
      :data="list"
      @selection-change="handleSelectionChange"
      ref="table"
      style="width: 100%">
      <el-table-column v-if="auth.delete" align="center" type="selection" fixed="left" width="40">
      </el-table-column>
      <el-table-column v-if="config.showIndex" align="center" type="index" :index="indexMethod"  fixed="left" :label="$t('id')" width="50">
      </el-table-column>
      <el-table-column v-if="auth.detail||auth.edit||auth.delete" align="center" fixed="left" :label="$t('L00019')" width="90">
        <template slot-scope="scope">
          <el-button v-if="auth.detail" @click="goto(scope.row,'detail')" plain type="text" icon="el-icon-setting" size="medium"></el-button>
          <el-button v-if="auth.edit" @click="goto(scope.row,'edit')" type="text" icon="el-icon-edit" size="medium"></el-button>
          <el-button v-if="auth.delete" @click="del(scope.row)" type="text" icon="el-icon-delete" size="medium"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in columnList"
        :fixed="item.fixed"
        :key="item.$index"
        :prop="item.value"
        :sortable="item.sortable"
        :formatter="formatter"
        :label="item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)"
        :show-overflow-tooltip="true"
        :class-name="item.width ? '' : 'nowrap'"
        :width="item.width ? item.width : ''"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
    :page-sizes="$root.pageList" :page-size="pageSize" :layout="$app.isMobile()?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
    :total="total">
    </el-pagination>
    <el-dialog v-if="dialogMode"
    :visible.sync="dlgShow"
    width="50%">
      <item ref="dlgCom" :ptype="dlgType" :pid="dlgId" @onCancel="dlgShow=false"></item>
    </el-dialog>
  </div>
</template>

<script>
let MODELDATA;
import item from "./Item.vue";
export default {
  name: 'commonList',
  created(){
    this.getAuth();
    this.$http.getMockFile('model.json').then(res=>{
      MODELDATA = res.DATA;
      let querys = MODELDATA.common.filter(el=>el.queryable==true&&!['time','date','datetime'].includes(el.type));
      querys.forEach(el=>{
        if(['time','date','datetime'].includes(el.type)&&!this.form.datetimerange){
          this.$set(this.form,'datetimerange',[])
        }else{
          this.$set(this.form,el.value,"")
        }
      })
      this.querys = querys
      if(MODELDATA.common.find(el=>el.queryable==true&&['time','date','datetime'].includes(el.type))){
        querys.push({"value":"datetimerange","type":"datetimerange"});
        if(MODELDATA['zh-CN']&&!this.$i18n.messages['zh-CN'][this.config.model])
        MODELDATA['zh-CN'].datetimerange = "日期"
        if(MODELDATA['en-US']&&!this.$i18n.messages['en-US'][this.config.model])
        MODELDATA['en-US'].datetimerange = "DatetimeRange"
      }
      try{
        let langs={};
        if(MODELDATA['zh-CN']&&!this.$i18n.messages['zh-CN'][this.config.model]){
          langs[this.config.model] = MODELDATA['zh-CN']
          this.$i18n.mergeLocaleMessage('zh-CN', langs);
        }
        if(MODELDATA['en-US']&&!this.$i18n.messages['en-US'][this.config.model]){
          langs[this.config.model] = MODELDATA['en-US']
          this.$i18n.mergeLocaleMessage('en-US', langs);
        }
      }catch(e){
        console.log(e)
      }
      if(MODELDATA.config){
        Object.assign(this.config,MODELDATA.config)
      }
      if(MODELDATA.uploadUrl){
        this.uploadUrl = this.$http.baseUrl + MODELDATA.uploadUrl
      }
      if(MODELDATA.downloadUrl){
        this.downloadUrl = this.$http.baseUrl + MODELDATA.downloadUrl
      }
      this.columnList = MODELDATA.common.concat(MODELDATA.suffix);
      MODELDATA.common.filter(el=>el.queryUrl).forEach(el=>{
        this.$http.axios.post(el.queryUrl).then(res=>{
          this.options[el.value] = res.DATA.map(it=>{
            return el.lv&&el.lv.length>1?{
              label: it[el.lv[0]],
              value: it[el.lv[1]]
            }:it
          })
          el.options = this.options[el.value].slice(0,30)
        })
      })
      this.getPage();
      this.$nextTick(()=>{this.$root.resizeTable();})
    })
    
  },
  components:{
    item
  },
  watch:{
    '$root.screenSize':function(){
      this.$root.resizeTable();
    }
  },
  mounted(){
    this.$nextTick(()=>{
      if(this.dialogMode){
        document.querySelector('.tab-view .el-tabs__header').classList.add('hide')
      }
    })
  },
  computed:{
    showQueryCollapse(){
      return this.querys.length>=this.$root.minQueryNum
    },
    querysFilter(){
      return this.queryCollapse?this.querys.slice(0,this.$root.minQueryNum):this.querys
    }
  },
  data(){
    return{
      dialogMode: this.$root.dialogMode,
      form:{},
      config:{
        showIndex: true,
        model: this.$route.params.model,
        modelUrl: this.$http.app_url + this.$route.params.model,
        labelWidth:"",
      },
      uploadUrl: `${this.$http.baseUrl}${this.$http.app_url + this.$route.params.model}/importExcel`,
      downloadUrl: `${this.$http.baseUrl}${this.$http.app_url + this.$route.params.model}/exportExcel`,
      enabledUploadBtn: true,
      querys:[],
      queryCollapse:true,
      options:{},
      focusEl:null,
      columnList:[],
      list: [],
      checkedIds:[],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dlgShow: false,
      dlgType: "add",
      dlgId: -1,
      auth: {
        "add": false||!this.$root.authCheck,
        "edit": false||!this.$root.authCheck,
        "delete": false||!this.$root.authCheck,
        "export": false||!this.$root.authCheck,
        "detail": false||!this.$root.authCheck
      }
    }
  },
  methods:{
    search() {
      this.currentPage = 1;
      this.getPage();
    },
    reset(){
      Object.keys(this.form).forEach(el=>{
        this.form[el] = ""
      })
    },
    getAuth(){
      let pageAuth = this.$root.findMenuItem(this.$route.path,this.$root.auth);
      if(pageAuth&&pageAuth.subs&&pageAuth.subs.length){
        pageAuth.subs.forEach(el=>{
          let authTag = el.index.startsWith('/')?el.index.substring(1):el.index;
          authTag = authTag.split('/');
          authTag = authTag.length>2?authTag[2]:authTag[1];
          this.auth[authTag] = true;
        })
      }
    },
    getPage() {
      var formParams = {};
      if(this.form.datetimerange&&this.form.datetimerange.length){
        formParams.startDateTime=this.form.datetimerange[0];
        formParams.endDateTime=this.form.datetimerange[1];
      }
      for (let key in this.form) {
        if(this.form[key]!==""&&key!='datetimerange')
        formParams[key] = this.form[key]
      }
      this.list = [];
      this.$http
        .getPage(this.config.modelUrl, formParams, this.currentPage, this.pageSize)
        .then((response) => {
          this.list = response.DATA;
          this.total = response.TOTAL;
        });
    },
    goto(row, type) {
      this.dlgType = type
      this.dlgId = row && row.id!=undefined? row.id : -1;
      if(this.dialogMode){
        this.dlgShow = true;
        this.$nextTick(()=>{
          this.$refs.dlgCom.onReset();
          this.$refs.dlgCom.init()
        })
      }else{
        let tab = this.$root.$children[0].editableTabs.find(el=>el.name==`/item/${this.config.model}/${type}`);
        if(tab)
        this.$root.$children[0].removeCache(tab.path)
        if (row && row.id!=undefined) {
          this.$router.push({ path: `/item/${this.config.model}/${type}/${row.id}` });
        } else {
          this.$router.push({ path: `/item/${this.config.model}/${type}` });
        }
      }
    },
    formatter(row,column,cellVal){
      let sourceValues = MODELDATA.common.filter(el=>el.source).map(el=>el.value);
      let optionsValues = MODELDATA.common.filter(el=>el.options).map(el=>el.value);
      if(sourceValues.includes(column.property)){
        let sourceItem = MODELDATA.common.find(el=>el.value==column.property).source
        let sop = this.$root[sourceItem].find(it=>it.value==cellVal);
        if(sop)
        return sop.label?this.$t(sop.label):this.$t(sop.value);
      }
      if(optionsValues.includes(column.property)){
        let options = MODELDATA.common.find(el=>el.value==column.property).options
        let top = options.find(it=>it.value==cellVal);
        if(top)
        return top.label?this.$t(`${this.config.model}.${top.label}`):this.$t(`${this.config.model}.${top.value}`);
      }
      return cellVal
    },
    filterMethod(qs){
      let item = MODELDATA.common.find(el=>el.value==this.focusEl)
      item.options = qs ? this.options[this.focusEl].filter(el=>{return el.label?el.label.indexOf(qs)>-1:el.value.indexOf(qs)>-1}).slice(0,30):this.options[this.focusEl].slice(0,30)
      this.$forceUpdate();
    },
    remoteMethod(qs) {
      let item = MODELDATA.common.find(el=>el.value==this.focusEl)
      let param = {
        "currentPageNo": 1,
        "pageSize": 30
      }
      if(qs){
        if(item.lv&&item.lv.length>1){
          param[item.lv[0]] = qs
        }else if(item.label){
          param.label = qs
        }else{
          param.value = qs
        }
        this.$http.axios.post(item.remoteUrl,param).then(res=>{
          item.options = res.DATA.map(it=>{
            return item.lv&&item.lv.length>1?{
              label: it[item.lv[0]],
              value: it[item.lv[1]]
            }:it
          })
          this.$forceUpdate()
        })
      }
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    },
    handleSelectionChange(val) {
      this.checkedIds = val.map((el) => el.id);
    },
    del(item) {
      this.$confirm(`${this.$t('L00025')}`, this.$t('L00010'), {
        confirmButtonText: this.$t('L00004'),
        type: "warning",
      }).then(() => {
        this.$http.removeById2(this.config.modelUrl, item.id).then(() => {
          this.currentPage = 1;
          this.getPage();
        });
      });
    },
    dels() {
      if (this.checkedIds.length) {
        this.$confirm(`${this.$t('L00026')}`, this.$t('L00010'), {
          confirmButtonText: this.$t('L00027'),
          type: "warning",
        }).then(() => {
          this.$http
            .removeListId(this.config.modelUrl, this.checkedIds.join(","))
            .then(() => {
              this.currentPage = 1;
              this.getPage();
            });
        });
      } else {
        this.$message.error(this.$t('L00022'));
      }
    },
    exportExcel() {
      if(!this.$root.checkParams(this.form)){
        this.$message.error(this.$t('L10057'));
        return false;
      }
      let formParams = "";
      let downloadUrl = "#";
      let $a = document.getElementById('aExport');
      if(this.$http.mock){
        downloadUrl = `${window.location.origin}${process.env.BASE_URL}mock/export.xlsx`; 
        $a.download = "export.xlsx";
      }else{
        // for(let key in this.form){
        //   if(this.form[key])
        //   formParams += "&"+key+"="+this.form[key].trim()
        // }
        if(this.form.name)
        formParams += "&name="+this.form.name.trim()
        if(this.form.version)
        formParams += "&version="+this.form.version.trim()
        downloadUrl = `${this.downloadUrl}?token=${this.$http.token}${encodeURI(formParams)}`;
      }
      $a.href = downloadUrl;
      $a.click();
    },
    // post方法导出
    exportExcelWithPost(){
      if(!this.$root.checkParams(this.form)){
        this.$message.error(this.$t('L10057'));
        return false;
      }
      let formParams = "";
      for(let key in this.form){
        if(this.form[key])
        formParams += "&"+key+"="+this.form[key].trim()
      }
      this.$http.axios.post(this.downloadUrl,formParams).then(res =>{
        const blob = new Blob([res])
        let $a = document.getElementById('aExport');
        $a.download = "export.xlsx";
        $a.href = URL.createObjectURL(blob);
        $a.click();
      })
    },
    onUploadSuccess(response, file, fileList) {
      this.enabledUploadBtn = true;
      if (response.RESULT === "PASS") {
        this.$message({
          message: file.name.concat(this.$t('L00031'), response.MESSAGE, this.$t('L00032')),
          type: "success"
        });
        this.currentPage = 1;
        this.getPage();
      }else{
        this.$message.error(file.name.concat(`${this.$t('L00030')}，`, response.MESSAGE));
      }
      fileList.splice(0);
    },
    onUploadError(err, file){
      this.enabledUploadBtn = true;
      this.$message.error(file.name.concat(`${this.$t('L00030')}，`, err));
    },
    beforeUpload(file) {
      const isExcel = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isExcel) {
        this.$message.error(this.$t('L00028'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('L00029'));
      }
      if(isExcel && isLt2M){
        this.enabledUploadBtn = false;
      }
      return isExcel && isLt2M;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPage();
    }
  }
}
</script>
<style lang="css" scoped>
.colbtn{padding:7px}
</style>

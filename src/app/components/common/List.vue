<!--
@author: wang.weili
@since : 2024/03/19
-->
<template>
  <div class="commonList">
    <el-form :inline="true" label-position="right" :model="form" class="form-bar">
      <el-form-item v-for="item in querys"
        :key="item.$index"
        :label="item.label?$t(item.label):$t(item.value)">
        <el-input v-if="!item.type||item.type=='number'||item.type=='textarea'" 
          :type="item.type" 
          v-model="form[item.value]" clearable></el-input>
        <el-select v-if="item.type=='select'||item.type=='radio'" v-model="form[item.value]" clearable>
          <el-option
            v-for="op in item.options||$root[item.source]"
            :key="op.$index"
            :label="op.label?$t(op.label):$t(op.value)"
            :value="op.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">{{$t('L00002')}}</el-button>
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
      <el-table-column
        v-for="item in columnList"
        :fixed="item.fixed"
        :key="item.$index"
        :prop="item.value"
        :formatter="formatter"
        :label="item.label?$t(item.label):$t(item.value)"
        :show-overflow-tooltip="true"
        :class-name="item.width ? '' : 'nowrap'"
        :width="item.width ? item.width : ''"
        align="center">
      </el-table-column>
      <el-table-column v-if="auth.delete" fixed="left" type="selection" width="40">
      </el-table-column>
      <el-table-column v-if="auth.detail||auth.edit||auth.delete" fixed="left" :label="$t('L00019')" width="90">
        <template slot-scope="scope">
          <el-button v-if="auth.detail" @click="goto(scope.row,'detail')" plain type="text" icon="el-icon-setting" size="medium"></el-button>
          <el-button v-if="auth.edit" @click="goto(scope.row,'edit')" type="text" icon="el-icon-edit" size="medium"></el-button>
          <el-button v-if="auth.delete" @click="del(scope.row)" type="text" icon="el-icon-delete" size="medium"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
    :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
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
      try{
        if(MODELDATA['zh-CN'])
        this.$i18n.mergeLocaleMessage('zh-CN', MODELDATA['zh-CN'])
        // let langs={};
        // if(MODELDATA['zh-CN']&&!this.$i18n.messages['zh-CN'][this.model]){
        //   langs[this.model] = MODELDATA['zh-CN']
        //   this.$i18n.mergeLocaleMessage('zh-CN', langs);
        // }
        // if(MODELDATA['en-US']&&!this.$i18n.messages['en-US'][this.model]){
        //   langs[this.model] = MODELDATA['en-US']
        //   this.$i18n.mergeLocaleMessage('en-US', langs);
        // }
      }catch(e){
        console.log(e)
      }
      // @todo
      // this.uploadUrl = this.$http.baseUrl + this.$http.app_url + `${this.$route.params.model}/importExcel`;
      this.querys = MODELDATA.common.filter(el=>el.queryable==true);
      this.columnList = MODELDATA.common.concat(MODELDATA.suffix);
      this.typeOptions = MODELDATA.typeOptions;
      this.getPage();
    })
    
  },
  components:{
    item
  },
  mounted(){
    this.$nextTick(()=>{
      this.$root.resizeTable();
      if(this.dialogMode){
        document.querySelector('.tab-view .el-tabs__header').classList.add('hide')
      }
    })
  },
  data(){
    return{
      dialogMode: this.$root.dialogMode,
      form:{
        name: "",
        version: "",
        status: "",
        type: ""
      },
      model: this.$route.params.model,
      modelUrl: this.$http.app_url + this.$route.params.model,
      uploadUrl: `${this.$http.baseUrl}${this.$http.app_url + this.$route.params.model}/importExcel`,
      downloadUrl: `${this.$http.baseUrl}${this.$http.app_url + this.$route.params.model}/exportExcel`,
      enabledUploadBtn: true,
      querys:[],
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
      for (let key in this.form) {
        if(this.form[key]!=="")
        formParams[key] = this.form[key]
      }
      this.list = [];
      this.$http
        .getPage(this.modelUrl, formParams, this.currentPage, this.pageSize)
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
        let tab = this.$root.$children[0].editableTabs.find(el=>el.name==`/${this.model}/${type}`);
        if(tab)
        this.$root.$children[0].removeCache(tab.path)
        if (row && row.id!=undefined) {
          this.$router.push({ path: `/item/${this.model}/${type}/${row.id}` });
        } else {
          this.$router.push({ path: `/item/${this.model}/${type}` });
        }
      }
    },
    formatter(row,column,cellVal){ // @todo
      if(column.property=='status'){
        let sop = this.$root.statusOptions.find(it=>it.value==cellVal);
        if(sop)
        return this.$t(sop.label);
      }
      if(column.property=='type'){
        let top = this.typeOptions.find(it=>it.value==cellVal);
        if(top)
        return this.$t(top.label);
      }
      return cellVal
    },
    handleSelectionChange(val) {
      this.checkedIds = val.map((el) => el.id);
    },
    del(item) {
      this.$confirm(`${this.$t('L00025')}`, this.$t('L00010'), {
        confirmButtonText: this.$t('L00004'),
        type: "warning",
      }).then(() => {
        this.$http.removeById2(this.modelUrl, item.id).then(() => {
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
            .removeListId(this.modelUrl, this.checkedIds.join(","))
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

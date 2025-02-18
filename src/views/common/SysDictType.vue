<!--
@author     : linzhijian
@since      : 2022-06-08 16:38:29
@description: 字典类型表
-->
<template>
  <div class="sysDictType">
    <el-form :inline="true" ref="queryForm" label-position="right" :model="queryForm" label-width="80px"
      class="form-bar search-form-bar">


      <el-form-item v-if="showSys" :label="$t('sysName')" class="inline-form" prop="sysCode">
        <el-select :clearable="true" v-model="queryForm.sysCode" filterable @change="getProjectList(queryForm.sysCode)">
          <el-option v-for="(item,index) in sysCodeDictList" :key="index" :label="item.dictLabel"
                     :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('projectName')" class="inline-form" prop="projectId">
        <el-select :disabled="!showSys" v-model="queryForm.projectId" :clearable="true" filterable>
          <el-option v-for="(item,index) in allProjectList" :key="index" :label="item.dictLabel"
                     :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>



      <el-form-item :label="$t('dictName')" class="inline-form" prop="dictName">
        <el-input :clearable="true" v-model="queryForm.dictName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('dictType')" class="inline-form" prop="dictType">
        <el-input :clearable="true" v-model="queryForm.dictType"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button v-preventReClick="3000" @click="search" type="primary" icon="el-icon-search">{{ $t('L00002') }}
        </el-button>
        <el-button @click="reset" icon="el-icon-refresh-right">{{ $t('L00013') }}</el-button>
        <el-button v-if="auth.add" @click="add" icon="el-icon-plus" type="primary">{{ $t('L00005') }}</el-button>
        <!-- <el-button v-if="auth.delete" @click="del()" icon="el-icon-delete" type="primary">{{ $t('L00004') }}</el-button> -->
        <el-button v-if="auth.refresh" @click="refreshCache()" icon="el-icon-refresh" type="success">{{ $t('L20422') }}
        </el-button>
      </el-form-item>
      <el-form-item class="button-form-item">
        <el-button v-if="auth.export" v-preventReClick="3000" type="primary" icon="el-icon-download"
          @click="exportExcel()">
          {{ $t('L00008') }}
        </el-button>
      </el-form-item>
    </el-form>


    <a id="aExport" href="#" class="hide"></a>
    <!-- 表格 -->
    <el-table header-row-class-name="nowrap" stripe border height="300" @selection-change="handleSelectionChange"
      :data="list" :loading="true">
      <!-- <el-table-column fixed="left" type="selection" width="50"></el-table-column> -->
      <el-table-column show-overflow-tooltip align="center" fixed="left" prop="sysCode" :label="$t('sysName')"  width="150">
        <template slot-scope="{ row }">
           <span>{{ getLabelByList(sysProjectIdSysNameDictList,row.projectId)}}</span><!--根据projectId获取系统名称 -->
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" fixed="left" prop="projectId" :label="$t('L30194')" width="150">
        <template slot-scope="{ row }">
          <span>{{row.projectName}}</span>
        </template>
      </el-table-column>


     <!-- <el-table-column :label="$t('dictId')" align="center" prop="dictId" width="100" />-->
      <el-table-column show-overflow-tooltip align="center" fixed="left" prop="dictName" :label="$t('dictName')" width="180">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center"  fixed="left"  prop="dictType" :label="$t('dictType')" width="200">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="isPublic" :label="$t('property')" :formatter="propertyFormat" width="70">
      </el-table-column >
      <el-table-column show-overflow-tooltip align="center" prop="createBy" :label="$t('createName')" width="100">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="createTime" :label="$t('createTime')" width="150">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="updateBy" :label="$t('updateName')" width="100">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="updateTime" :label="$t('updateTime')" width="150">
      </el-table-column>


      <el-table-column v-if="auth.edit || auth.delete" align="center" fixed="right" :label="$t('L00019')" width="300">
        <template slot-scope="scope">
          <el-button v-if="auth.edit" @click.native="edit(scope.row)" :title="$t('L00003')" type="text" size="small"
            icon="el-icon-edit">{{$t('LCM0040')}}</el-button>
          <el-button v-if="auth.delete" @click.native="del(scope.row)" :title="$t('L00004')" type="text" size="small"
            icon="el-icon-delete">{{$t('LCM0041')}}</el-button>
          <el-button v-if="auth.config" @click.native="config(scope.row)" :title="$t('L00051')" type="text" size="small"
            icon="el-icon-s-tools">{{$t('LCM0029')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: center" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">


        <el-form-item v-if="showSys" :label="$t('sysName')" class="inline-form" prop="sysCode">
          <el-select :clearable="true" v-model="form.sysCode" filterable @change="getProjectList(form.sysCode,true)">
            <el-option v-for="(item,index) in sysCodeDictList" :key="index" :label="item.dictLabel"
                       :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('projectName')" class="inline-form" prop="projectId">
          <el-select :disabled="!showSys" v-model="form.projectId" :clearable="true" filterable>
            <el-option v-for="(item,index) in allProjectList_dlg" :key="index" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('dictName')" prop="dictName">
          <el-input v-model="form.dictName" @change="handleChange"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dictType')" prop="dictType">
          <el-input v-model="form.dictType" @change="handleChange"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit()">{{ $t('L00006') }}</el-button>
        <el-button @click="cancel">{{ $t('L30082') }}</el-button>
      </div>
    </el-dialog>

    <sysDictData ref="sysDictData" :dictType="dictType" v-if="showDrawer"></sysDictData>
  </div>
</template>

<script>
import Vue from 'vue'
import {sysProject} from './sysProjectMinix';
import dictApi from './util.js'
import SysDictData from './SysDictData.vue';
Vue.use(dictApi)
let loading;
export default {
  components: {
    SysDictData
  },
  mixins:[sysProject],
  name: "sysDictType",
  created() {
    this.downloadUrl = this.$http.baseUrl + `${this.$http.project}/common/api/sysDictType/`;
    this.getAuth(this.$route.path);
    this.uploadUrl = this.$http.baseUrl.concat(`${this.$http.project}/common/api/sysDictType/importExcel?token=`, this.$http.token);
    this.getSysProjectPromise.then(()=>{
      this.allProjectList = this.projectDictList
      this.allProjectList_dlg = this.$root.deepClone(this.projectDictList)
      this.form.projectId = this.$http.project.id
      this.queryForm.projectId = this.$http.project.id
      this.getPage()
    })
  },
  watch: {
    '$root.screenSize': function () {
      this.$root.resizeTable();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$root.resizeTable();
    })
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      form: {
        dictId: '',
        dictName: '',
        dictType: '',
        status: "0",
        remark: '',
      },
      dictType: 0,
      showDrawer: false,
      uploadUrl: "",
      checkedIds: [],
      changeCount: 0,
      auth: {
        "add": false || !this.$root.authCheck,
        "edit": false || !this.$root.authCheck,
        "export": false || !this.$root.authCheck,
        "delete": false || !this.$root.authCheck
      },
      downloadUrl: "",
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      // 表单校验
      rules: {
        sysCode: [
          { required: true, message: `${this.$t('L2023082301')}`, trigger: "blur" }
        ],
        projectId: [
          { required: true, message: `${this.$t('L2023082302')}`, trigger: "blur" }
        ],
        dictName: [
          { required: true, message: this.$t('LCM0042'), trigger: "blur" }
        ],
        dictType: [
          { required: true, message: this.$t('LCM0043'), trigger: "blur" }
        ]
      },
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        dictName: '',
        dictType: '',
        status: '',
      },
      allProjectList:[],
      allProjectList_dlg:[]
    }
  },
  methods: {
    getAuth(val) {
      let pageAuth = this.$root.findMenuItem(val, this.$root.auth);
      if (pageAuth && pageAuth.subs && pageAuth.subs.length) {
        pageAuth.subs.forEach(el => {
          let authTag = el.index.startsWith('/') ? el.index.substring(1) : el.index;
          authTag = authTag.split('/');
          authTag = authTag.length > 1 ? authTag[1] : authTag[0];
          this.auth[authTag] = true;
          if (authTag == 'add') {
            this.getAuth(el.index.startsWith('/') ? el.index : '/' + el.index);
          }
        })
      }
    },
    getProjectList(code,isDlg){
      var param = {
        sysCode:code||process.env.VUE_APP_CODE
      };
      if(isDlg){
        this.allProjectList_dlg = [];
        this.form.projectId = ""
      }else{
        this.allProjectList = [];
        this.queryForm.projectId = ""
      }
      this.$http.axios.post(`user/exi/mesSysProject/getList`,param).then(response=>{
        const allProjectList = response.DATA.map(el => ({
          dictLabel: el.projectName,
          dictValue: el.projectId
        }))
        if(isDlg){
          this.allProjectList_dlg = allProjectList
        }else{
          this.allProjectList = allProjectList
        }
      })
    },
    search() {
      this.currentPage = 1;
      this.getPage();
    },
    getPage() {
      this.$http.showLoading = true;
      this.$http.getPage(`common/api/sysDictType`, this.queryForm, this.currentPage, this.pageSize).then(response => {
        this.list = response.DATA.map(el=>{
          const dt = this.allProjectList.find(it=>it.dictValue==Number(el.projectId))
          el.projectName = dt?dt.dictLabel:el.projectId;
          return el
        })
        this.total = response.total;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPage();
    },
    reset() {
      this.$refs.queryForm.resetFields();
      this.getPage();
    },

    resetSub() {
      this.form.dictId='';
      this.form.dictName='';
      this.form.dictType='';
      this.form.status='0';
      this.form.remark='';
    },

    onUploadSuccess(response, file, fileList) {
      loading.close();
      if (response.RESULT === "PASS") {
        this.$message({
          message: file.name.concat(this.$t("L00023")),
          type: "success"
        });
        this.currentPage = 1;
        this.getPage();
      } else {
        this.$message.error(this.$t("L00030") + response.MESSAGE);
      }
      fileList.splice(0);
    },
    onUploadError(err, file) {
      loading.close();
      this.$message.error(file.name.concat(`${this.$t('L00030')}`, err));
    },
    beforeUpload(file) {
      const isExcel = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(file.type);
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isExcel) {
        this.$message.error(this.$t("L00028"));
      }
      if (!isLt1M) {
        this.$message.error(this.$t("L00029"));
      }
      if (isExcel && isLt1M)
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      return isExcel && isLt1M;
    },
    handleSelectionChange(val) {
      this.checkedIds = val.map((el) => el.id);
    },

    del(item) {
      this.$confirm(this.$t("L00025"), this.$t("L00010"), {
        confirmButtonText: this.$t("L00004"),
        cancelButtonText: this.$t("L00007"),
        type: "warning",
      }).then(() => {
        this.$http.removeById(`common/api/sysDictType`, item.dictId).then(() => {
          this.$message.success(this.$t('L00047'));
          this.currentPage = 1;
          this.getPage();
        })
      })
    },

    edit(item) {
      this.open = true;
      this.resetSub();
      this.$http.getById(`common/api/sysDictType`, item.dictId).then(response => {
        Object.assign(this.form, response.DATA);
      })
      this.changeCount = 0;
    },
    add() {
      this.open = true;
      this.title = this.$t('LCM0044');
      this.resetSub();
      this.changeCount = 0;
    },
    config(item) {
      this.dictType = item.dictType;
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.sysDictData.getPage();
      });
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.changeCount == 0) {
            this.$message.warning(this.$t('L00052'));
            return;
          }
          if (!this.form.dictId ) {
            this.$http.save(`common/api/sysDictType`, this.form).then(() => {
              this.open = false;
              this.$message.success(this.$t('L00045'));
              this.resetSub();
              this.getPage();
            })
          } else {
            this.$http.updateById(`common/api/sysDictType`, this.form).then(() => {
              this.$message.success(this.$t('L00045'));
              this.open = false;
              this.getPage();
            })
          }
        } else {
          return false;
        }
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.resetSub();
    },

    refreshCache() {
      this.$http.axios.get(`common/api/sysDictType/resetDictCache`)
        .then(() => {
          this.$message.success(this.$t('L40024'));
        });
    },

    handleChange() {
      this.changeCount++;
    },

    propertyFormat(row) {
      return row.isPublic==1?this.$t('LCM0027'):(row.isPublic==0?this.$t('LCM0028'):"");
    }
  }
}
</script>
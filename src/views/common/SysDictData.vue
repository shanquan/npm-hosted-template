<!--
@author     : linzhijian
@since      : 2022-06-08 16:39:06
@description: 字典配置表
-->
<template>
  <el-drawer :title="$t('LCM0029')" :visible.sync="drawerVisiable" :size=1000 :modal-append-to-body="false" @close="closeDrawer">
    <div class="sysDictData">
      <el-form :inline="true" ref="queryForm" label-position="right" :model="queryForm" label-width="80px"
        class="form-bar">
        <el-form-item :label="$t('dictValue')" class="inline-form" prop="dictValue">
          <el-input :clearable="true" v-model="queryForm.dictValue"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dictLabel')" class="inline-form" prop="dictLabel">
          <el-input :clearable="true" v-model="queryForm.dictLabel"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-preventReClick="3000" @click="search" type="primary" icon="el-icon-search">{{ $t('L00002') }}
          </el-button>
          <el-button @click="onReset" icon="el-icon-refresh-right">{{ $t('L00013') }}</el-button>
          <el-button v-if="auth.add" @click="add" icon="el-icon-plus" type="primary">{{ $t('L00005') }}</el-button>
          <el-button v-if="auth.delete" @click="dels()" icon="el-icon-delete" type="danger">{{$t('L00004')}}</el-button>
        </el-form-item>
        <el-form-item>
        <el-button v-if="auth.exportData" v-preventReClick="3000" type="primary" icon="el-icon-download" @click="exportExcel()">
          {{ $t('L00008') }}
        </el-button>
        <el-upload
            v-if="auth.add"
            class="import-btn"
            :action="uploadUrl"
            name="excelFile"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :show-file-list="false"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :before-upload="beforeUpload"
            :data="uploadData"
          >
          <el-button slot="trigger" type="primary" icon="el-icon-upload2">{{ $t('L00009') }}</el-button>
          <el-link class="ml10" type="primary" @click="exportTemplete()">{{$t('L00018')}}</el-link>
        </el-upload>
      </el-form-item>
      </el-form>
      <a id="aExport" href="#" class="hide"></a>
      <!-- 表格 -->
      <el-table lazy row-key="dictCode" header-row-class-name="nowrap" stripe border height="550" @selection-change="handleSelectionChange"
        :data="list" :load="getList" :loading="true" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column fixed="left" type="selection" width="50"></el-table-column>
        <el-table-column
        show-overflow-tooltip
        :label="$t('id')"
        align="left"
        width="150"
        prop="indexNo"
      >
      </el-table-column>
        <el-table-column v-if="auth.edit || auth.delete" align="center" :label="$t('L00019')" width="80">
          <template slot-scope="scope">
            <el-button v-if="auth.edit" @click.native="edit(scope.row)" :title="$t('L00003')" type="text" size="medium"
              icon="el-icon-edit">
            </el-button>
            <el-button v-if="auth.delete" @click.native="del(scope.row)" :title="$t('L00004')" type="text" size="medium"
              icon="el-icon-delete">
            </el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip
        type="index"
        :label="$t('id')"
        align="center"
        width="50"
        fixed="left"
        :index="indexMethod">
      </el-table-column> -->
        <el-table-column show-overflow-tooltip align="center" prop="dictLabel" :label="$t('dictLabel')" width="180">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="dictValue" :label="$t('dictValue')" width="180">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="dictSort" :label="$t('dictSort')" width="80">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="dictType" :label="$t('dictType')" width="200">
        </el-table-column>
        <el-table-column  prop="isDefault" :label="$t('LCM0030')" width="120">
					<template slot-scope="scope">
            <el-switch class="switch" @change="setDefault(scope.row)" v-model="scope.row.isDefault" active-value="Y" inactive-value="N" :active-text="$t('LCM0031')" :inactive-text="$t('LCM0032')" active-color="chartreuse">
            </el-switch>
					</template>
				</el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="dictCode" :label="$t('dictCode')"  width="80">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createBy" :label="$t('createName')" width="80">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createTime" :label="$t('createTime')" width="150">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="updateBy" :label="$t('updateName')" width="80">
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="updateTime" :label="$t('updateTime')" width="150">
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip
        align="center"
        prop="cssClass"
        :label="$t('SysDictData_CssClass')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="listClass"
        :label="$t('SysDictData_ListClass')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="isDefault"
        :label="$t('SysDictData_IsDefault')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="status"
        :label="$t('SysDictData_Status')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="createBy"
        :label="$t('SysDictData_CreateBy')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="createTime"
        :label="$t('SysDictData_CreateTime')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="updateBy"
        :label="$t('SysDictData_UpdateBy')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="updateTime"
        :label="$t('SysDictData_UpdateTime')">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        align="center"
        prop="remark"
        :label="$t('SysDictData_Remark')">
      </el-table-column> -->
      </el-table>
      <el-pagination style="text-align: center" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item :label="$t('dictSort')" prop="dictSort">
            <el-input v-model="form.dictSort" @change="handleChange"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dictLabel')" prop="dictLabel">
            <!-- <el-input v-model="form.dictLabel" @change="handleChange"></el-input> -->
            <mult-lang-input :name.sync="form.dictLabel" :nameMultLang.sync="multilingual" clearable @change="handleChange('dictLabel')"></mult-lang-input>
          </el-form-item>
          <el-form-item :label="$t('dictValue')" prop="dictValue">
            <el-input v-model="form.dictValue" :disabled="disabled"></el-input>
          </el-form-item>
          <!-- 添加树形选择 -->
          <el-form-item :label="$t('L40506')" prop="parentDictCode">
            <treeselect
              v-model="form.parentDictCode"
              :options="dictTree"
              :async="Isasync"
              :default-expand-level="defaultLevel"
              :load-options="Isasync ? asyncMenus : loadMenus"
              @keydown.native="assetTreeKeydownFun"
              @input="changeMenu"
              @open="itemOpen(rowIndex)"
              @keyup.native="assetTreeKeyupFun($event)"
              @close="itemClose(rowIndex)"
              :placeholder="$t('L40507')"
            />
      </el-form-item>
        <el-form-item :label="$t('css样式')" prop="cssClass">
          <el-input v-model="form.cssClass" @change="handleChange"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSubmit()">{{ $t('L00006') }}</el-button>
          <el-button @click="cancel">{{ $t('L30082') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </el-drawer>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { ASYNC_SEARCH } from "@riophae/vue-treeselect";
import multLangInput from "./multLangInput.vue";
let loading;
export default {
  name: "sysDictData",
  props: ['dictType'],
  components: { Treeselect,multLangInput },
  created() {
    this.downloadUrl = this.$http.baseUrl + `common/api/sysDictData/`;
    this.getAuth(this.$route.path);
    this.uploadUrl = this.$http.baseUrl.concat(`common/api/sysDictData/importExcel?token=`, this.$http.token);
  },
  watch: {
    // '$root.screenSize': function () {
    //   this.$root.resizeTable();
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.$root.resizeTable();
    })
    this.getPage();
  },
  data() {
    return {
      title: "",
      disabled: false,
      changeCount: 0,
      form: {
        dictCode: undefined,
        dictType: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        parentDictCode: 0,
        cssClass: undefined,
        listClass: 'default',
        dictSort: 0,
        status: "0",
        remark: undefined,
        multilingual: {}
      },
      // 查询参数
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictLabel: undefined,
        dictType: undefined,
        status: undefined
      },
      uploadData:{},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: this.$t('LCM0033'), trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: this.$t('LCM0034'), trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: this.$t('LCM0035'), trigger: "blur" }
          , {
            pattern: /^[0-9]*$/,
            message: this.$t('LCM0036'),
            trigger: "change"
          }
        ]
      },
      drawerVisiable: false,
      open: false,
      uploadUrl: "",
      checkedIds: [],
      Isasync: false,
      dictTree: [],
      defaultLevel: 0,
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
      multilingual: {}, // 多语配置
    }
  },
  methods: {
    getAuth(val) {
      console.log("val:" + val);
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
    search() {
      this.currentPage = 1;
      this.getPage();
    },
    getPage() {
      this.drawerVisiable = true;
      this.queryForm.dictType = this.dictType;
      this.$http.showLoading = true;
      setTimeout(() => {
      this.$http.getPage(`common/api/sysDictData`, this.queryForm, this.currentPage, this.pageSize).then(response => {
        var indexNo = 0;
        this.list = response.DATA.map(function (obj) {
              obj.indexNo = indexNo + 1;
              indexNo = indexNo + 1;
              return obj;
            });
        this.total = response.total;

      })
      }, 100);
    },
    getList(tree, treeNode, resolvse) {
      var formParam = {};
      formParam.parentDictCode = tree.dictCode;
      const indexNo = tree.indexNo;
      var indexPreNo = 1;
      setTimeout(() => {
        this.$http.axios.post(`common/api/sysDictData/getChildrenList`, formParam).then((res) => {
          resolvse(
            res.DATA.map(function (obj) {
              obj.indexNo = indexNo + "." + indexPreNo;
              indexPreNo = indexPreNo + 1;
              return obj;
            })
          );
        });
      }, 100);
    },

    getMenu() {
      this.dictTree = [];
      if (this.form.dictCode != null) {
        if (this.form.parentDictCode === null) {
          this.form.parentDictCode = 0;
        }
        this.getSuperiorMenu(parseInt(this.form.dictCode));
      } else {
        this.form.parentDictCode = 0;
        this.dictTree.push({
          id: 0,
          dictCode: 0,
          label: `${this.$t("L40513")}`,
          children: null,
        });
      }
    },
    getSuperiorMenu(id) {
      const data = id.length || id.length === 0 ? id : Array.of(id)
      const _this = this;
      this.$http.axios.post(`common/api/sysDictData/getSuperior`,data).then((res) => {
        const children = res.DATA.map(function (obj) {
          obj.label = obj.dictLabel;
          obj.id = obj.dictCode;
          obj.parentId = obj.parentDictCode;
          _this.processChildren(obj.children)
          return obj;
        });
        this.dictTree = [
          { id: 0, dictCode: 0, label: `${this.$t("L40513")}`, children: children },
        ];
      });
    },
    processChildren(data) {
      if(data){
        data.forEach(obj => {
        if (obj.children && obj.children.length > 0) {
          this.processChildren(obj.children); // 递归处理子级的children属性
        }
        obj.label = obj.dictLabel;
        obj.id = obj.dictCode;
        obj.parentId = obj.parentDictCode;
      });
      }
      
    },
    asyncMenus({ action, searchQuery, callback }) {
      if (action === ASYNC_SEARCH) {
        this.$http.axios.get(`common/api/sysDictData/getMenusByName?name=`+searchQuery + '&sysCode=' + this.$http.sysCode).then((res) => {
            const a = this.formatChildren(res.DATA)
            // const options = res.DATA.map(i => ({
            //   id: i.id,
            //   code: i.code,
            //   label: i.menuName,
            //   children: i.hasChildren ? i.children : undefined,
            // }))
            setTimeout(() => {
              callback(null, a)
          }, 100);
        });
      }
    },
    formatChildren(list){
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if(element.children!=null && element.children.length!=0){
          element.children = this.formatChildren(element.children)
        } else{
          element.children = undefined
        }
      }
      return list;
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        this.$http.axios.get(`common/api/sysDictData/lazy?pid=`+ parentNode.dictCode + `&dictType=` + this.dictType).then((res) => {
          parentNode.children = res.DATA.map(function (obj) {
            obj.label = obj.dictLabel;
            obj.id = obj.dictCode;
            obj.parentId = obj.parentDictCode;
            if (obj.hasChildren && !obj.children) {
              obj.children = null;
            } else if (!obj.hasChildren) {
              obj.children = undefined;
            }
            return obj;
          });
          setTimeout(() => {
            callback();
          }, 100);
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPage();
    },
    onReset() {
      this.$refs.queryForm.resetFields();
      this.getPage();
    },
    exportExcel() {
      var param = JSON.stringify(this.queryForm);
      var token = this.$http.token;
      var url = this.downloadUrl.concat("export", "?token=", token, "&param=", param);
      let $a = document.getElementById('aExport');
      $a.href = url;
      $a.click();
    },
    exportTemplete() {
      var token = this.$http.token;
      var url = this.downloadUrl.concat("exportTemplete", "?token=", token);
      let $a = document.getElementById('aExport');
      $a.href = url;
      $a.click();
    },
    onUploadSuccess(response, file, fileList) {
      loading.close();
      if (response.RESULT === "PASS") {
        if (response.MESSAGE) {
          this.$message({
            message: file.name.concat(this.$t("L00023"))+this.$t('LCM0037')+"【"+(response.MESSAGE)+"】",
            type: "warning"
          });
        } else {
          this.$message({
            message: file.name.concat(this.$t("L00023")),
            type: "success"
          });
        }
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
      this.$set(this.uploadData, 'dictType', this.queryForm.dictType)
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
      this.checkedIds = val.map((el) => parseInt(el.dictCode));
    },
    del(item) {
      this.$confirm(this.$t("L00025"), this.$t("L00010"), {
        confirmButtonText: this.$t("L00004"),
        cancelButtonText: this.$t("L00007"),
        type: "warning",
      }).then(() => {
        this.$http.removeById(`common/api/sysDictData`, item.dictCode).then(() => {
          this.$message.success(this.$t('L00047'));
          this.currentPage = 1;
          this.getPage();
        })
      })
    },
    dels() {
      if (this.checkedIds.length) {
        var param={};
        param.idList= this.checkedIds;
        this.$confirm(this.$t('L00026'), this.$t('L00010'), {
          confirmButtonText: this.$t('L00027'),
          type: "warning",
        }).then(() => {
          this.$http.axios.post(`common/api/sysDictData/remoteListId`, param)
            .then((res) => {
              if(res.MESSAGE){
                this.$message.warning(this.$t('L00047')+","+res.MESSAGE);
              }else{
                this.$message.success(this.$t('L00047'));
              }
              this.currentPage = 1;
              this.getPage();
            });
        });
      } else {
        this.$message.error(this.$t('L00022'));
      }
    },
    edit(item) {
      this.onResetForm();
      this.open = true;
      this.disabled = true;
      this.$http.getById(`common/api/sysDictData`, item.dictCode).then(response => {
        Object.assign(this.form, response.DATA);
        this.multilingual = {};
        if(this.form.multilingual&&this.form.multilingual.dictLabel&&this.form.multilingual.dictLabel.length) {
          this.form.multilingual.dictLabel.forEach(el=>{
            this.multilingual[el.language] = el.value;
          })
        }
        this.getMenu();
      })
      this.changeCount = 0;
    },
    add() {
      this.open = true;
      this.title = this.$t('LCM0039');
      this.disabled = false;
      this.onResetForm();
      this.changeCount = 0;
      this.getMenu();
      this.multilingual = {};
      // this.$router.push({ path: `/sysDictData/add/-1` });
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.changeCount == 0) {
            this.$message.warning(this.$t('L00052'));
            return;
          }
          if (this.form.dictCode == undefined) {
            this.$http.save(`common/api/sysDictData`, this.form).then(() => {
              this.open = false;
              this.$message.success(this.$t('L00045'));
              this.onResetForm();
              this.getPage();
            })
          } else {
            this.$http.updateById(`common/api/sysDictData`, this.form).then(() => {
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
    onResetForm() {
      this.$nextTick(() => {
        this.form.dictType = this.dictType;
        this.form.dictCode = undefined;
        this.form.dictLabel = undefined;
        this.form.dictValue = undefined;
        this.form.cssClass = undefined;
        this.form.listClass = 'default';
        this.form.dictSort = 0;
        this.form.status = '0';
        this.form.remark = undefined;
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.onResetForm();
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1
    },
    closeDrawer() {
      this.drawerVisiable = false;
      this.$refs.queryForm.resetFields();
      this.onResetForm();
    },
    //
    setDefault(row) {
      let param = {};
      param.isDefault = row.isDefault;
      param.dictCode = row.dictCode;
      param.dictType = row.dictType;
      param.dictLabel = row.dictLabel;
      param.dictValue = row.dictValue;
      param.createBy = row.createBy;
      this.$http.axios.post(`common/api/sysDictData/updateById`, param, {
        headers: {
          'showError': false
        }
      }).then((res) => {
        if (res.RESULT && res.RESULT == "PASS") {
          this.$message.success(this.$t('L00045'));
        }
        this.getPage();
      }).catch((err) => {
        this.getPage();
        this.$message.error(err.MESSAGE);
      });
    },
    assetTreeKeydownFun() {
      this.Isasync = true
      this.defaultLevel = 5
    },
    assetTreeKeyupFun(e) {
      if (!e.target.value) {
        this.Isasync = false
        this.defaultLevel = 0
        this.getMenu()
      }
    },
    itemOpen(index) {
      this.Isasync = false
      this.defaultLevel = 0
      this.changeCount++;
      console.log(this.Isasync)
    },
    itemClose(index) {
      this.Isasync = false
      this.defaultLevel = 0
      this.changeCount++;
      console.log(this.Isasync)
    },
    changeMenu() {
      this.$refs.form.validateField("parentDictCode");
    },
    handleChange(name) {
      this.changeCount++;
      if(name=='dictLabel') {
        this.form.multilingual = {};
        this.form.multilingual.dictLabel = [];
        let langLis = [];
        Object.keys(this.multilingual).forEach(key=>{
          langLis.push({language: key, value: this.multilingual[key]});
        })
        this.form.multilingual.dictLabel = langLis;
      }
    }
  }
}
</script>

<style scoped>
.sysDictData .treeselect-main {
  width: 204px;
  line-height: 28px;
}
.sysDictData .vue-treeselect__placeholder{
  line-height: 28px;
}
.sysDictData .vue-treeselect__control{
  height: 28px !important;
}
</style>
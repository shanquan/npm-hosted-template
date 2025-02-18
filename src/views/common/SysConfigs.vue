<!--
@author: cao.yi
@since : 2021/2/15
-->
<template>
    <div class="commonSysConfigs">
      <el-form :inline="true" label-position="right" :model="form" class="form-bar" label-width="110" ref="form">

        <el-form-item v-if="showSys" :label="$t('sysName')" class="inline-form" prop="sysCode">
          <el-select :clearable="true" v-model="form.sysCode" filterable @change="getProjectList(form.sysCode)">
            <el-option v-for="(item,index) in sysCodeDictList" :key="index" :label="item.dictLabel"
                       :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('projectName')" class="inline-form" prop="projectId">
          <el-select :disabled="!showSys" v-model="form.projectId" :clearable="true" filterable>
            <el-option v-for="(item,index) in allProjectList" :key="index" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label="$t('L20401')"  prop="name">
          <el-input :clearable="true" v-model="form.name" @blur="form.name=form.name.trim()"></el-input>
        </el-form-item>


        <el-form-item :label="$t('L20403')"  prop="description">
          <el-input :clearable="true" v-model="form.description" @blur="form.description=form.description.trim()"></el-input>
        </el-form-item>
        <el-form-item>


          <el-button @click="search" type="primary" icon="el-icon-search">{{$t('L00002')}}</el-button>
          <el-button @click="reset" type="primary" icon="el-icon-refresh-right">{{$t('L00013')}}</el-button>
          <el-button v-if="auth.add" @click="add" type="primary" icon="el-icon-plus">{{$t('L00005')}}</el-button>
        </el-form-item>
      </el-form>
    <!-- 表格 @selection-change="handleSelectionChange" row-style="height:20px" -->
    <el-table header-row-class-name="nowrap" stripe border height="300" :row-style="{height:'40px'}" :cell-style="{padding:'0px'}"
    :data="list" :loading="true" style="width: 100%">
      <!-- <el-table-column show-overflow-tooltip fixed="left" type="selection" width="50">
      </el-table-column> -->
      <el-table-column v-if="auth.adv||auth.delete" align="center" fixed="left" :label="$t('L00019')" width="120">
        <template slot-scope="scope">
          <!-- <el-button @click.native="goto(scope.row)" type="text" size="medium" icon="el-icon-setting">
          </el-button> -->
          <el-button v-if="auth.adv" @click.native="edit(scope.row,'commonSysConfig')" :title="$t('L00003')" type="text" size="medium" icon="el-icon-edit">
          </el-button>
          <el-button v-if="auth.delete" @click.native="del(scope.row)" :title="$t('L00004')" type="text" size="medium" icon="el-icon-delete">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip fixed="left" type="index" :label="$t('id')" align="center" width="50" :index="indexMethod">
      </el-table-column>


      <el-table-column show-overflow-tooltip align="center" fixed="left" prop="sysCode" :label="$t('sysName')"  width="150">
        <template slot-scope="{ row }">
          <span>{{ row.sysCodeName }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" prop="projectId" :label="$t('L30194')">
        <template slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip  align="center" prop="name" :label="$t('L20401')" width="150">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="description" :label="$t('L20403')"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="value" :label="$t('L20402')" width="200" >
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="isPublic" :label="$t('property')" :formatter="propertyFormat">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="updateName" :label="$t('updateName')" width="150">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="updateTime" :label="$t('updateTime')" width="160">
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    </div> 
</template>

<script>
import Vue from 'vue'
import {sysProject} from './sysProjectMinix';
import dictApi from './util.js'
Vue.use(dictApi)

export default {
  name: "commonSysConfigs",
  mixins:[sysProject],
  created() {
    this.getAuth();
    this.getSysProjectPromise.then(()=>{
      this.allProjectList = this.projectDictList
      this.form.projectId = this.$http.project.id
      this.getPage()
    })
  },
  watch:{
    '$root.screenSize':function(){
      this.$root.resizeTable();
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this.$root.resizeTable();
    })
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      form: {
        name: "",
        description: "",

      },
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      auth: {
        "add": false||!this.$root.authCheck,
        "adv": false||!this.$root.authCheck,
        "delete": false||!this.$root.authCheck
      },
      allProjectList:[]
    }
  },
  methods: {
    getAuth(){
      let pageAuth = this.$root.findMenuItem(this.$route.path,this.$root.auth);
      // console.log(pageAuth)
      if(pageAuth&&pageAuth.subs&&pageAuth.subs.length){
        pageAuth.subs.forEach(el=>{
          let authTag = el.index.startsWith('/')?el.index.substring(1):el.index;
          authTag = authTag.split('/');
          authTag = authTag.length>1?authTag[1]:authTag[0];
          this.auth[authTag] = true;
        })
      }
    },
    getProjectList(code){
      var param = {
        sysCode:code||process.env.VUE_APP_CODE
      };
      this.allProjectList = [];
      this.form.projectId = ""
      this.$http.axios.post(`user/exi/mesSysProject/getList`,param).then(response=>{
        this.allProjectList = response.DATA.map(el => ({
          dictLabel: el.projectName,
          dictValue: el.projectId
        }))
      })
    },
    search() {
      this.currentPage = 1;
      this.getPage();
    },
    getPage() {
      this.$http.getPage(`common/api/sysConfig`, this.form, this.currentPage, this.pageSize).then(response=>{
        this.list = response.DATA.map(el=>{
          const dt = this.allProjectList.find(it=>it.dictValue==Number(el.projectId))
          const syscode = this.sysCodeDictList.find(it=>it.dictValue==el.sysCode)
          el.projectName = dt?dt.dictLabel:el.projectId;
          el.sysCodeName = syscode?syscode.dictLabel:el.sysCode;
          return el
        })
        this.total = response.total;
      })
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
      this.$refs.form.resetFields();
      this.getPage();
    },
    indexMethod(index) {
      return index+(this.currentPage-1)*this.pageSize+1
    },
    del(item) {
      this.$confirm(`${this.$t('L00026')}`, this.$t('L00010'), {
        confirmButtonText: `${this.$t('L00006')}`,
        cancelButtonText: `${this.$t('L00007')}`,
        type: "warning",
      }).then(() => {
        this.$http.removeById(`common/api/sysConfig`, item.id).then(res => {
          if(res.RESULT == "PASS") this.$message.success(`${this.$t('L40009')}`);
          // this.currentPage = 1;
          this.getPage(1);
        })
      })
    },
    edit(item) {
      if(item&&item.id){
        this.$router.push({'path': `/commonSysConfig/${item.id}`})
      }
    },
    add() {
      this.$router.push({path: `/commonSysConfigAdv/add`});
    },
    propertyFormat(row) {
      return row.isPublic==1?this.$t('LCM0027'):(row.isPublic==0?this.$t('LCM0028'):"");
    }
  }
}
</script>
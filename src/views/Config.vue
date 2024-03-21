<!--
@author: wang.weili
@since : 2021/12/24
@description: 配置页
-->
<template>
  <div class="mobile-menu pda-box">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="110px"
    >
      <el-form-item label="MACADDRESS">
        {{$http.macAddress}}
      </el-form-item>
      <el-form-item label="工序" prop="process">
        <el-select @change="onProcessChange" v-model="form.process" clearable filterable>
          <el-option
            v-for="item in processList"
            :key="item.id"
            :label="item.processName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="requireList.includes('shoporder')" label="工单" prop="shoporder">
        <el-select filterable remote :remote-method="remoteMethod" v-model="form.shoporder" clearable>
          <el-option
            v-for="item in shoporderList"
            :key="item.id"
            :label="item.shoporder"
            :value="item.shoporder">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="requireList.includes('project')" label="项目" prop="project">
        <el-select filterable v-model="form.project" clearable>
          <el-option
            v-for="item in projectList"
            :key="item.$index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('L00050')}}{{programName}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
const prefixType = "Flames.Web"
export default {
  name: "config",
  created() {
    this.getProjectList();
    this.$root.$children[0].addBreadcrumb(this.$route)
    if(false&&!window.cordova){
      this.$http.axios.get(`${this.$http.app_url}mesResource/getMac`).then(response=>{
        if(!response.DATA){
          this.$message({
            message:"获取MAC地址失败",
            type:"warning"
          })
        }else{
          this.$http.macAddress = response.DATA
          this.getProcessList();
        }
      })
    }else{
      this.getProcessList();
    }
  },
  data() {
    return {
      form: {
        process: "",
        shoporder: "",
        project: ""
      },
      rules: {
        process: [this.$root.requireRule],
      },
      processList: [],
      shoporderList: [],
      projectList: [],
      programName: "",
      requireList:[],
      routeName:"",
    };
  },
  beforeRouteLeave (to, from, next) {
    if (this.pageType != 0 && to.name != "login") {
      this.$store.commit('setPageType', 2)
      this.$root.$children[0].title = this.programName;
    }
    next();
  },
  methods: {
    getProcessList() {
      if (!this.$http.macAddress) {
        this.$http.macAddress = "34:2E:B7:B1:22:C7";
      }
      this.$http.axios
        .post(
          "api/me/mesResource/getResourceListByCode",
          `resourceCode=${this.$http.macAddress}&processStatus=0&resourceStatus=0`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          this.processList = res.DATA;
        });
    },
    remoteMethod(qs) {
      if (qs !== '') {
        this.$http.getPage(`${this.$http.app_url}mesShoporder`, {
          shoporder: qs
        },1,30).then(res=>{
          this.shoporderList = res.DATA.page;
        })
      } else {
        this.shoporderList = [];
      }
    },
    getProjectList(){
      this.$http.axios
        .post(
          "api/me/mesProcessAuthorityManagement/projectSelect",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          this.projectList = res.DATA;
        });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid&&this.routeName) {
          if(this.requireList.every(el=>this.form[el]!=="")){
            Object.assign(this.$root.config.data,this.form);
            this.$router.push(this.routeName);
          }else{
            this.$message.error("缺少必填信息！");
          }
        } else {
          return false;
        }
      });
    },
    onReset() {
      this.$refs.form.resetFields();
    },
    onProcessChange(id) {
      if(id===""){
        this.programName=""
        return;
      }
      let p = this.processList.find(el=>el.id==id);
      try{
        if(p.programType.startsWith(prefixType)){
          this.programName = p.programName;
          this.routeName = p.programType.substring(prefixType.length+1);
          this.requireList = this.$root.config[this.routeName]||[];
        }else{
          this.$message.error('不支持的程序类型：'+p.programType)
          this.programName="";
          this.routeName=""
        }
      }catch(e){
        console.log(e)
      }
    },
  }
};
</script>

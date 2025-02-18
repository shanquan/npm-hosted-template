<!--
@author: cao.yi
@since : 2021/2/15
-->
<template>
  <div class="commonSysConfigAdv">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="form-bar">


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



      <el-form-item :label="$t('L20401')" prop="name">
        <el-input v-model="form.name" @blur="form.name=form.name.trim()" clearable style="width:300px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('L20403')" prop="description">
        <el-input v-model="form.description" @blur="form.description=form.description.trim()" clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('L20404')" prop="type">
          <el-select v-model="form.type" :placeholder="$t('pleaseChoose')" style="width:120px">
            <el-option
              v-for="item in cfgType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item :label="$t('L20405')" prop="info">
        <el-input v-model="form.info" @blur="form.info=form.info.trim()" clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('L20402')" prop="value">
        <el-input v-model="form.value" @blur="form.value=form.value.trim()" v-if="form.type==0" clearable style="width:500px"></el-input>
        <el-input v-model="form.value" @blur="form.value=form.value.trim()" type="number" v-if="form.type==1" clearable style="width:100px"></el-input>
        <el-radio v-model="form.value" v-if="form.type==2" label="YES">{{$t('L20418')}}</el-radio><el-radio v-model="form.value" v-if="form.type==2" label="NO">{{$t('L20419')}}</el-radio>
        <el-date-picker v-model="form.value" v-if="form.type==3"  type="date"></el-date-picker>
        <el-date-picker v-model="form.value" v-if="form.type==4"  type="datetime"></el-date-picker>
          <el-select v-model="form.value"  v-if="form.type==5" :placeholder="$t('pleaseChoose')" style="width:300px">
            <el-option
              v-for="item in valueSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.params.type=='add'||authDo" type="primary" @click="save('form')">{{$t('L00006')}}</el-button>
        <el-button @click="goback">{{$t('L00007')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {sysProject} from './sysProjectMinix';
export default {
  name: "commonSysConfigAdv",
  mixins:[sysProject],
  created() {
    this.type = this.$route.params.type
    this.cfgType.push({value:0,label:this.$t('L20412')});
    this.cfgType.push({value:1,label:this.$t('L20413')});
    this.cfgType.push({value:2,label:this.$t('L20414')});
    this.cfgType.push({value:3,label:this.$t('L20415')});
    this.cfgType.push({value:4,label:this.$t('L20416')});
    this.cfgType.push({value:5,label:this.$t('L20417')});
    this.getAuth();
    this.getSysProjectPromise.then(()=>{
      this.allProjectList = this.projectDictList
      this.form.projectId = this.$http.project.id
      this.getPage()
    })
    if(this.type != "add"){
      this.getSysConfigById(this.$route.params.id);
    }
  },
  computed:{
    user(){
      return this.$store.state.user
    }
  },
  data() {
    return {
      form:{
        type: "",
        name: "",
        info: "",
        value: "",
        description: "",

      },
      type: "",
      editobj: {},
      cfgType:[],
      valueSelect:[],
      rules: {
          sysCode:[{required: true, message: '请选择系统', trigger: "blur"}],
          projectId:[{required: true, message: '请选择项目', trigger: "blur"}],
          type:[{required: true, message: `${this.$t('L20408')}`, trigger: "blur"}],
          name:[{required: true, message: `${this.$t('L20409')}`, trigger: "blur"}],
          value:[{required: true, message: `${this.$t('L20410')}`, trigger: "blur"}],
          description:[{required: true, message: `${this.$t('L20411')}`, trigger: "blur"}],
      },
      authDo:false||!this.$root.authCheck,
      allProjectList:[]
    }
  },
  watch : {
    'form.info': function(val) {
      //列表：把form_info值折分成列表项：值:标题,值:标题,值:标题
      if(this.form.type == 5){
        this.valueSelect = [];
        var tmpValues = val.split(",");
        for(var i=0; i<tmpValues.length; i++){
          if(tmpValues[i].indexOf(":")>-1){
            var vl = tmpValues[i].split(":");
            this.valueSelect.push({value:vl[0],label:vl[1]});
          }else{
            this.valueSelect.push({value:tmpValues[i],label:tmpValues[i]});
          }
        }
      }
    },
    'form.type':function(val) {
      //列表：把form_info值折分成列表项：值:标题,值:标题,值:标题
      if(val == 5){
        this.valueSelect = [];
        var tmpValues = this.form.info.split(",");
        for(var i=0; i<tmpValues.length; i++){
          if(tmpValues[i].indexOf(":")>-1){
            var vl = tmpValues[i].split(":");
            this.valueSelect.push({value:vl[0],label:vl[1]});
          }else{
            this.valueSelect.push({value:tmpValues[i],label:tmpValues[i]});
          }
        }
      }
    }
  },
  methods: {
    getAuth() {
      let pageAuth = this.$root.findMenuItem(this.$root.getMatchedPath(this.$route), this.$root.auth);
      if (pageAuth && pageAuth.subs && pageAuth.subs.length) {
        this.authDo = true;
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
    getSysConfigById(id) {
      this.$http.getById(`common/api/sysConfig`, id).then(res =>{
        if(res.RESULT == "PASS"){
          this.editobj = res.DATA;
          this.form.sysCode = this.editobj.sysCode;
          this.form.projectId = this.editobj.projectId;
          this.form.type = this.editobj.type;
          this.form.name = this.editobj.name;
          this.form.info = this.editobj.info;
          this.form.value = this.editobj.value;
          this.form.description = this.editobj.description;
        }else{
          alert(res.MESSAGE);
        }
      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
        this.editobj.sysCode = this.form.sysCode;
        this.editobj.projectId = this.form.projectId;
        this.editobj.name = this.form.name;
        this.editobj.type = this.form.type;
        this.editobj.info = this.form.info;
        this.editobj.value = this.form.value;
        this.editobj.description = this.form.description;
        if(this.type == "add"){
          this.$http.save(`common/api/sysConfig`,this.editobj).then(response => {
            if(response.RESULT=="PASS") this.goback();
            else alert(response.MESSAGE);
          })
        }else{
          this.$http.updateById(`common/api/sysConfig`,this.editobj).then(response => {
            if(response.RESULT=="PASS") this.goback();
            else alert(response.MESSAGE);
          })
        }
      // }
      }else{
        this.$message.warning(`${this.$t('L40007')}`);
      }
      })
    },
    goback() {
      this.$router.push({path:`/commonSysConfig`})
    },
  }
}
</script>

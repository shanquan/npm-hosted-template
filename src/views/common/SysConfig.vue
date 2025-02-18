<!--
@author: cao.yi
@since : 2021/2/15
-->
<template>
  <div class="commonSysConfig">
    <el-form 
      ref="form" :model="form" :rules="rules" label-width="120px" class="form-bar"
    >
      <el-form-item :label="$t('L20401')">
        <font color=blue>{{form.name}}</font>
      </el-form-item>
      <el-form-item :label="$t('L20403')">
        {{form.description}}
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
        <el-button type="primary" @click="save('form')">{{$t('L00006')}}</el-button>
        <el-button @click="goback">{{$t('L00007')}}</el-button>
        <el-button v-if="auth.edit" @click="advModel">{{$t('L20420')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "commonSysConfig",
  created() {
    this.getAuth();

    this.getSysConfigById(this.$route.params.id);
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
        description: ""
      },
      editobj: {},
      valueSelect:[],
      rules: {
          value:[{required: true, message: `${this.$t('L20410')}`, trigger: "blur"}]
      },
      auth: {
        "edit": false||!this.$root.authCheck
      }
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
    getAuth(){
      let pageAuth = this.$root.findMenuItem('/commonSysConfig/adv',this.$root.auth);
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
    getSysConfigById(id) {
      this.$http.getById(`common/api/sysConfig`, id).then(res =>{
        if(res.RESULT == "PASS"){
          this.editobj = res.DATA;
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
          this.editobj.value = this.form.value;
          this.$http.updateById(`common/api/sysConfig`,this.editobj).then(response => {
            if(response.RESULT=="PASS") this.goback();
            else alert(response.MESSAGE);
          })
        }else{
          this.$message.warning(`${this.$t('L40007')}`);
        }
      })
    },
    goback() {
      this.$router.push({path:`/commonSysConfig`})
    },
    advModel() {
      this.$router.push({'path': `/commonSysConfigAdv/edit/${this.editobj.id}`})
    }
  }
}
</script>

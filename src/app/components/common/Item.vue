<!--
@author: wang.weili
@since : 2024/03/19
-->
<template>
  <div class="pda-box commonItem">
    <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" :class="type=='detail'?'detail':''" label-width="110px">
      <el-form-item 
        v-for="item in rowList" 
        :key="item.$index" 
        :label="item.label?$t(item.label):$t(item.value)" 
        :prop="item.value">
        <el-input 
          v-if="!item.type||item.type=='number'||item.type=='textarea'" 
          :type="item.type" 
          v-model="form[item.value]" 
          :class="form.usedFlag=='Y'&&(item.value=='name'||item.value=='version')?'readonly':''" 
          :readonly="form.usedFlag=='Y'&&(item.value=='name'||item.value=='version')" 
          :disabled="type=='detail'">
        </el-input>
        <el-radio-group v-if="item.type=='radio'" v-model="form[item.value]" :disabled="type=='detail'">
          <el-radio v-for="op in item.options||$root[item.source]" :key="op.$index" :label="op.value">{{op.label?$t(op.label):$t(op.value.toString())}}</el-radio>
        </el-radio-group>
        <el-select v-if="item.type=='select'" :filterable="item.value=='sectionName'" v-model="form[item.value]" :disabled="type=='detail'">
          <el-option
            v-for="op in optionList(item)"
            :key="op.$index"
            :label="op.label?$t(op.label):$t(op.value)"
            :value="op.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="type=='add'||type=='edit'" @click="onSubmit">{{$t('L00020')}}</el-button>
        <el-button type="primary" v-if="type=='add'" @click="onReset">{{$t('L00013')}}</el-button>
        <el-button @click="onCancel">{{$t('L00012')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let MODELDATA;
export default {
  name: 'commonItem',
  props: {
    ptype: {
      type: String,
      default: 'add'
    },
    pid: {
      type: Number,
      default: -1
    },
  },
  created(){
    this.init();
  },
  computed:{
    id(){
      return this.$route.params.id || this.pid
    },
    type(){
      let arr = this.$route.path.split('/');
      return arr.length>3?this.$route.path.split('/')[3]:this.ptype;
    },
  },
  data(){
    return{
      form:{
        "name": "",
        "version": "",
        "description": "",
        "status": "",
        "currentVersion": "",
        "type": "",
        "sectionName": ""
      },
      rules:{},
      model:this.$route.params.model,
      modelUrl: this.$http.app_url + this.$route.params.model,
      rowList:[],
      sectionList:[]
    }
  },
  methods:{
    init(){
      this.$http.getMockFile('model.json').then(res=>{
        MODELDATA = res.DATA;
        this.rowList = MODELDATA.common;
        switch(this.type){
          case 'add': this.getList();break;
          case 'edit':
            this.getData();break;
          case 'detail':
            this.rowList = MODELDATA.common.concat(MODELDATA.suffix);
            this.getData();break;
        }
        let rules = {};
        let requireRule = Object.assign({},this.$root.requireRule);
        requireRule.message = this.$t(requireRule.message);
        MODELDATA.common.filter(el=>el.required).forEach(el=>{
          if(rules[el.value]&&rules[el.value].length){
            rules[el.value].push(requireRule);
          }else{
            rules[el.value] = [requireRule];
          }
        })
        this.rules = rules;
      })
    },
    getData(){
      this.$http.getById(this.modelUrl,this.id).then(response=>{
        Object.assign(this.form,response.DATA);
        this.getList();
      })
    },
    getList(){
      this.$http.getList('mes/api/mesSection').then(response=>{
        // name 去重
        this.sectionList = [...new Set(response.DATA.map(el=>el.name))].map(el=>{
          return {value:el}
        })
      })
    },
    optionList(item){
      let options = item.options||this.$root[item.source]||[];
      if(item.value=='sectionName'){
        options = this.sectionList;
      }
      return options;
    },
    onSubmit(){
      // 字符串转数字,Id
      // this.rowList.filter(el=>{return el.type=='number'}).forEach(el=>{
      //   this.form[el.value] = Number(this.form[el.value]);
      // })
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.type=='add'){
            this.$http.save(this.modelUrl,this.form).then(() => {
              this.$message({
                message: this.$t('L00045'),
                type: 'success'
              });
              this.onReset();
            })
          }else if(this.type=='edit'){
            this.$http.updateById(this.modelUrl,this.form)
            .then(() => {
              this.$message({
                message: this.$t('L00045'),
                type: 'success'
              });
              this.onCancel();
            })
          }
        } else {
          return false;
        }
      });
    },
    onReset(){
      this.form.usedFlag = undefined;
      this.$refs.form.resetFields();
    },
    onCancel(){
      let arr = this.$route.path.split('/');
      if(arr.length>2){
        if(this.$root.hasTabs){
          this.$root.$children[0].removeTab(this.$route.path)
        }else{
          this.$root.$children[0].removeCache(this.$route.path);
          this.$router.push(`/list/${this.model}`)
        }
      }else{
        this.$emit('onCancel')
      }
    }
  }
}
</script>

<!--
@author: wang.weili
@since : 2024/03/19
-->
<template>
  <div class="pda-box commonItem">
    <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" :class="type=='detail'?'detail':''" :label-width="config.labelWidth">
      <el-form-item 
        v-for="item in rowList" 
        :key="item.$index" 
        :label="item.label?$t(`${config.model}.${item.label}`):$t(`${config.model}.${item.value}`)" 
        :prop="item.value">
        <el-input 
          v-if="!item.type||item.type=='number'||item.type=='textarea'" 
          :type="item.type" 
          v-model="form[item.value]" 
          :class="type=='edit'&&item.readonly?'readonly':false" 
          :readonly="type=='edit'&&item.readonly?'readonly':false" 
          :disabled="type=='detail'">
        </el-input>
        <el-radio-group v-if="item.type=='radio'&&item.source" v-model="form[item.value]" :disabled="type=='detail'">
          <el-radio v-for="op in $root[item.source]" :key="op.$index" :label="op.value">{{op.label?$t(op.label):$t(op.value.toString())}}</el-radio>
        </el-radio-group>
        <el-radio-group v-if="item.type=='radio'&&item.options" v-model="form[item.value]" :disabled="type=='detail'">
          <el-radio v-for="op in item.options" :key="op.$index" :label="op.value">{{op.label?$t(`${config.model}.${op.label}`):$t(`${config.model}.${op.value}`)}}</el-radio>
        </el-radio-group>
        <el-select v-if="!item.queryUrl&&!item.remoteUrl&&item.options&&item.type=='select'" v-model="form[item.value]" clearable>
          <el-option
            v-for="op in item.options"
            :key="op.$index"
            :label="op.label?$t(`${config.model}.${op.label}`):$t(`${config.model}.${op.value}`)"
            :value="op.value">
          </el-option>
        </el-select>
        <el-select @focus="focusEl=item.value" v-if="(item.queryUrl||item.remoteUrl||item.source)&&item.type=='select'" v-model="form[item.value]" :multiple="item.multiple?true:false" :filterable="item.queryUrl||item.remoteUrl?true:false" :filter-method="item.queryUrl?filterMethod:null" :remote="item.remoteUrl?true:false" :remote-method="item.remoteUrl?remoteMethod:null" clearable>
          <el-option
            v-for="op in item.source?$root[item.source]:item.options"
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
      config:{
        labelWidth: "110px",
        model:this.$route.params.model,
        modelUrl: this.$http.app_url + this.$route.params.model,
      },
      options:{},
      focusEl:null,
      rowList:[]
    }
  },
  methods:{
    init(){
      this.$http.getMockFile('model.json').then(async res=>{
        MODELDATA = res.DATA;
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
        this.rowList = MODELDATA.common;
        switch(this.type){
          case 'add': this.getList();break;
          case 'edit':
            await this.getData();break;
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
    async getData(){
      await this.getList();
      this.$http.getById(this.config.modelUrl,this.id).then(async response=>{
        Object.assign(this.form,response.DATA);
      })
    },
    async getList(){
      await MODELDATA.common.filter(el=>el.queryUrl).forEach(async el=>{
        let res = await this.$http.axios.post(el.queryUrl)
        if(res){
          this.options[el.value] = res.DATA.map(it=>{
            return el.lv&&el.lv.length>1?{
              label: it[el.lv[0]],
              value: it[el.lv[1]]
            }:it
          })
          el.options = this.options[el.value].slice(0,30)
        }
      })
    },
    filterMethod(qs){
      let item = MODELDATA.common.find(el=>el.value==this.focusEl)
      item.options = qs ? this.options[this.focusEl].filter(el=>{return el.label.indexOf(qs)>-1}).slice(0,30):this.options[this.focusEl].slice(0,30)
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
        }else{
          param.label = qs
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
    onSubmit(){
      // 字符串转数字,Id
      // this.rowList.filter(el=>{return el.type=='number'}).forEach(el=>{
      //   this.form[el.value] = Number(this.form[el.value]);
      // })
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.type=='add'){
            this.$http.save(this.config.modelUrl,this.form).then(() => {
              this.$message({
                message: this.$t('L00045'),
                type: 'success'
              });
              this.onReset();
            })
          }else if(this.type=='edit'){
            this.$http.updateById(this.config.modelUrl,this.form)
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
      this.$refs.form.resetFields();
    },
    onCancel(){
      let arr = this.$route.path.split('/');
      if(arr.length>2){
        if(this.$root.hasTabs){
          this.$root.$children[0].removeTab(this.$route.path)
        }else{
          this.$root.$children[0].removeCache(this.$route.path);
          this.$router.push(`/list/${this.config.model}`)
        }
      }else{
        this.$emit('onCancel')
      }
    }
  }
}
</script>

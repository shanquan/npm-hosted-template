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
        <el-select v-if="!item.queryUrl&&!item.remoteUrl&&item.options&&item.type=='select'" v-model="form[item.value]" clearable :disabled="type=='detail'">
          <el-option
            v-for="op in item.options"
            :key="op.$index"
            :label="op.label?$t(`${config.model}.${op.label}`):$t(`${config.model}.${op.value}`)"
            :value="op.value">
          </el-option>
        </el-select>
        <el-select v-if="(item.queryUrl||item.remoteUrl||item.source)&&item.type=='select'" v-model="form[item.value]" :multiple="item.multiple?true:false" :filterable="item.queryUrl||item.remoteUrl?true:false" :filter-method="item.queryUrl?(qs)=>{filterMethod(qs,item.value)}:null" :remote="item.remoteUrl?true:false" :remote-method="item.remoteUrl?(qs)=>{remoteMethod(qs,item.value)}:null" clearable :disabled="type=='detail'">
          <el-option
            v-for="op in item.source?$root[item.source]:item.options"
            :key="op.$index"
            :label="op.label?$t(op.label):$t(op.value)"
            :value="op.value">
          </el-option>
        </el-select>
        <el-checkbox-group v-if="item.type=='check'&&item.options" v-model="form[item.value]" :disabled="type=='detail'">
          <el-checkbox v-for="op in item.options" :key="op.$index" :label="op.value" :disabled="op.disabled">{{op.label?$t(`${config.model}.${op.label}`):$t(`${config.model}.${op.value}`)}}</el-checkbox>
        </el-checkbox-group>
        <el-switch v-if="item.type=='switch'" v-model="form[item.value]" :disabled="type=='detail'" :active-value="item.options&&item.options.length?item.options[0].value:true" :inactive-value="item.options&&item.options.length?item.options[1].value:false">
        </el-switch>
        <el-slider v-if="item.type=='slider'" v-model="form[item.value]" :show-tooltip="item.showTooltip" :step="item.step" :show-input="item.showInput" :range="item.range" :show-stops="item.showStops" :max="item.max" :vertical="item.vertical" :height="item.height" :marks="item.marks" :disabled="type=='detail'"></el-slider>
        <el-color-picker v-if="item.type=='color'" v-model="form[item.value]" :disabled="type=='detail'" :size="item.size" :show-alpha="item.showAlpha" :color-format="item.colorFormat" :predefine="item.predefine"></el-color-picker>
        <el-rate v-if="item.type=='rate'" v-model="form[item.value]" :disabled="type=='detail'" :colors="item.colors" :show-text="item.showText" :show-score="item.showScore" :text-color="item.textColor"></el-rate>
        <el-time-picker v-if="item.type=='time'" v-model="form[item.value]" :disabled="type=='detail'" :picker-options="item.pickerOptions" :default-value="item.defaultValue" :value-format="item.valueFormat" :placeholder="item.placeholder" :arrow-control="item.arrowControl" :size="item.size" :align="item.align"></el-time-picker>
        <el-date-picker v-if="['date','year','month','dates','months','years','week','datetime','datetimerange','daterange','monthrange'].includes(item.type)" :type="item.type" v-model="form[item.value]" :disabled="type=='detail'" :picker-options="item.pickerOptions" :default-value="item.defaultValue" :value-format="item.valueFormat" :placeholder="item.placeholder" :time-arrow-control="item.arrowControl" :size="item.size" :align="item.align"></el-date-picker>
        <el-upload v-if="item.type=='upload'" :class="item.value" :disabled="type=='detail'" :action="item.action" :headers="item.headers" :data="item.data" :with-credentials="item.withCredentials" :name="item.name" :drag="item.drag" :accept="item.accept" :file-list="form[item.value]?form[item.value]:[]" :show-file-list="item.showFileList" :list-type="item.listType" :multiple="item.multiple" :limit="item.limit" :auto-upload="item.autoUpload"
          :on-preview="onPictureCardPreview"
          :on-success="(response,file,fileList)=>{onUploadSuccess(response,file,fileList,item.value)}"
          :on-error="onUploadError"
          :on-change="(file,fileList)=>{onUploadChange(file,fileList,item.value)}"
          :on-remove="(file,fileList)=>{onUploadRemove(file,fileList,item.value)}"
        >
          <i v-if="item.listType=='picture-card'" class="el-icon-plus"></i>
          <i v-if="item.drag" class="el-icon-upload"></i>
          <div v-if="item.drag" class="el-upload__text">{{$t('dragTip')}}<em>{{$t('uploadTip')}}</em></div>
          <el-button v-if="!item.drag&&item.listType!='picture-card'" size="small" type="primary">{{$t('uploadTip')}}</el-button>
          <div v-if="item.tips" slot="tip" class="el-upload__tip">{{item.tips}}</div>
        </el-upload>
        <el-dialog v-if="item.listType=='picture-card'" :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
        "sectionName": "",
        "checklist":[]
      },
      rules:{},
      config:{
        labelWidth: "110px",
        model:this.$route.params.model,
        modelUrl: this.$http.app_url + this.$route.params.model,
      },
      options:{},
      rowList:[],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods:{
    init(){
      this.$http.getMockFile('model.json').then(res=>{
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
          case 'edit': this.getData();break;
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
      this.getList();
      this.$http.getById(this.config.modelUrl,this.id).then(response=>{
        Object.assign(this.form,response.DATA);
        this.$nextTick(()=>{
          MODELDATA.common.filter(el=>el.type=='upload'&&el.limit).forEach(el=>{
            if(this.form[el.value]&&this.form[el.value].length>=el.limit){
              document.querySelector(`.${el.value} .el-upload--picture-card`).classList.add('hide');
            }
          })
        })
      })
    },
    getList(cb){
      let arr = MODELDATA.common.filter(el=>el.queryUrl)
      arr.forEach(async (el,idx)=>{
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
        if(idx==arr.length-1&&typeof cb=="function"){
          cb()
        }
      })
    },
    filterMethod(qs,value){
      let item = MODELDATA.common.find(el=>el.value==value)
      item.options = qs ? this.options[value].filter(el=>{return el.label?el.label.indexOf(qs)>-1:el.value.indexOf(qs)>-1}).slice(0,30):this.options[value].slice(0,30)
      this.$forceUpdate();
    },
    remoteMethod(qs,value) {
      let item = MODELDATA.common.find(el=>el.value==value)
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
    onSubmit(){
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
    },
    onUploadSuccess(response, file, fileList,value) {
      if (response.RESULT === "PASS") {
        this.$message({
          message: file.name.concat(this.$t('L00031'), response.MESSAGE, this.$t('L00032')),
          type: "success"
        });
        this.form[value] = fileList
      }else{
        this.$message.error(file.name.concat(`${this.$t('L00030')}，`, response.MESSAGE));
        this.form[value] = fileList.slice(0,-1);
      }
    },
    onUploadError(err, file){
      this.$message.error(file.name.concat(`${this.$t('L00030')}，`, err));
    },
    onPictureCardPreview(file){
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onUploadChange(file,fileList,value) {
      let item = MODELDATA.common.find(el=>el.value==value)
      if(this.isFileValid(file,item)){
        // this.$root.getImageBase64(file.raw).then(res=>{
        //   file.url = res;
        // })
        this.form[value]=fileList;
        if(fileList.length==item.limit)
          document.querySelector(`.${value} .el-upload--picture-card`).classList.add('hide');
      }else{
        this.form[value] = fileList.slice(0,-1);
        this.$forceUpdate();
      }
    },
    onUploadRemove(file,fileList,value){
      let item = MODELDATA.common.find(el=>el.value==value)
      this.form[value] = fileList;
      if(item.limit&&fileList.length<item.limit){
        document.querySelector(`.${value} .el-upload--picture-card`).classList.remove('hide');
      }
    },
    isFileValid(file,item) {
      const fileExt = file.name.substring(file.name.lastIndexOf('.'));
      const isAccept = item.accept?item.accept.split(',').includes(fileExt):true;
      const isLt1M = item.limitSize?file.size / 1024 < item.limitSize:true;
      if(!isAccept){
        this.$message.error('上传的文件格式不正确:'+item.accept);
      }
      if (!isLt1M) {
        this.$message.error(`上传菜单图片大小不能超过 ${item.limitSize}KB!`);
      }
      return isLt1M&&isAccept;
    },
  }
}
</script>

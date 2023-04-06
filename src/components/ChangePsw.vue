<!--
@author: wang.weili
@since : 2021/01/29
-->
<template>
    <el-dialog
      :title="$t('L00037')"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('L00038')" prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item :label="$t('L00039')" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item :label="$t('L00040')" prop="repeat">
          <el-input v-model="form.repeat" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chgPsw">{{$t('L00006')}}</el-button>
        <el-button @click="handleClose">{{$t('L00007')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
import {
  MD5,
  } from 'crypto-js';
export default {
  name: 'changePsw',
  props:{
    dialogVisible:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      form:{
        oldPwd: "",
        newPwd: "",
        repeat: ""
      },
      rules: {
        repeat:[{validator: (rule, value, callback)=>{
          if (value === '') {
            callback(new Error(this.$t('L00042')));
          } else if (value !== this.form.newPwd) {
            callback(new Error(this.$t('L00043')));
          } else {
            callback();
          }
        }, trigger: 'blur'}]
      }
    }
  },
  created(){
    let requireRule = Object.assign({},this.$root.requireRule);
    requireRule.message = this.$t(requireRule.message);
    let pwdRule = Object.assign({},this.$root.pwdRule);
    pwdRule.message = this.$t(pwdRule.message);
    this.rules.oldPwd = [requireRule];
    this.rules.newPwd = [requireRule,pwdRule];
  },
  methods:{
    chgPsw(){
      this.$refs.form.validate((valid) => {
        if(valid){
          this.$http.changePwd({
            oldPwd: MD5(this.form.oldPwd+this.$root.salt).toString(),
            newPwd: MD5(this.form.newPwd+this.$root.salt).toString()
          }).then((res)=>{
            this.$message.success(res.TIPS||this.$t('L00044'));
            this.handleClose();
            this.$router.push('/login');
          })
        }
      })
    },
    handleClose(){
      this.$refs.form.resetFields();
      this.$emit('close')
    }
  }
}
</script>
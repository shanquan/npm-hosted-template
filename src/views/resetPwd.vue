<!--
@author: xu.weijie
@since : 2021/01/30
-->
<template>
  <div class="resetPwd">
    <el-container class="container">
      <el-header>
        <div class="bydlogo float-right"></div>
      </el-header>
      <div v-if="showError">
        <h2>{{$t('L45007')}}</h2>
        <h3>{{$t('L45017')}}, <el-link style="font-size:18px" :href="loginUrl">{{$t('L45018')}}</el-link>{{$t('L45019')}}</h3>
      </div>
    <el-container class="mainbox">
      <el-main v-if="showMain">
        <el-row><el-col class="ft20">{{$t('L45005')}}</el-col>
        </el-row>
        <!-- <el-input
          v-model="form.newPwd" clearable class="mt18" :placeholder="$t('L45001')" size="medium">
          <svg slot="prefix" class="icon-inner">
              <use xlink:href="#user"></use>
            </svg>
        </el-input> -->
        <el-form class="mt18" :rules="rules" ref="form" :model="form">
        <el-form-item prop="newPwd"> 
          <el-input
            v-model.trim="form.newPwd" show-password class="mt18" :placeholder="$t('L45001')" size="medium">
            <svg slot="prefix" class="icon-inner">
                <use xlink:href="#user"></use>
              </svg>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirm">
          <el-input
            v-model.trim="form.confirm" show-password class="mt12" :placeholder="$t('L45002')" size="medium">
            <svg slot="prefix" class="icon-inner">
              <use xlink:href="#psw"></use>
            </svg>
          </el-input>
          </el-form-item>
        </el-form>
        <div class="mt10">
        </div>
        <el-button type="primary" class="lbtn mt22" @click="resetPwd('form')">{{$t('L00006')}}</el-button>
      </el-main>
      <el-main v-if="showMessage">
        <h2>{{tips?tips:$t('L45020')}}</h2>
        <h3>{{$t('L45021')}} {{rTime}} {{$t('L45022')}}<el-link style="font-size:18px" :href="loginUrl">{{$t('L45018')}}</el-link>{{$t('L45019')}}</h3>
      </el-main>
    </el-container>
      <el-footer>&copy; Copyright {{$t('L00017')}}</el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  MD5,
  } from 'crypto-js';
export default {
  name: "resetPwd",
  created() {
    var item = this.$route.query
    this.randomKey = item.randomKey
    if(!item.randomKey){
      this.showMain = false;
      this.showError = true;
    }else{
      this.validateRandomKey(item.randomKey);
    }
    let pwdRule = Object.assign({},this.$root.pwdRule);
    pwdRule.message = this.$t(pwdRule.message);
    this.rules.newPwd.push(pwdRule) // @todo 缺少工号信息暂无法添加密码加强判断
  },
  data() {
    return {
      form: {
        newPwd: "",
        confirm: "",
      },
      randomKey: "",
      type: "",
      rules: {
          newPwd:[{required: true, message: `${this.$t('L45003')}`, trigger: "blur"},{
            validator: (rule, value, callback) => {
              if (value.toLowerCase().indexOf('byd')!=-1) {
                callback(new Error(this.$t("L10235")));
              } else {
                callback();
              }
            },
            trigger: "blur",
          }],
          confirm:[{required: true, validator: this.confirmValidate , trigger: "blur"}],
      },
      showMain: true,
      showError: false,
      showMessage: false,
      tips: "",
      loginUrl: `${window.location.origin}${process.env.BASE_URL?process.env.BASE_URL:'/'}login`,
      rTime: 5
    }
  },
  methods: {
      resetPwd(formName) {
        this.$refs[formName].validate((valid) => {
        if (valid) {
          var formParam = {}
          formParam.newPwd = MD5(this.form.newPwd+this.$root.salt).toString()
          formParam.confirm = formParam.newPwd
          formParam.randomKey = this.randomKey
          this.$http.resetPwd(formParam).then((res) => {
            this.tips = res.TIPS;
            this.showMain = false;
            this.showMessage = true;
            this.send();
          })
        }else{
          this.$message.warning(`${this.$t('L40007')}`);
        }
        })
      },
      validateRandomKey(randomKey){
          var formParam = {}
          formParam.randomKey = randomKey
          this.$http.validateRandomKey(formParam).then((response) => {
            if(response.DATA=="FAIL"){
              this.showMain = false;
              this.showError = true;
            }else{
              this.showMain = true;
              this.showError = false;
            }
          })
      },
      confirmValidate(rule, value, callback){
        if (value === '') {
          callback(new Error(`${this.$t('L45004')}`));
        } else {
          if(value != this.form.newPwd){
            callback(new Error(`${this.$t('L45023')}`));
          }else{
            callback();
          }
        }
      },
      send() {
        // 倒计时
        let interval = window.setInterval(() => {
            if (--this.rTime <= 0) {
            this.$router.push({path: `/login`})
            window.clearInterval(interval);
            }
        }, 1000);
      }
  }
}
</script>

<style>
.resetPwd{
  background-image:var(--tloginbg);
  height: 100vh;
  background-repeat: no-repeat;
  background-size:cover;
  background-position-x: center;
}
.resetPwd h2{font-size:32px;line-height:60px}
.resetPwd h3{font-size:18px}
.resetPwd .el-header{padding:0}
.resetPwd .container{
  margin: 0 auto;
  max-width: 960px;
  min-width: 360px;
  padding-top: 150px;
  color: var(--fontColorBox);
}
.el-container.mainbox{position: relative;}
.resetPwd .el-footer{
  border-top: none;
  position: fixed;
  bottom: 0px;
  text-align: center;
  padding: 0;
  left: 0;
  line-height: 60px;
  right: 0;
  color: var(--fontColorFooter)
}
.resetPwd .el-aside{
  max-width: 595px;
  min-width:420px;
  padding-top: 30px; /** 80px */
}
.resetPwd .el-main{
  min-width: 365px;
  max-width: 365px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  padding: 24px 40px;
  margin: 0 auto;
}
.el-button.lbtn{width: 100%;background-image: var(--loginbtn);border: none;
    font-size: 16px;
    border-radius: 2px;
    color: #fff;}
</style>
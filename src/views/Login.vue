<!--
@author: wang.weili
@since : 2020/12/23
@description: Login页支持以下query参数
| 名称 | 示例 | 说明 | 
| ------ | ------ | ------ |
| mock | /login?mock=true | 是否使用模拟数据服务 |
| baseUrl | /login?baseUrl=http://10.12.5.20008/ | 改写axios的baseUrl，移动端不支持，可能有bug |
| redirect | /login?redirect=/config | 登录后跳转至/config页面，默认跳转至process.env.VUE_APP_HOME配置路由 |
| encrypted | /login?encrypted=xxx | 加密方式自动登录 |
| token | /login?token=xxx | token方式自动登录，同用户模块 |
| source | /login?source=xxx | token方式自动登录，不同用户模块source传用户模块地址 |
| projectId | /login?token=xxx&&projectId=xxx | 自动登录某个项目 |
-->
<template>
  <div class="login">
    <el-container class="container">
      <el-main>
        <el-row class="headlayer">
          <el-col :span="18">
            <h2>{{ $t("L10206") }}</h2>
            <h6 class="en-hide ms-hide">{{$t('L10051')}}</h6>
          </el-col>
          <el-col :span="6">
            <div class="bydlogo float-right"></div>
          </el-col>
        </el-row>
        <el-row class="sublayer">
          <el-col class="ms-hide" :span="4">&bull; {{ $t("L10207") }}</el-col>
          <el-col class="ms-hide" :span="4">&bull; {{ $t("L10208") }}</el-col>
          <el-col class="ms-hide" :span="6">&bull; {{ $t("L10209") }}</el-col>
          <el-col :sm="6" :xs="12"
            >{{ $t("L10052") }}丨
            <div class="syslogo">{{$t('L10053')}}</div></el-col
          >
          <el-col :sm="4" :xs="12">
            <el-select
              v-model="lang"
              class="float-right"
              size="mini"
              @change="handleChange"
              style="width: 105px"
            >
              <el-option
                v-for="item in $root.langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <svg class="icon-inner langIcon">
                <use xlink:href="#language-outline"></use>
              </svg> -->
          </el-col>
        </el-row>
        <div class="midlayer" v-if="isChangePwd">
          <div class="center">{{ $t("L00037") }}</div>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item class="mt18" :label="$t('L10201')" prop="user">
              <el-input v-model="form.user" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item class="mt18" :label="$t('L00038')" prop="pwd">
              <el-input v-model="form.pwd" show-password size="medium">
              </el-input>
            </el-form-item>
            <el-form-item class="mt18" :label="$t('L00039')" prop="newPwd">
              <el-input v-model="form.newPwd" show-password size="medium">
              </el-input>
            </el-form-item>
            <el-form-item class="mt18" :label="$t('L00040')" prop="repeat">
              <el-input v-model="form.repeat" show-password size="medium">
              </el-input>
            </el-form-item>
          </el-form>
          <el-button @click="chgPsw" class="lbtn">{{ $t("L00006") }}</el-button>
          <div class="mt10">
            <span class="error float-left">{{ errMsg }}</span>
            <el-link @click="goBack" class="float-right">{{
              $t("L00012")
            }}</el-link>
          </div>
        </div>
        <div class="midlayer" v-else>
          <el-input
            v-if="pageType == 1"
            type="text"
            class="mt18"
            size="medium"
            v-model.trim="form.ip"
            @change="getProjectList"
          >
            <template slot="prepend">{{ prefix }}</template>
          </el-input>
          <el-select v-if="!$root.project.id" v-model="projectId" class="mt18" size="medium">
            <svg slot="prefix" class="icon-inner">
              <use xlink:href="#client"></use>
            </svg>
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span v-if="!loginDirectly" @keyup.enter="submitForm">
            <el-input
              v-model="form.user"
              clearable
              class="mt18"
              :placeholder="$t('L10201')"
              size="medium"
            >
              <svg slot="prefix" class="icon-inner">
                <use xlink:href="#user"></use>
              </svg>
            </el-input>
            <el-input
              v-if="pwdPolicy"
              v-model="form.pwd"
              :style="pwdType ? '-webkit-text-security:disc' : ''"
              class="mt18"
              :placeholder="$t('L10202')"
              size="medium"
            >
              <svg slot="prefix" class="icon-inner" v-if="!publicKey">
                <use xlink:href="#psw"></use>
              </svg>
              <svg
                slot="prefix"
                class="icon-inner"
                v-if="publicKey"
                style="font-size: 18px"
              >
                <use xlink:href="#doublePsw"></use>
              </svg>
              <i
                v-if="pwdType"
                slot="suffix"
                class="el-icon-view sficon"
                @click="pwdType = !pwdType"
              ></i>
              <svg
                v-else
                slot="suffix"
                class="icon-inner"
                @click="pwdType = !pwdType"
              >
                <use xlink:href="#eye-off"></use>
              </svg>
            </el-input>
            <el-input
              v-else
              v-model="form.pwd"
              show-password
              class="mt18"
              :placeholder="$t('L10202')"
              size="medium"
            >
              <svg slot="prefix" class="icon-inner" v-if="!publicKey">
                <use xlink:href="#psw"></use>
              </svg>
              <svg
                slot="prefix"
                class="icon-inner"
                v-if="publicKey"
                style="font-size: 18px"
              >
                <use xlink:href="#doublePsw"></use>
              </svg>
            </el-input>
          </span>
          <span v-if="remPwd" @keyup.enter="submitForm">
            <el-input
              v-model="form.captcha"
              class="mt18"
              :placeholder="$t('L10214')"
              style="width: 169px"
              @input="checkCode"
              size="medium"
            >
              <svg slot="prefix" class="icon-inner">
                <use xlink:href="#captcha"></use>
              </svg>
              <i
                slot="suffix"
                v-if="checked"
                class="el-input__icon el-icon-check"
              ></i>
            </el-input>
          </span>
          <span v-if="remPwd" id="picy"></span>
          <div class="mt10">
            <input v-if="false" type="checkbox" v-model="remember"/><span v-if="false" class="rem">{{$t('L10212')}}</span>
            <span class="error ml10">{{ errMsg }}</span>
          </div>
          <el-link
            v-if="!loginDirectly"
            @click="resetPwd"
            class="float-right"
            >{{ $t("L10213") }}</el-link
          >
          <el-button
            v-if="loginDirectly"
            @click="loginDirect"
            class="lbtn mt22"
            >{{ $t("L10203") }}</el-button
          >
          <el-button v-else @click="submitForm" class="lbtn mt22">{{
            $t("L10203")
          }}</el-button>
        </div>
        <p class="ms-hide" @click="getMsg(true)">{{ msg }}</p>
      </el-main>
    </el-container>
    <el-footer
      >&copy; Copyright {{ $t("L00017") }}
      {{ $root.getAppVersion() }}</el-footer
    >
    <!-- 忘记密码dialog Auther：xu.weijie -->
    <el-dialog width="30%" :title="$t('L45008')" :visible.sync="outerVisible">
      <el-dialog
        width="30%"
        :title="$t('L45009')"
        :visible.sync="innerVisible"
        append-to-body
      >
        <h3>{{ $t("L45011") }}{{ email }}，{{ $t("L45012") }}</h3>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">{{
            $t("L00007")
          }}</el-button>
          <el-button type="primary" @click="setMail">{{
            $t("L00006")
          }}</el-button>
        </div>
      </el-dialog>
      <h3>{{ $t("L45010") }}</h3>
      <br />
      <el-input
        v-model="workNo"
        clearable
        :placeholder="$t('L45013')"
        style="width: 200px"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">{{ $t("L00007") }}</el-button>
        <el-button type="primary" @click="setMail">{{
          $t("L00006")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GVerify from "../plugins/gVerify.js";
import { AES, MD5, enc } from "crypto-js";
import { JSEncrypt } from "jsencrypt";
const prefix = "http://",
  nonce = "bn000f";
let verifyCode,
  msgIdx = 0;
export default {
  name: "login",
  created() {
    let pwdRule = Object.assign({}, this.$root.pwdRule);
    pwdRule.message = this.$t(pwdRule.message);
    this.rules.newPwd = [pwdRule];
    if (this.$route.query.mock === "true") {
      this.$http.mock = true;
      this.$http.setForMock();
    } else if (this.$route.query.baseUrl) {
      this.$http.setBaseUrl(this.$route.query.baseUrl);
    }
    this.$root.clearSession();
    this.getProjectList();
    this.getList();
    this.getPublicKey();
    if(this.remPwd){
      let user = localStorage.getItem('aUser');
      if(user){
        try{
          let bytes  = AES.decrypt(user, nonce);
          user = JSON.parse(bytes.toString(enc.Utf8));
          this.form.user = user.account;
          this.form.pwd = user.password;
          this.remember = true;
        }catch(e){
          localStorage.removeItem('aUser');
        }
      }
    }
  },
  mounted() {
    if(this.remPwd)
    verifyCode = new GVerify({
        id : "picy",
        type : "blend"
    });
  },
  computed: {
    pageType() {
      return this.$store.state.pageType;
    },
  },
  data() {
    return {
      prefix: prefix,
      form: {
        user: "",
        pwd: "",
        newPwd: "",
        repeat: "",
        captcha: "",
        ip:
          localStorage.getItem("aHost") ||
          process.env.VUE_APP_DEV.substring(
            prefix.length,
            process.env.VUE_APP_DEV.length - 1
          ),
      },
      rules: {
        repeat: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error(this.$t("L00042")));
              } else if (value !== this.form.newPwd) {
                callback(new Error(this.$t("L00043")));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      pwdPolicy: this.$root.pwdPolicy,
      pwdType: true,
      remPwd: this.$root.remPwd,
      remember: false,
      checked: false,
      errMsg: "",
      lang: this.$i18n.locale,
      projectId: "",
      projects: [],
      msg: "",
      msgList: [],
      outerVisible: false,
      innerVisible: false,
      workNo: "",
      email: "",
      isChangePwd: false,
      loginDirectly: false,
      publicKey: "",
    };
  },
  methods: {
    getProjectList() {
      try {
        this.$root.project = JSON.parse(process.env.VUE_APP_PROJECT_ONLY);
        if (this.$root.project.id) {
          this.projects.push(this.$root.project);
          this.projectId = this.$root.project.id;
        }
      } catch (e) {
        // console.log(e);
        if (this.$store.state.pageType == 1 && !this.form.ip) {
          this.errMsg = "请输入地址";
        } else if (
          this.$store.state.pageType == 1 &&
          !this.$root.validIp(this.form.ip)
        ) {
          this.errMsg = "地址格式不正确";
        } else {
          let formParam = {
            sysCode: process.env.VUE_APP_CODE,
          };
          if (this.$store.state.pageType == 0) {
            formParam.hostName = process.env.NODE_ENV == 'development'?process.env.VUE_APP_DEV.substring(prefix.length,process.env.VUE_APP_DEV.length-1):window.location.host;
          } else {
            formParam.hostName = this.form.ip;
          }
          this.projectId = "";
          this.projects = [];
          this.$http.showError = false;
          this.$http
            .getList(this.getConfigUrl("user/exi/mesSysProject"), formParam)
            .then((res) => {
              this.errMsg = "";
              this.projects = res.DATA;
              if (
                (this.$route.query.token || this.$route.query.encrypted) &&
                (this.projects.length == 1 || this.$route.query.projectId)
              ) {
                if (this.projects.length == 1) {
                  this.projectId = this.projects[0].id;
                } else {
                  // 判断传入projectId是否匹配
                  let pr = this.projects.find(
                    (el) => el.id == this.$route.query.projectId
                  );
                  if (pr) this.projectId = this.$route.query.projectId;
                }
                this.loginDirect();
                return;
              } else if (this.$route.query.token || this.$route.query.encrypted) {
                this.loginDirectly = true;
              }
              try {
                let project = JSON.parse(localStorage.getItem(`${process.env.VUE_APP_CODE}_Project`));
                let projectInList = this.projects.find(
                  (el) =>
                    project &&
                    el.id == project.id &&
                    el.projectCode == project.projectCode
                );
                if (projectInList) {
                  this.projectId = projectInList.id;
                } else {
                  this.projectId = "";
                }
              } catch (err) {
                this.errMsg = err.toString();
              }
            })
            .catch((err) => {
              this.errMsg = "exi/mesSysProject：" + err.MESSAGE;
            });
        }
      }
      
    },
    getList() {
      if (this.$store.state.pageType == 0) {
        this.$http.showError = false;
        this.$http.axios
          .post(
            "user/exi/mesSysMsg/getList",
            {
              type: 1,
              status: 1,
              // nouce: this.$root.generateRandom(false,4)
            },
            {
              headers: {
                showError: false,
                token: "",
              },
            }
          )
          .then((res) => {
            this.msgList = res.DATA;
            this.getMsg();
          });
      }
    },
    getMsg(refresh) {
      let l = this.msgList.length;
      if (refresh) {
        msgIdx = msgIdx == l - 1 ? 0 : msgIdx + 1;
      } else {
        msgIdx = Math.floor(Math.random() * l);
      }
      this.msg =
        this.$i18n.locale == "zh-CN"
          ? this.msgList[msgIdx].content
          : this.msgList[msgIdx].contentEn;
    },
    handleChange(lang) {
      this.$root.handleLang(lang);
      this.msg =
        this.$i18n.locale == "zh-CN"
          ? this.msgList[msgIdx].content
          : this.msgList[msgIdx].contentEn;
    },
    submitForm() {
      for (let key in this.form) {
        this.form[key] = this.form[key].trim();
      }
      if (!this.projectId) {
        this.errMsg = this.$t("L10231");
      } else if (!this.form.user) {
        this.errMsg = this.$t("L10204");
      } else if (!this.form.pwd) {
        this.errMsg = this.$t("L10205");
      } else if(this.remPwd&&!this.form.captcha){
        this.errMsg= this.$t('L10215');
      } else if(this.remPwd){
        let res = verifyCode.validate(this.form.captcha);
        if(res){
          verifyCode.refresh();
          this.form.captcha = ""
          if (this.publicKey) {
            this.loginOaAuth();
          } else {
            this.login();
          }
        }else{
          this.errMsg= this.$t('L10216');
        }
      } else if (this.publicKey) {
        this.loginOaAuth();
      } else {
        this.login();
      }
    },
    checkCode() {
      this.checked = verifyCode.validate(this.form.captcha);
    },
    getConfigUrl(url) {
      if (this.$store.state.pageType == 1) {
        return this.prefix + this.form.ip + "/" + url;
      }
      return url;
    },
    login() {
      this.errMsg = "";
      let user = {
        account: this.form.user,
        password: MD5(this.form.pwd + this.$root.salt).toString(),
        sysCode: process.env.VUE_APP_CODE,
      };
      if (this.$root.isMobile() || !this.pwdPolicy) {
        user.type = "Client";
        user.single = true;
      }
      this.$http.setProjectId(this.projectId);
      if (this.$store.state.pageType == 1) {
        this.$http.setBaseUrl(this.prefix + this.form.ip);
      }
      this.$http.showLoading = true;
      this.$http.showError = false;
      this.$http
        .login(user)
        .then((response) => {
          if (response.DATA.IS_CHANGE_PWD == true) {
            this.isChangePwd = true;
            return false;
          }
          if (this.remember) {
            localStorage.setItem(
              "aUser",
              AES.encrypt(JSON.stringify({
                account: this.form.user,
                password: this.form.pwd,
              }), nonce).toString()
            );
          } else {
            localStorage.removeItem("aUser");
          }
          this.loginPass(response);
        })
        .catch((err) => {
          this.errMsg = err.MESSAGE || err.toString();
        });
    },
    loginDirect() {
      if (this.$route.query.encrypted) {
        this.loginByCiphertext();
      } else if (this.$route.query.token) {
        this.getAuthorityMenu();
      }
    },
    getAuthorityMenu() {
      if (!this.projectId) {
        if (this.$route.query.projectId) {
          this.$message.error(`项目ID：${this.$route.query.projectId}不正确`);
        } else {
          this.errMsg = this.$t("L10231");
        }
        return;
      }
      this.$http.setProjectId(this.projectId);
      let url = `${this.$http.user_url}getAuthorityMenu?projectId=${this.projectId}&code=${this.$route.query.token}`;
      if (this.$route.query.source)
        url += `&source=${this.$route.query.source}`;
      this.$http.axios
        .get(url, {
          headers: {
            projectId: this.projectId,
          },
        })
        .then((response) => {
          if (response.DATA.IS_CHANGE_PWD == true) {
            this.isChangePwd = true;
            return false;
          }
          this.loginPass(response);
        });
    },
    loginByCiphertext() {
      if (!this.projectId) {
        if (this.$route.query.projectId) {
          this.$message.error(`项目ID：${this.$route.query.projectId}不正确`);
        } else {
          this.errMsg = this.$t("L10231");
        }
        return;
      }
      this.$http.setProjectId(this.projectId);
      const url = `${
        this.$http.user_url
      }loginByCiphertext?ciphertext=${encodeURIComponent(
        this.$route.query.encrypted
      )}`;
      this.$http.axios
        .post(url, {
          headers: {
            projectId: this.projectId,
          },
        })
        .then((response) => {
          if (response.DATA.IS_CHANGE_PWD == true) {
            this.isChangePwd = true;
            return false;
          }
          this.loginPass(response);
        });
    },
    resetPwd() {
      this.workNo = this.form.user;
      this.outerVisible = true;
    },
    getEmail() {
      var formParam = {};
      if (this.workNo) {
        formParam.workNo = this.workNo;
        this.$http.axios
          .post(this.getConfigUrl("user/exi/resetPwd/getEmail"), formParam)
          .then((res) => {
            if (res.DATA != null) {
              this.email = res.DATA;
              this.innerVisible = true;
            } else {
              alert(`${this.$t("L45014")}`);
            }
          });
      } else {
        alert(`${this.$t("L45013")}`);
      }
    },
    setMail() {
      this.innerVisible = false;
      this.outerVisible = false;
      var formParam = {};
      formParam.workNo = this.workNo;
      // formParam.email = this.email;
      //@todo 后端去掉写死flames-web
      if (this.$store.state.pageType == 0) {
        formParam.baseUrl = `${window.location.origin}${
          process.env.BASE_URL ? process.env.BASE_URL : "/"
        }`;
      } else {
        formParam.baseUrl = `${this.prefix + this.form.ip}${
          process.env.BASE_URL ? process.env.BASE_URL : "/"
        }`;
      }
      this.$http.axios
        .post(this.getConfigUrl("user/exi/resetPwd/sendResetMail"), formParam)
        .then(() => {
          this.$notify({
            title: `${this.$t("L45015")}`,
            message: `${this.$t("L45016")}`,
            type: "success",
            duration: 0,
          });
        });
    },
    chgPsw() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.user) {
            this.errMsg = this.$t("L10204");
          } else if (!this.form.pwd) {
            this.errMsg = this.$t("L10205");
          } else {
            this.$http.showError = false;
            this.$http.axios
              .post(`${this.$http.user_url}changePwd`, {
                workNo: this.form.user,
                oldPwd: MD5(this.form.pwd + this.$root.salt).toString(),
                newPwd: MD5(this.form.newPwd + this.$root.salt).toString(),
              })
              .then(() => {
                this.errMsg = "";
                this.$message.success(this.$t("L00044"));
                this.isChangePwd = false;
                this.form.pwd = "";
              })
              .catch((err) => {
                this.errMsg = err.MESSAGE || err.toString();
              });
          }
        }
      });
    },
    goBack() {
      this.isChangePwd = false;
      this.form.pwd = "";
      this.form.newPwd = "";
      this.form.repeat = "";
      this.errMsg = "";
    },
    loginPass(response) {
      let session = {
        user: response.DATA.USER,
        token: response.DATA.TOKEN,
      };
      this.$http.setToken(session.token)
      let pr = this.projects.find((el) => el.id == this.projectId);
      this.$root.project = pr
      this.$http.setProjectId(pr.id);
      this.$http.projectCode = pr.projectCode;
      localStorage.setItem(`${process.env.VUE_APP_CODE}_Project`, JSON.stringify(pr));
      let auth = response.DATA.AUTHORITIES;
      this.$root.auth = this.$root.deepClone(auth)
      this.$root.initSession(auth)
      this.$root.getAuthed = true
      localStorage.setItem(`${process.env.VUE_APP_CODE}_Auth`, JSON.stringify(this.$root.auth));
      if (response.DATA.OBJECT) {
        session.user.roleType = response.DATA.OBJECT.roleType;
      }
      localStorage.setItem("aHost", this.form.ip);
      this.$store.commit('setUser', session.user);
      localStorage.setItem("aSession", JSON.stringify(session));
      this.$app
        .beforeHome(this)
        .then(() => {
          let fullPath = this.$route.query.redirect;
          if (fullPath) {
            this.$router.push(fullPath);
          } else {
            const homePath = process.env.VUE_APP_HOME
              ? process.env.VUE_APP_HOME
              : "/";
            this.$router.push({ path: homePath });
          }
        })
        .catch((err) => {
          this.errMsg = err.MESSAGE || err.toString();
        });
    },
    getPublicKey() {
      this.$http.showError = false;
      this.$http.axios
        .post(`${this.$http.user_url}getPublicKey`, null, {
          headers: {
            showError: false,
          },
        })
        .then((response) => {
          this.publicKey = response.DATA;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loginOaAuth() {
      this.errMsg = "";
      let user = {
        account: this.form.user,
        password: MD5(this.form.pwd + this.$root.salt).toString(),
        sysCode: process.env.VUE_APP_CODE,
      };
      if (this.$root.isMobile() || !this.pwdPolicy) {
        user.type = "Client";
        user.single = true;
      }
      const rsa = new JSEncrypt();
      rsa.setPublicKey(this.publicKey);
      const oaIdentification = rsa.encrypt(this.form.pwd);
      this.$http.setProjectId(this.projectId);
      if (this.$store.state.pageType == 1) {
        this.$http.setBaseUrl(this.prefix + this.form.ip);
      }
      this.$http.showLoading = true;
      this.$http.showError = false;
      this.$http.axios
        .post(`${this.$http.user_url}loginWithOaAuthentication`, user, {
          headers: {
            oaIdentification: encodeURIComponent(oaIdentification),
            showLoading: true
          },
        })
        .then((response) => {
          if (response.DATA.IS_CHANGE_PWD == true) {
            this.isChangePwd = true;
            return false;
          }
          if (this.remember) {
            localStorage.setItem(
              "aUser",
              AES.encrypt(JSON.stringify({
                account: this.form.user,
                password: this.form.pwd,
              }), nonce).toString()
            );
          } else {
            localStorage.removeItem("aUser");
          }
          this.loginPass(response);
        })
        .catch((err) => {
          this.errMsg = err.MESSAGE || err.toString();
        });
    },
  },
};
</script>

<style>
.login {
  background-image: var(--tloginbg);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: center;
  color: var(--fontColorBox);
}
.login .el-container {
  justify-content: center;
  align-items: center;
}
.login .el-footer {
  border-top: none;
  text-align: center;
  line-height: 60px;
  color: var(--fontColorFooter);
}
.login .el-main {
  width: 910px;
  min-height: 480px;
  padding: 35px 100px;
  background-size: 100% 100%;
  background-position: 50%;
  background-image: var(--loginbox);
  background-repeat: no-repeat;
  border-radius: 2px;
}
.login h6 {
  font-size: 12px;
  line-height: 25px;
  height: 25px;
}
.login h2 {
  font-weight: bold;
  font-size: 28px;
  height: 36px;
}
/* .syslogo{height:18px;display:inline-block;background-image: var(--syslogo);background-repeat: no-repeat;
    background-size: contain;width: 90px;
    vertical-align: text-bottom;} */
.syslogo {
  color: transparent;
  display: inline-block;
  height: 18px;
  background: var(--syslogo);
  -webkit-background-clip: text;
  font-size: 18px;
  font-weight: bolder;
  font-style: italic;
}
.headlayer {
  height: 70px;
}
.sublayer {
  font-size: 16px;
}
.sublayer img {
  vertical-align: middle;
  margin-top: -5px;
}
.sublayer .ms-hide {
  font-size: 14px;
  font-weight: bold;
}
.midlayer {
  padding-left: 410px;
  padding-top: 20px;
}
.login p {
  cursor: pointer;
  width: 90%;
  font-size: 10px;
}
.login .el-select {
  width: 100%;
}
.el-button.lbtn {
  width: 100%;
  background-image: var(--loginbtn);
  border: none;
  font-size: 16px;
  border-radius: 40px;
  color: #fff;
  height: 40px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.el-button.lbtn:hover,
.el-button.lbtn:focus {
  color: #fff;
}
.rem {
  color: var(--fontColorBox);
  font-size: 12px;
  margin-left: 6px;
  vertical-align: top;
}
.error {
  font-size: 12px;
  color: var(--fontColorError);
}
.login .el-input__prefix {
  font-size: 20px;
  padding-left: 6px;
}
.login .el-form-item__label{
  color: var(--fontColorBox)
}
.midlayer .el-input-group__prepend {
  border-radius: 40px 0 0 40px;
}
.midlayer .el-input__inner {
  border-radius: 40px;
  height: 40px;
}
.midlayer .el-input--prefix .el-input__inner {
  padding-left: 40px;
}
.el-input__prefix .icon-inner {
  margin-top: 10px;
  font-size: 15px;
  color: #8c8c8c;
}
.el-input__suffix .icon-inner {
  margin-top: 10px;
}
.midlayer .el-link--default,
.midlayer .el-link--default:hover {
  color: var(--fontColorBox) !important;
}
#picy {
  /* vertical-align: middle;*/
  margin-left: 12px;
  position: relative;
  top: 13px;
}
#verifyCanvas {
  width: 102px;
  height: 37px;
}
i.sficon {
  font-size: 15px;
  padding-top: 10px;
  -webkit-text-security: none;
}
.langIcon {
  margin: 3px;
  float: right;
}

@media screen and (max-width: 767px) {
  .login .el-main {
    background: var(--loginboxmobile) no-repeat;
    border-radius: 2px;
    margin: 0 auto;
    width: 100%;
    background-size: 100% 100%;
    background-position: 50%;
    padding-left: 100px;
    padding-right: 90px;
  }
  .login h2 {
    font-size: 20px;
  }
  .en-US .login h2 {
    font-size: 14px;
  }
  .headlayer {
    height: 50px;
  }
  .midlayer {
    padding: 0;
  }
}
@media screen and (max-width: 400px) {
  .login .el-main {
    padding-left: 45px;
    padding-right: 35px;
  }
}
</style>
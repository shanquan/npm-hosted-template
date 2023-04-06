# Demo

`git clone -b frontend-whole ssh://git@10.12.5.188:10022/appdev/interview`

前端适配：修改`vue.config.js`中的`VUE_APP_DEV`、`VUE_APP_CODE`、`VUE_APP_PRE_URL`、`VUE_APP_MENU_ROOT`

框架新增需求统一从`frontend-whole`新建分支，同时合并至其他前端分支

说明：
1. 新项目请在`gitlab`中新建前端项目，复制此分支代码作为初始提交
2. 所有接口均要求符合`public/mock/success.json`和`public/mock/fail.json`格式
3. 如非必要，请不要修改框架公共文件(`api.js`)。页面发起请求后会经过请求拦截器和响应拦截器处理。请求拦截器中，除了公共模块（如`user`模块）的请求外，其余都会自动添加项目前缀; 响应拦截器中会统一按照约定格式提示失败情况（连接失败或`RESULT:FAIL`），页面中默认仅需处理`RESULT:PASS`的情况。[参考文档：API请求](http://10.12.5.188:10023/appdev/mes3/-/wikis/指南/API请求)
4. `user`模块包含：用户、菜单、项目、角色数据，以下相关接口均需传递`sysCode`参数，请求`header`里面包含`projectId`
   - login
   - mesSysProject/getList|removeById
   - mesSysProjectUser/getList
   - mesSysMenu/all
   - mesSysRole/removeById
   - mesSysUser/removeById
5. 统一风格增删改查管理页面代码生成项目：<http://10.12.5.188:10023/appdev/gencode>，拷贝前端文件后，可通过<http://localhost:8080/admin/login?mock=true&redirect=/url>

## SSO 两种方案
方案一：`api.http/SSOlogin1`接口，通过`token`调用`source/checkCode`接口鉴权，目标站点需要连接`source`站点，不需要两个站点用户密码同步；
方案二：`api.http/SSOlogin2`接口获取加密密文`encrypted`，目标站点通过`login`接口解密鉴权，目标站点不需要连接`source`，需要两个站点用户密码同步；

### 运营平台两种SSO兼容方案
前端通过应用管理的URL配置`encrypted`参数或`token`参数进行判断：
如果配置了`token`参数未配置`encrypted`参数，采用方案一；
如果配置了`encrypted`参数，采用方案二；

PS：后端用户模块也同时支持两种方案，根据系统实际情况选择。

### 运营平台应用管理配置URL的格式参考
唯一项目自动登录，token不同用户模块时需要传source参数
- <http://xxx/login?token=123>
- <http://xxx/login?token=123&source=xxx>
- <http://xxx/login?encrypted=123>

多项目通过增加projectId参数自动登录，如果不传projectId，则跳转到站点后需要下拉选择一个项目点确定后登录；
- <http://xxx/login?token=123&projectId=3>
- <http://xxx/login?token=123&source=xxx&projectId=3>
- <http://xxx/login?encrypted=123&projectId=30>

## 密码修改接口提示前端改为后端获取
未启用用户密码同步的服务，接口提示文字`TIPS`："密码已修改"；
启用用户密码同步的服务，接口提示文字`TIPS`：“密码更新成功，电子事业群此工号所有登录系统已同步更改！”
相关接口：
- mesSysUser/changePwd
- mesSysUser/updateById
- user/exi/resetPwd/resetPwd


## Project setup
```bash
npm install
# or
npm install --registry=http://10.12.5.188:10018/repository/npm-registry
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
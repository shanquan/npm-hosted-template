# template

新前端管理项目请从本项目派生，并保留`template`基础分支便于执行同步更新模板代码。项目结构如下：
- 框架公共文件(文件注释包含：框架公共文件，慎重修改)
  - App.vue
  - main.js
  - api.js
  - assets/main.css：框架css
  - langs/zh-CN.js
  - langs/zh-CN.base.js
  - routers/index.js
  - theme/index.css：主题css
  - views/Login.vue
- 项目定制配置文件
  - app/assets：应用定制css及资源
  - app/components/：应用公共组件
  - views/Home.vue
  - app/main.js：项目定制全局数据及公共方法,directives,filters
  - app/api.js：项目定制的`crud`方法、微服务`url`、拦截器判断方法及接口日志处理方法
- 用户模块公共系统管理模块
  参见`package.json`中的依赖`user-sys`

## 前端适配

前端适配：修改`vue.config.js`中的`VUE_APP_DEV`、`VUE_APP_CODE`（即`sysCode`）、`VUE_APP_PRE_URL`、`VUE_APP_MENU_ROOT`

说明：
1. `process.env.VUE_APP_PROJECT_ONLY`可配置单项目应用，配置后登录界面隐藏项目下拉列表，如果`projectCode`配置为空，则拦截器中路径不会添加项目前缀，更适合前后端统一部署
2. `main.js`中支持一些全局配置变量（`appConfigDefault`），但是不要修改`main.js`，建议通过`app/main.js`中的`config`对象进行配置，支持覆盖同名变量
3. `process.env.VUE_APP_PRE_URL`为主后端服务路径，如果项目需要多个后端服务，建议在`app/api.js`下添加，依然支持通过`this.$http`引用（遵循不修改框架公共文件`api.js`的原则）；
4. `app/main.js`中的`beforeHome`函数，支持用户模块的登录接口调用成功后继续执行项目定制操作（数据缓存、权限判断等）；遵循不修改框架公共文件`Login.vue`文件的原则
5. 所有接口均要求符合`public/mock/success.json`和`public/mock/fail.json`格式
6. 如非必要，请不要修改框架公共文件。页面发起请求后会经过请求拦截器和响应拦截器处理。请求拦截器中，除了公共模块（如`user`模块或`projectCode`为空）的请求外，其余都会自动添加项目代码前缀; 响应拦截器中会统一按照约定格式提示失败情况（连接失败或`RESULT:FAIL`），页面中默认仅需处理`RESULT:PASS`的情况。[参考文档：API请求](http://10.12.5.188:10023/appdev/mes3/-/wikis/指南/API请求)
7. `user`模块包含：用户、菜单、项目、角色数据，以下相关接口均需传递`sysCode`参数，请求`header`里面包含`projectId`
   - login
   - mesSysProject/getList|removeById
   - mesSysProjectUser/getList
   - mesSysMenu/all
   - mesSysRole/removeById
   - mesSysUser/removeById
8. 统一风格增删改查管理页面代码生成项目：<http://10.12.5.188:10023/appdev/gencode>，拷贝前端文件后，可通过<http://localhost:8080/admin/login?mock=true&redirect=/url>

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
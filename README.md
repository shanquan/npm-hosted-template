# template

新前端管理项目请从本项目派生，并保留`template`基础分支便于执行同步更新模板代码（[项目同步参考](http://10.12.5.188:10023/appdev/frontend-dev#frontend-sample)）。项目结构如下：
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
  - app/config.js：项目定制配置、定制`crud`方法、微服务`url`、拦截器判断方法及接口日志处理方法
- 用户模块公共系统管理模块
  参见`package.json`中的依赖`user-sys`

## 前端适配

前端适配：修改`vue.config.js`中的`VUE_APP_DEV`、`VUE_APP_CODE`（即`sysCode`）；修改`app/config.js`中的`app_url`、`appConfig.menuRoot`

说明：
1. `process.env.VUE_APP_PROJECT_ONLY`可配置单项目应用，配置后登录界面隐藏项目下拉列表，如果`projectCode`配置为空，则拦截器中路径不会添加项目前缀，更适合前后端统一部署
2. `main.js`中支持一些全局配置变量（`appConfigDefault`），但是不要修改`main.js`，建议通过`app/config.js`中的`appConfig`对象进行配置，支持覆盖同名变量
3. `app_url`为主后端服务路径，如果项目需要多个后端服务，建议在`app/config.js`下添加，依然支持通过`this.$http`引用（遵循不修改框架公共文件`api.js`的原则）；
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
8. 统一风格增删改查管理页面代码生成项目：<http://10.12.5.188:10023/appdev/gencode>，拷贝前端文件后，可通过<http://localhost:8080/admin/login?mock=true&redirect=/url>访问
9. `app/components/common`新增标准管理模板页面，支持接口配置`model.json`页面数据模型定制页面（`mock`设置`true`可测试，但未经真实项目验证，可能存在不完善需要一些优化）

## 一套代码适配不同项目需求处理
### 原则
- 尽可能使用同一套代码，便于后续开发及维护
- 如因业务差异、组织结构或互相影响异常等需要切主分支，则前端、后端要同步切分支且分支名相同；客户端、PDA及看板由开发人员视情况评估

### 前端实施建议
1. 文本显示与语言资源定制区别

    同一套代码配置不同登录页和主页名称或静态文字，优先根据`VUE_APP_CODE`在`app/config.js`的`langs.VUE_APP_CODE`进行配置，如需登录的内容可根据`VUE_APP_CODE.projectName`进行定制配置；如`VUE_APP_CODE`和`project`均一致则在`vue.config.js`中配置`VUE_APP_CUSTOMIZE`（如`Car_Trial`）及`config[VUE_APP_CUSTOMIZE]`，并在`app/config.js`配置`appApi|appConfig|langs`分别实现定制配置覆盖

    共同功能页面内文字展示不同，优先业务沟通采用统一术语，如实在无法统一优先根据`VUE_APP_CODE.projectName`进行配置区分，再根据`VUE_APP_CUSTOMIZE`配置区分；

2. 前端写死的数据配置项区别

    统一改用后端接口配置数据，替换页面写死的数据。可在系统参数配置、作业规则、自定义数据、数据字典、素材组管理等页面配置

    **注意事项**：新系统必须检查和配置的参数变量统一配置在特定分类或组名下（如initial）进行区分；其他可选配置项在代码上必须考虑兼容未配置的情况；所有配置都需要添加文字说明，同一功能的配置尽量简化，不宜超过3步。

3. 页面显示与设计区别或较小的逻辑区别（代码量少于10行）

    优先使用后端接口配置数据，如系统参数配置、作业规则、自定义数据、数据字典、素材组管理等

    如后端接口难以配置再考虑前端配置，前端页面优先根据`VUE_APP_CODE`、`projectId`(接口配置的不同项目)或`VUE_APP_CUSTOMIZE`(打包配置`vue.config.js`变量)判断，执行不同处理逻辑

4. 需求变更较大

    开发多个页面，根据菜单角色权限配置实现不同系统/项目使用不同的页面

    **注意事项**：前端代码页面路径在`views`下按`projectCode`进行闭包存放管理，且菜单管理配置的名称需要添加(`ProjectCode`)，以便配置系统角色时方便区分

## 二次开发方案
### 新功能二次开发
1. 新增页面，定制主页配置
    
    `template`模板源码公开，作为二次开发基础框架包，可独立部署，通过负载以及菜单配置与原应用合二为一，负载可配置以`template`模板为主框架，支持自定义配置；

    **提前条件**：所有菜单都需要添加配置$baseUrl；

2. 更换/删除页面

    角色菜单配置实现；

3. 公共管理模板组件(`common`)配置开发
### 已有功能二次开发
@todo 方案待定
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
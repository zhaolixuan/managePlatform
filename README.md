## introduction
- 基于cra的带有基础布局及gaia页面配置的前端开发框架

## 老项目迁移
> 假设被迁移项目为 demo
1.  clone 模板工程 http://coding.jd.com/web-uc-weapons/cra-template-wp5/
2.  cd cra-template-wp5
3.  rm -rf .git
4.  复制 src 到模板工程:  rm -rf src &&  mv demo/src .
5. 对齐webpack 配置
     1. 将 config-override.js 中 alias 同步到 cra-template-wp5/mjd-config.js
     2. Proxy 配置迁移到 src/setupProxy.js
6. 修改主题变量文件名 src/styles/theme/variable.less ->  src/styles/theme/index.less
7. 复制 demo package.json 中 dependecies，覆盖当前项目
8. 安装依赖启动
     1. npm install
     2. fix eslint
           1.  npm i -g eslint
           2.  eslint --ext .js src/ --fix
     3. npm start
     4. 重复 2、3 两步直到可以正常启动
9.  迁移 git :  mv ../demo/.git .
10. 提交 git add . && git commit -m 'blablabla'


脚手架来源： https://www.npmjs.com/package/@jkyu/uc-react-scripts


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

##　开发环境：　
- node: 10.14.1
- npm: 6.4.1
- react: 16.13.1

### 目录结构
  ```bash
  - static  # 静态文件
    - js
    - css
    - images
  - public
    - favicon.ico
    - index.html  # 入口html
  - src   # 业务代码
    - assets  # 图片，字体等资源
    - api # 接口交互模块
    - components  # 公共组件
    - config  # 业务组件配置, 公共静态变量
    - router   # react router
    - store   # mobx
    - styles   # 主题模块,重置样式，全局样式
    - utils  # 常用工具函数
    - views   # 视图组件

    - App.js
    - index.js   # 入口js
  - .env.[mode] # 环境变量
  - .gitlab-ci.yml # cicd 配置文件
  - README.MD
  ```

### 命名规范
- 文件名：见[Airbnb React/JSX 编码规范](https://github.com/JasonBoy/javascript/tree/master/react)
  - *.js 结尾的文件及与其对应的 *.js *.styl 使用大驼峰　——　`HelloWorld.js; HelloWorld.js; HelloWorld.styl`
  - 其他文件使用小驼峰 —— `main.js`
  - 应用css module的less文件, 命名为 *.module.less ,例如'HelloWorld.module.less',否则css module无效
- 变量命名：小驼峰　——　`userName`

### 分支结构
- `master` 生产分支，只允许从 `test`、`hotfix/<bugName>` 分支合并；每次提交会发布预发布`staging`环境； `上线需要手动触发CD[repositry master可以触发]`
- 开始一个sprint的开发时，从master切出一个分支`feature/<name>`,此分支上开发结束后，可以通过提merge request 合到dev，用于开发人员（前端 + 后台 + 产品）自测。
  - 注意，如果往dev合的时候，发现存在冲突，一定不要在当前的开发分支上merge dev的代码，因为这样会将其他开发人员开发完放在dev但并不想提到test的部分同步到你的分支，这样如果你的分支可能想要合并到test提测时因为这个原因不能提测。
  如果发现冲突，可以从开发分支`feature/<name>`切出一个临时分支`feature/<name>-fixConflict`, merge dev的代码并解决冲突。解决这里的冲突然后通过提merge request到dev完成合并。之后在dev自测或者test上测试当中，都需要通过在`feature/<name>`修复bug，合并到他的解决冲突的分支`feature/<name>-fixConflict`,再合并到dev或者test，一直到这个功能完成上线，再删除这两个分支。
- dev只用于联调和开发人员自测，不能从dev合并到test
- 在test分支上测出当前sprint的bug，需要再当前的开发分支`feature/<name>`修复bug，并合并到dev，test
- 在test分支上测出的历史bug，在test切`fixbug/<bugname>`，修复完提交merge request到test,dev
- 在master分支测出的历史bug，切`hotfix/<bugname>`，修复完提交merge request到master,并cherry-pick到dev,test
- 所有bug修复完成，准备上线，合并 `test` 到 master，并删除开发分支`feature/<name>`和其相关的分支例如`feature/<name>-fixConflict`
- dev,test 开发分支， 允许从 `feature`、`hotfix` 分支合并， test 只允许合并准备测试的`feature`
- `hotfix` 热修复分支， 从 `master` 切出来，修复线上bug，在当前分支提测，测试完成完成合并到 `master`、`dev`，`test` 分支

### 分支权限
分支名|别名|是否保护|push权限|merge权限
-----|---|-------|-------|--------
`master`|生产|是|no one|master|
`test`|测试|是|no one|master
`dev`|开发|是|no one|master
`feature/<feature name>`|-|否
`hotfix/<bug>`|-|否|

### 代码审核
- 向 `dev`,`test` 合并代码需要提交 merge request，assign 给其他人审核
- 尽量避免自己提交 merge request； 自己合并

### 上线
- `test` 环境提测
- 测试通过合并 master 分支， 以 `tag-v<version>` 名在 master 上打 tag

### Compiles and minifies
- dev: `npm run build:dev`
- test: `npm run build:test`
- production: `npm run build`
- report: `npm run report` 可以在build环境路径下打开report.html查看依赖包的分析报告

### note
1. 跟环境有关的变量在.env.*中设置，并且必须要以REACT_APP_开头
2. 调试`config-overrides.js`可以添加如下launch.json配置
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "runtimeExecutable": "${workspaceFolder}/node_modules/react-app-rewired/bin/index.js",
      "args": ["start"],
    }
  ]
}
```

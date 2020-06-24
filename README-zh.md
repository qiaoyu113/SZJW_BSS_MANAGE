# 梧桐车服BSS前端工程

该文件为新版梧桐BSS端前端项目的基础架构和介绍

## 项目架构版本
| Vue | Element-Ui | TypeScript |
| ------ | ------ | ------ |
| v2.6.10 | v2.13.2 | v3.5.3 |

| Author | E-mail |
| ------ | ------ |
| 乔宇 | 527324363@qq.com |

## 命令

```bash
# 克隆项目
git clone ?

# 安装依赖
yarn install / npm install

# 建议不要用 cnpm 安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
yarn install / npm install --registry=https://registry.npm.taobao.org

# 启动服务
yarn dev / npm run dev

# 打包
yarn run dist / npm run dist

# 单元测试
yarn run test:unit

# Run your end-to-end tests
yarn run test:e2e

# 更新配置svg图表库
yarn run svg
```

## 目录

```bash
├── mock                       # mock 服务器 与 模拟数据
├── public                     # 静态资源 (会被直接复制)
│   │── favicon.ico            # favicon图标
│   │── manifest.json          # PWA 配置文件
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源 (由 webpack 处理加载)
│   ├── components             # 全局组件
│   ├── directive              # 全局指令
│   ├── filters                # 全局过滤函数
│   ├── icons                  # svg 图标
│   ├── lang                   # 国际化
│   ├── layout                 # 全局布局
│   ├── pwa                    # PWA service worker 相关的文件
│   ├── router                 # 路由
│   ├── store                  # 全局 vuex store
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局方法
│   ├── views                  # 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   ├── permission.ts          # 权限管理
│   ├── settings.ts            # 设置文件
│   └── shims.d.ts             # 模块注入
├── tests                      # 测试
├── .circleci/                 # 自动化 CI 配置
├── .browserslistrc            # browserslistrc 配置文件 (用于支持 Autoprefixer)
├── .editorconfig              # 编辑相关配置
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置
├── babel.config.js            # babel-loader 配置
├── cypress.json               # e2e 测试配置
├── jest.config.js             # jest 单元测试配置
├── package.json               # package.json 依赖
├── postcss.config.js          # postcss 配置
├── tsconfig.json              # typescript 配置
└── vue.config.js              # vue-cli 配置
```

## 其他命令
  
```bash
# --report to build with bundle size analytics
npm run build:prod

# --generate a bundle size analytics. default: bundle-report.html
npm run build:prod --generate_report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix

#版本号控制
--version change in $store.getters.version from 'src/store/moudules/app.ts'
```
  
## D2环境
[D2环境](http://firmiana_frontend.api.d2.yn.cn)

## M1环境
[M1环境](http://firmiana-bss.m1.yunniao.cn)

## 生产环境
[生产环境](http://firmiana-bss.yunniao.cn)

## 代码规范

```bash
1.文字按功能命名（v1.12.2 later）：

- 注：main（正文用字）；assist（辅助用字）；stress（强调用字）；title（标题用字）；xtitle（大一号标题用字）

- 文字使用场所                命名
- 正文使用                 F_font_main
- 辅助用字                 F_font_assist

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

2.views中命名文件名规则：

- 第一个单词小写，第二个单词首字母大写

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

3.router命名极配置：

- 路径配置全部在src/router/roles.js内
- 命名时单词首字母大写
- path格式为小写，单词中间使用-连接
- name和components、view中模块name一致
- hidden为是否展示在菜单栏中（例：子页面为hidden: true）
- apiUrl为对应页面的router-roles权限

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

4.component格式规范:

- 命名时单词首字母大写
- 文件夹名称为模块Name
- 文件夹内统一为index.vue，通过文件夹名指向

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

5.代码规范：

- 文件内分为template、script、style

- Template:
- 首行缩进为0，代码上下缩进为2个空格
- 判断及循环置前，紧跟动态属性，顺序已在esLint中配置，如果顺序问题错误，terminal中会体现

- Script:
- 冒号：后面要保留一个空格
- 等号= 前后要保留一个空格
- 括号() 后面如有{} 要保留一个空格
- 逗号， 后面要保留一个空格
- js中换行最好统一都加分号；
- js中条件项需要引号时，首选单引号
- script中先import、再export default
- function中then和catch中都需将error展示；example:this.$message.error(err);

- Style:
- rel="stylesheet" lang="scss"
- 减少scope的使用
- 样式首层class命名与模块Name统一

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

6.directive规范
- 建立自定义名称，单词之间用-分割
- 最好统一使用小写

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

7.Api规范
- 位置于src/api
- api文件夹根据bss功能类划分，例如线路为carline-api、标书为tender-api
- 命名api.js时用小写，后加-api
- 先import request from '@/utils/request' 再export
- function名称单词首字母大写
- get请求时params: data
- post请求时去掉params,仅保留data

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

8.Git规范

#为保证commit log保持干净，有利于我们后期找问题，咱们前端项目以后的merge中不要超过两次commit记录，我这边负责检查，所以大家提交前需自己检查好自己的commit的记录。
- 项目中正常情况下都使用自己的名字分支
- 自己分支每个迭代开始先merge项目当前master（特殊情况我和大家及时同步）
- 自己分支commit后如果不到merge环节，尽量不要push。每次push之前检查git log记录，rebase为1次提交（最多不超过2次）。
- 如果多次push，本地rebase后在代码没有问题的情况下git push -f到remote分支，最后再进行merge。保持合并分支的记录是干净的
- push前的commit message为修改功能的描述（尽量在简短内容下详细说明，对自己英语如果想提升，可以中文 + 英文备注）
- 提交到自己的分支后，根据现有项目进度的汇总分支（例如汇总分支是master,提交合并到master）。然后自己在gitlab上发起合并请求，然后review一下自己合并的冲突有没有问题，没有的话点击“提交合并请求”，并在钉钉@乔宇 + gitlab的URL。
- 备注：
如不符合规范不予merge，需要大家修改为正确git提交记录再merge。

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
```

## git rebase示例

在`git rebase`的操作示例：(http://dev.xunhuji.me:18095/pages/viewpage.action?pageId=77988210)

## License

Copyright (c) 2020-present qiaoyu
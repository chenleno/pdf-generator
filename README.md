# 网页打印脚本

## 运行环境
- NodeJS >= v7.6.0

## 前端JS库、工具、框架
- [Puppeteer](https://github.com/GoogleChrome/puppeteer)
- [request](https://github.com/request/request)
- [request-promise](https://github.com/request/request-promise)

## 准备工作
> 使用 yarn 安装项目依赖
- $ yarn    # 通过 Yarn 安装依赖包

## 使用
- $ yarn start

## 项目说明
- 自动访问网页并打印成pdf的脚本，通过无头浏览器Puppeteer访问目标网页，执行打印指令，基于pdf模块生成pdf

### 文件结构
    |-- config
    |   |-- env.js          // 环境api，url配置
    |   |-- (pdf)           // 生成的pdf存放目录
    |-- utils
    |   |-- fsUtil.js       // 工具函数，用于判断及创建文件夹
    |   |-- pdf.js          // pdf打印模块
    |   |-- puppeteer.js    // 启动浏览器，可在内部装载不同的功能模块
    |   |-- readline.js     // 命令行工具，用于输入必须信息
    |-- index.js            // 入口文件
    

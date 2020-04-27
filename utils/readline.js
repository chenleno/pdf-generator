'use strict'
const readline = require('readline')
const env = require('./../config/env')
const openBrowser = require('./puppeteer')

let userConfig = {
  token: '',
  env: 'development',
  reportId: '',
  childId: 'all'
}

const openRL = async function () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '敲回车开始>'
  })

  rl.prompt()

  rl.on('line', async line => {
    userConfig.isOld = await getArgs('是否选择老版本 (老版本 report,不输入默认为 新版本 gbReport) > ') || false

    userConfig.env = await getArgs('请选择环境 (development/production | p),不输入默认为 development > ') || 'development'
    console.log('----')

    userConfig.token = await getArgs('请输入token > ') || ''
    console.log('----')

    userConfig.reportId = await getArgs('请输入报告ID > ') || 194
    console.log('----')

    userConfig.childId = await getArgs('请输入childId,使用“,”隔开，不输入默认为all > ') || 'all'
    console.log('----')
    rl.close()
  })

  const getArgs = question => new Promise(resolve => rl.question(question, resolve))

  rl.on('close', async () => {
    try {
      const env_config = await env(userConfig)
      console.log('开始打印任务')
      try {
        await openBrowser(env_config)
      } catch (openError) {
        console.log('open error')
      }
    } catch (err) {
      throw `处理 envConfig 出错 ${err}`
    }
    process.exit(0)
  })
}

module.exports = openRL


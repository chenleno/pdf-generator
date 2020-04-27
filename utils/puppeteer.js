'use strict'

const puppeteer = require('puppeteer')
const pdfService = require('./pdf')

const openBrowser = async (userConfig) => {

  const browser = await puppeteer.launch({ headless: true })   //用指定选项启动一个Chromium浏览器实例。

  const page = await browser.newPage()                       //创建一个页面.

  // 设置浏览器视窗为设备视窗大小
  const dimensions = await page.evaluate(() => {              // Get the "viewport" of the page, as reported by the page.
    return {
      width: 555,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    }
  })
  await page.setViewport(dimensions)

  // 执行pdf打印任务
  try {
    await pdfService(page, userConfig)
  } catch (e) {
    console.log('pdf service error')
    console.log(e)
  }
  await browser.close()                                    //关闭已打开的页面，browser不能再使用。
  console.log(`browser 已关闭`)
}

module.exports = openBrowser

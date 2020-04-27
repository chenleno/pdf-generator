'use strict'

const rp = require('request-promise')
const path = require('path')
const dirExists = require('./fsUtil.js')

const getUserData = function (userConfig) {
  try {
    const options = {
      uri: `${userConfig.API_URL}/reporthub/v1/reports/${userConfig.reportId}/`,
      headers: { 'AUTH-TOKEN': userConfig.token },
      json: true
    }
    return rp(options)
  } catch (err) {
    throw `获取 userData 流程出错 ${err}`
  }

}

const processPage = async page => {
  let loadings = [], retrys = [], divs = []
  try {
    const text = await page.$eval('.t-center', a => a.textContent)
    if (text === '加载中...') {
      loadings = [1]
    }
  } catch (e) {
    loadings = []
  }
  try {
    divs = await page.$$eval('p.m-t-5 a', a => a)
    retrys = divs.filter(v => v.innerText.includes('重试'))
  } catch (e2) {
    retrys = []
  }
  console.log(`retry ${retrys.length} loading ${loadings.length}`)
  if (!loadings.length && !retrys.length) return
  if (loadings.length || retrys.length) {
    retrys.forEach(e => e.click())
  }
  await page.waitFor(500)
  await processPage(page)
}

const generatePdf = async function (page, childId, userConfig) {
  const url = `${userConfig.isOld ? userConfig.host.replace('gbReport', 'report') : userConfig.host}?reportId=${userConfig.reportId}&childId=${childId}&token=${userConfig.token}`

  console.log(`开始打印 reportId: ${userConfig.reportId} childId=${childId}`)
  try {
    await page.goto(url, { timeout: 50000, waitUntil: 'networkidle0' })
    // await page.goto(url, { timeout: 50000 })
  } catch (err) {
    console.log(`浏览器访问 reportId: ${userConfig.reportId} childId=${childId} 出错`)
    throw err
  }
  try {
    await page.waitFor(10000)                                      //延时15000ms ，等待数据加载完成
  } catch (waitError) {
    console.log('wait Error')
  }

  try {
    await processPage(page)
  } catch (e) {
    console.log('process error', e)
  }

  const domHandle = await page.$('.user span');
  const childName = await page.evaluate(body => body ? body.innerHTML : '无名氏', domHandle)          //获取孩子名字

  const pdfPath = `./pdf/${userConfig.reportId}/${userConfig.reportId}_${childId}_${childName}.pdf`              //pdf命名规则为: 名字_id.pdf

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      right: '20mm',
      bottom: '18mm',
      left: '20mm'
    }
  })
}

const recurPdf = async function (page, userId_arr, userConfig) {
  const childID = userId_arr.shift()
  try {
    await generatePdf(page, childID, userConfig)
  } catch (err) {
    throw `pdf生成过程出错，当前childId=${childID}, ${err}`
  }

  if (userId_arr.length !== 0) {
    await recurPdf(page, userId_arr, userConfig)
  } else {
    console.log('userId_arr 已遍历完成, pdf 已生成完毕')
  }
}

const pdfService = async function (page, userConfig) {
  const pdfDirPath = path.join(path.resolve(__dirname, '..'), './pdf', userConfig.reportId)
  try {
    await dirExists(pdfDirPath)
  } catch (err) {
    throw `创建文件夹失败 ${err}`
  }

  const resp = await getUserData(userConfig)
  let user_ids
  if (userConfig.childId === 'all') {
    user_ids = await resp.users.filter(u => u.character === 'student').map(u => u.user_id)
  } else {
    user_ids = userConfig.childId
  }
  console.log(user_ids)
  await recurPdf(page, user_ids, userConfig)
}

module.exports = pdfService

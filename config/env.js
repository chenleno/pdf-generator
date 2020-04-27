'use strict'

const envConfig = function (USER_CONFIG) {

  return new Promise(resolve => {

    const isStable = USER_CONFIG.env === 'production' || USER_CONFIG.env === 'p'

    let envConfig = USER_CONFIG

    envConfig.childId = USER_CONFIG.childId === 'all' ? 'all' : USER_CONFIG.childId.split(',').concat()

    envConfig.host = isStable ? 'https://prod/print' : 'https://dev/print' // 'http://localhost:3000/h/report/print'

    envConfig.API_URL = isStable ? `https://prod` : `https://dev`

    resolve(envConfig)

  })
}

module.exports = envConfig


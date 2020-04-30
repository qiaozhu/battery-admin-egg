/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
const fs = require('fs');
const rsaKey = require('./rsaKey');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1564727434812_7292';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    //项目启动端口
    cluster: {
      listen: {
        port: 7500
      }
    },
    siteFile: {
      '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/favicon.png'))
    },
    static: {
      // 静态化访问前缀,如：`http://127.0.0.1:7500/public/favicon.png`
      prefix: '/public',
      dir: path.join(appInfo.baseDir, 'app/public')
    },
    security: {
      csrf: {
        enable: false
      }
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true
    },
    jwt: {
      secret: 'JqTv5Ba36W7IC8FU'
    },
    multipart: {
      mode: 'stream',
      whitelist: ['.jpg', '.jpeg', '.png'] // 覆盖整个白名单，只允许上传格式
    },
    sequelize: {
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'battery',
      username: 'root',
      password: '123456',
      timezone: '+08:00', //东八时区
      define: {
        freezeTableName: true,
        underscored: true
      },
      // 格式化时间
      dialectOptions: {
        dateStrings: true,
        typeCast: true
      }
    },
    validate: {
      convert: true
      // validateRoot: false,
    },
    rsaKey: {
      publicKey: rsaKey.dev.publicKey,
      privateKey: rsaKey.dev.privateKey
    },
    mail: {
      host: 'smtp.qq.com',
      port: 465,
      auth: {
        user: '378937873@qq.com',
        pass: 'zlnqscamwwbdbigb'
      },
      from: '378937873@qq.com'
    },
    companyName: '东莞（深圳）弘凯新能源科技有限公司',
    projectName: '弘凯科技管理后台',
    linkPhone: '18671451730',
    imgPrefix: 'http://192.168.12.77:7500',
    redis: {
      client: {
        host: '127.0.0.1',
        port: '6379',
        password: '',
        db: '0'
      },
      agent: true
    }
  };

  return {
    ...config,
    ...userConfig
  };
};

/* eslint valid-jsdoc: "off" */

'use strict';
const rsaKey = require('./rsaKey');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = {
    rsaKey: {
      publicKey: rsaKey.prod.publicKey,
      privateKey: rsaKey.prod.privateKey,
    },
    imgPrefix: 'https://www.qiaodev.com/assets/battery',
    sequelize: {
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'battery',
      username: 'root',
      password: 'Web326407.',
      timezone: '+08:00', //东八时区
      define: {
        freezeTableName: true,
        underscored: true,
      },
      // 格式化时间
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
      },
    },
  };

  return config;
};

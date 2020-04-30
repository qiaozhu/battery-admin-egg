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
      privateKey: rsaKey.prod.privateKey
    }
  };

  return config;
};

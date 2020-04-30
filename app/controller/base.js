'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  // 校验参数
  validate(schema, params) {
    const { ctx } = this;
    try {
      ctx.validate(schema, params);
      return true;
    } catch (error) {
      ctx.logger.warn('参数校验失败 : %j', error);
      ctx.body = { status: 1, message: '参数校验失败', data: error };
      return false;
    }
  }
}
module.exports = BaseController;

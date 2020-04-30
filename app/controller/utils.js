'use strict';

const Controller = require('./base');
const nodemailer = require('nodemailer');

class UtilsController extends Controller {
  async guid() {
    const { ctx, app } = this;
    ctx.body = { status: 0, data: ctx.helper._uuid(), message: 'success' };
  }
  async humps() {
    const { ctx } = this;
    const field = ['menu_id', 'name', 'parent_id', 'sort'];
    var newField = field.map(el => {
      if (el.indexOf('_') > -1) {
        return [el, ctx.helper.humps.camelize(el)];
      } else {
        return el;
      }
    });
    ctx.body = newField;
  }
  async redis() {
    const { ctx, app } = this;
    await app.sessionStore.set('yzmCode', { code: '123' }, 10 * 60 * 1000);
    const data = await app.sessionStore.get('yzmCode');
    ctx.body = { status: 0, data: data, message: 'success' };
  }
}

module.exports = UtilsController;

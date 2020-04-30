'use strict';

const Controller = require('./base');

class GoodsController extends Controller {
  async getGoodsList() {
    const { ctx } = this;
    let params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      pageNo: { type: 'number', min: 1, max: 999, required: true },
      pageSize: { type: 'number', min: 1, max: 999, required: true },
      goodsNo: { type: 'string', max: 16, required: false },
      goodsName: { type: 'string', max: 32, required: false },
      goodsType: { type: 'string', max: 64, required: false },
      goodsSku: { type: 'string', max: 64, required: false },
      state: { type: 'number', min: 0, max: 999, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const result = await ctx.service.goods.getGoodsList(params);
    ctx.body = { status: 0, message: 'success', data: result || {} };
  }
  async getGoodsDetail() {
    const { ctx } = this;
    let params = { ...ctx.request.query };

    // 定义校验规则
    const schema = { goodsId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const result = await ctx.service.goods.getGoodsDetail(params);
    ctx.body = { status: 0, message: 'success', data: result || {} };
  }
  async addGoods() {
    const { ctx } = this;
    const params = { ...ctx.request.body };
    // 移除图片前缀
    params.imgList = ctx.helper.removeImgPrefix(params.imgList);

    // 定义校验规则
    const schema = {
      goodsType: { type: 'string', min: 1, max: 64, required: true },
      goodsName: { type: 'string', max: 32, required: true },
      goodsSku: { type: 'string', max: 64, required: false },
      remark: { type: 'string', max: 255, required: false },
      imgList: { type: 'string', max: 255, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 调用service
    const result = await ctx.service.goods.addGoods(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '添加失败' };
    }
  }
  async editGoods() {
    const { ctx } = this;
    const params = { ...ctx.request.body };
    // 移除图片前缀
    params.imgList = ctx.helper.removeImgPrefix(params.imgList);

    // 定义校验规则
    const schema = {
      goodsId: { type: 'string', min: 32, max: 32, required: true },
      goodsType: { type: 'string', min: 1, max: 64, required: true },
      goodsName: { type: 'string', max: 32, required: true },
      goodsSku: { type: 'string', max: 64, required: false },
      remark: { type: 'string', max: 255, required: false },
      imgList: { type: 'string', max: 255, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 调用service
    const result = await ctx.service.goods.editGoods(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '修改失败' };
    }
  }
}

module.exports = GoodsController;

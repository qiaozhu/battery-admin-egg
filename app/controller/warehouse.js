'use strict';

const Controller = require('./base');

class WarehouseController extends Controller {
  async getWarehouseList() {
    const { ctx } = this;
    let params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      pageNo: { type: 'number', min: 1, max: 999, required: true },
      pageSize: { type: 'number', min: 1, max: 999, required: true },
      warehouseNo: { type: 'string', max: 16, required: false },
      name: { type: 'string', max: 32, required: false },
      warehouseType: { type: 'string', max: 64, required: false },
      state: { type: 'number', min: 0, max: 999, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const result = await ctx.service.warehouse.getWarehouseList(params);
    ctx.body = { status: 0, message: 'success', data: result || {} };
  }
  async getWarehouseDetailList() {
    const { ctx } = this;
    let params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      pageNo: { type: 'number', min: 1, max: 999, required: true },
      pageSize: { type: 'number', min: 1, max: 999, required: true },
      warehouseNo: { type: 'string', max: 16, required: false },
      name: { type: 'string', max: 32, required: false },
      warehouseType: { type: 'string', max: 64, required: false },
      state: { type: 'number', min: 0, max: 999, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const result = await ctx.service.warehouse.getWarehouseDetailList(params);
    ctx.body = { status: 0, message: 'success', data: result || {} };
  }
  async addWarehouse() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      warehouseType: { type: 'string', min: 1, max: 64, required: true },
      name: { type: 'string', max: 32, required: true },
      remark: { type: 'string', max: 255, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 调用service
    const result = await ctx.service.warehouse.addWarehouse(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '添加失败' };
    }
  }
  async getWarehouseInfo() {
    const { ctx } = this;
    let params = { ...ctx.request.query };

    // 定义校验规则
    const schema = { warehouseId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const result = await ctx.service.warehouse.getWarehouseInfo(params);
    ctx.body = { status: 0, message: 'success', data: result || {} };
  }
  async editWarehouse() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      warehouseId: { type: 'string', min: 32, max: 32, required: true },
      warehouseType: { type: 'string', min: 1, max: 64, required: true },
      name: { type: 'string', max: 32, required: true },
      remark: { type: 'string', max: 255, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 调用service
    const result = await ctx.service.warehouse.addWarehouse(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '修改失败' };
    }
  }
}

module.exports = WarehouseController;

'use strict';

const Controller = require('./base');

class SystemController extends Controller {
  // 获取当前登录用户的菜单权限
  async getUserMenuTree() {
    const { ctx } = this;

    const result = await ctx.service.system.getUserMenuTree();
    // 转树结构数据
    const treeData = ctx.helper.arrayToTree(ctx.helper.seqDataToJson(result));
    ctx.body = { status: 0, message: 'success', data: treeData || [] };
  }
  // 获取所有菜单权限
  async getMenuTreeAll() {
    const { ctx } = this;

    const result = await ctx.service.system.getMenuTreeAll();
    // 转树结构数据
    const treeData = ctx.helper.arrayToTree(ctx.helper.seqDataToJson(result));
    ctx.body = { status: 0, message: 'success', data: treeData || [] };
  }
  // 添加/修改菜单
  async saveMenu() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      parentId: { type: 'string', min: 32, max: 32, required: false },
      name: { type: 'string', max: 20, required: true },
      href: { type: 'string', max: 50, required: false },
      icon: { type: 'string', max: 20, required: false },
      isDefault: { type: 'enum', values: [0, 1], required: true },
      isShow: { type: 'enum', values: [0, 1], required: true },
      sort: { type: 'number', min: 0, max: 999, required: false },
      permission: { type: 'string', max: 50, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 调用service
    const result = await ctx.service.system.saveMenu(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '保存失败' };
    }
  }
  // 查询菜单详情
  async getMenuDetail() {
    const { ctx } = this;
    const params = { ...ctx.request.query };
    // 定义校验规则
    const schema = { menuId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;
    // 调用service
    const result = await ctx.service.system.getMenuDetail(params);
    if (result) {
      ctx.body = { status: 0, message: 'success', data: result };
    } else {
      ctx.body = { status: 1, message: '未找到对应菜单信息' };
    }
  }
  // 删除菜单
  async delMenu() {
    const { ctx } = this;
    const params = { ...ctx.request.query };
    // 定义校验规则
    const schema = { menuId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;
    // 调用service
    const result = await ctx.service.system.delMenu(params);
    if (result) {
      ctx.body = { status: 0, message: 'success', data: result };
    } else {
      ctx.body = { status: 1, message: '未找到对应菜单信息' };
    }
  }
  // 获取所有字典 不分页 转对象解构
  async getAllDict() {
    const { ctx } = this;
    const result = await ctx.service.system.getAllDict();
    if (result) {
      let rtn = {};
      result.forEach(element => {
        if (!Object.keys(rtn).includes(element.type)) {
          rtn[element.type] = [];
        }
        rtn[element.type].push(element);
      });
      ctx.body = { status: 0, message: 'success', data: rtn };
    } else {
      ctx.body = { status: 0, message: 'success', data: [] };
    }
  }
  // 获取字典列表
  async getDictList() {
    const { ctx } = this;
    let params = { ...ctx.request.body };
    // 定义校验规则
    const schema = {
      pageNo: { type: 'number', min: 1, max: 999, required: true },
      pageSize: { type: 'number', min: 1, max: 999, required: true }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const result = await ctx.service.system.getDictList(params);
    if (result) {
      ctx.body = { status: 0, message: 'success', data: result };
    } else {
      ctx.body = { status: 0, message: 'success', data: [] };
    }
  }
  // 添加/修改字典
  async saveDict() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      parentId: { type: 'string', min: 32, max: 32, required: false },
      label: { type: 'string', max: 64, required: true },
      value: { type: 'string', max: 64, required: true },
      type: { type: 'string', max: 64, required: true },
      typeLabel: { type: 'string', max: 64, required: true },
      remark: { type: 'string', max: 255, required: false },
      sort: { type: 'number', min: 0, max: 999, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 调用service
    const result = await ctx.service.system.saveDict(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '保存失败' };
    }
  }
  // 删除字典
  async delDict() {
    const { ctx } = this;
    const params = { ...ctx.request.query };
    // 定义校验规则
    const schema = { dictId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;
    // 调用service
    const result = await ctx.service.system.delDict(params);
    if (result) {
      ctx.body = { status: 0, message: 'success', data: result };
    } else {
      ctx.body = { status: 1, message: '未找到对应字典信息' };
    }
  }
}

module.exports = SystemController;

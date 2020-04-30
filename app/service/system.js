const Service = require('egg').Service;

class SystemService extends Service {
  // 获取用户菜单和权限
  async getUserMenuTree(userId) {
    const { ctx } = this;
    // prettier-ignore
    const attributes = ['id','menuId','parentId','name','href','icon','isDefault','isShow','permission','sort','createTime','updateTime'];
    return await ctx.model.Menu.findAll({
      attributes,
      order: [['sort', 'asc'], ['createTime', 'desc']]
    });
  }
  // 获取全部菜单
  async getMenuTreeAll() {
    const { ctx } = this;
    // prettier-ignore
    const attributes = ['id','menuId','parentId','name','href','icon','isDefault','isShow','permission','sort','createTime','updateTime'];
    return await ctx.model.Menu.findAll({
      attributes,
      order: [['sort', 'asc'], ['createTime', 'desc']]
    });
  }
  // 新增/修改菜单
  async saveMenu(params) {
    const { ctx } = this;

    // 需要入库的字段
    let field = {
      parentId: params.parentId,
      name: params.name,
      href: params.href,
      icon: params.icon,
      isDefault: params.isDefault,
      isShow: params.isShow,
      permission: params.permission,
      sort: params.sort
    };
    if (params.menuId) {
      return await ctx.model.Menu.update(field, {
        where: { menuId: params.menuId }
      });
    } else {
      field.menuId = ctx.helper._uuid();
      return await ctx.model.Menu.create(field);
    }
  }
  // 查询菜单详情
  async getMenuDetail(params) {
    const { ctx } = this;
    // prettier-ignore
    const attributes = ['id','menuId','parentId','name','href','icon','isDefault','isShow','permission','sort','createTime','updateTime'];
    // 将下划线写法转为驼峰写法
    return await ctx.model.Menu.findOne({ attributes, where: { menuId: params.menuId } });
  }
  // 删除菜单
  async delMenu(params) {
    const { ctx } = this;
    return await ctx.model.Menu.destroy({ where: { menuId: params.menuId } });
  }

  // 获取所有字典 不分页
  async getAllDict() {
    const { ctx } = this;
    // prettier-ignore
    const attributes = ['id','dictId','label','value','type','typeLabel','remark','sort','createTime','updateTime'];
    return await ctx.model.Dict.findAll({
      attributes,
      order: [['type', 'desc'], ['sort', 'asc'], ['createTime', 'desc']]
    });
  }
  // 获取所有字典
  async getDictList(params) {
    const { ctx } = this;
    // prettier-ignore
    const attributes = ['id','dictId','label','value','type','typeLabel','remark','sort','createTime','updateTime'];
    const where = {
      where: { delState: 0 },
      order: [['type', 'desc'], ['sort', 'asc'], ['createTime', 'desc']]
    };
    return ctx.helper.queryList(params, attributes, where, 'Dict');
  }
  // 新增/修改字典
  async saveDict(params) {
    const { ctx } = this;

    // 需要入库的字段
    let field = {
      parentId: params.parentId,
      label: params.label,
      value: params.value,
      type: params.type,
      typeLabel: params.typeLabel,
      remark: params.remark,
      sort: params.sort
    };
    if (params.dictId) {
      return await ctx.model.Dict.update(field, {
        where: { dictId: params.dictId }
      });
    } else {
      field.dictId = ctx.helper._uuid();
      return await ctx.model.Dict.create(field);
    }
  }
  // 删除字典
  async delDict(params) {
    const { ctx } = this;
    return await ctx.model.Dict.destroy({ where: { dictId: params.dictId } });
  }
}

module.exports = SystemService;

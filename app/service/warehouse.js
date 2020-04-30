const Service = require('egg').Service;

class WarehouseService extends Service {
  async getWarehouseList(params) {
    const { ctx, app } = this;
    // 解析token
    const _token = await ctx.service.token.decryptToken();
    const companyId = _token.payload.companyId || '';

    // prettier-ignore
    const attributes = ['id','warehouseId','warehouseNo','warehouseType','name','remark','state','companyId','createTime','updateTime'];

    let where = {
      where: {},
      order: [['createTime', 'desc']]
    };
    params.name && (where.where.name = { [app.Sequelize.Op.like]: `%${params.name}%` });
    params.warehouseNo && (where.where.warehouseNo = { [app.Sequelize.Op.like]: `%${params.warehouseNo}%` });
    params.warehouseType && (where.where.warehouseType = params.warehouseType);
    params.state && (where.where.state = params.state);

    // 判断是否是管理员 添加对应scope
    let scope = ['defaultScope'];
    companyId !== 'admin' && scope.push({ method: ['company', companyId] });

    // 分页查询
    return ctx.helper.queryList(params, attributes, where, 'Warehouse', scope);
  }
  async getWarehouseDetailList(params) {
    const { ctx, app } = this;
    // 解析token
    const _token = await ctx.service.token.decryptToken();
    const companyId = _token.payload.companyId || '';

    // prettier - ignore;
    const attributes = [
      'id',
      'warehouse_id',
      [app.Sequelize.col('warehouse.warehouse_no'), 'warehouseNo'],
      [app.Sequelize.col('warehouse.warehouse_type'), 'warehouseType'],
      [app.Sequelize.col('warehouse.name'), 'name'],
      [app.Sequelize.col('goods.goods_name'), 'goodsName'],
      'count',
      [app.Sequelize.col('warehouse.company_id'), 'companyId'],
      'createTime',
      'updateTime'
    ];

    let where = {
      where: {},
      order: [['createTime', 'desc']],
      include: [
        {
          model: app.model.Warehouse,
          as: 'warehouse',
          attributes: []
        },
        {
          model: app.model.Goods,
          as: 'goods',
          attributes: []
        }
      ]
    };

    // params.name && (where.where.name = { [app.Sequelize.Op.like]: `%${params.name}%` });
    // params.warehouseNo && (where.where.warehouse_no = { [app.Sequelize.Op.like]: `%${params.warehouseNo}%` });
    // params.warehouseType && (where.where.warehouse_type = params.warehouseType);
    // params.state && (where.where.state = params.state);

    // 判断是否是管理员 添加对应scope
    let scope = ['defaultScope'];
    companyId !== 'admin' && scope.push({ method: ['company', companyId] });

    // 分页查询
    return ctx.helper.queryList(params, attributes, where, 'WarehouseDetail', scope);
  }
  async addWarehouse(params) {
    const { ctx } = this;
    // 解析token
    const _token = await ctx.service.token.decryptToken();

    // 需要入库的字段
    let field = {
      warehouseType: params.warehouseType,
      name: params.name,
      remark: params.remark
    };
    field.warehouseId = ctx.helper._uuid();
    field.warehouseNo = await ctx.helper.randomNo('C', 'warehouse_no', 'Warehouse');
    field.companyId = _token.payload.companyId;

    return await ctx.model.Warehouse.create(field);
  }
  // 查询仓库基本信息
  async getWarehouseInfo(params) {
    const { ctx } = this;
    // prettier-ignore
    const attributes =  ['id','warehouseId','warehouseNo','warehouseType','name','remark','state','companyId','createTime','updateTime'];
    return await ctx.model.Warehouse.findOne({ attributes, where: { warehouseId: params.warehouseId } });
  }
  async editWarehouse(params) {
    const { ctx } = this;

    // 需要入库的字段
    let field = {
      warehouseType: params.warehouseType,
      name: params.name,
      remark: params.remark
    };

    return await ctx.model.Warehouse.update(field, {
      where: { warehouseId: params.warehouseId }
    });
  }
}

module.exports = WarehouseService;

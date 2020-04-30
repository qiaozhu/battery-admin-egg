const Service = require('egg').Service;

class GoodsService extends Service {
  async getGoodsList(params) {
    const { ctx, app } = this;
    // 解析token
    const _token = await ctx.service.token.decryptToken();
    const companyId = _token.payload.companyId || '';

    const attributes = [
      'id',
      'goodsId',
      'goodsNo',
      'goodsType',
      'goodsName',
      'goodsSku',
      'remark',
      [ctx.helper.addImgPrefix('img_list'), 'imgList'],
      'state',
      'companyId',
      'createTime',
      'updateTime'
    ];

    let where = {
      where: {},
      order: [['createTime', 'desc']]
    };
    params.goodsName && (where.where.goodsName = { [app.Sequelize.Op.like]: `%${params.goodsName}%` });
    params.goodsNo && (where.where.goodsNo = { [app.Sequelize.Op.like]: `%${params.goodsNo}%` });
    params.goodsType && (where.where.goodsType = params.goodsType);
    params.goodsSku && (where.where.goodsSku = params.goodsSku);
    params.state && (where.where.state = params.state);

    // 判断是否是管理员 添加对应scope
    let scope = ['defaultScope'];
    if (companyId !== 'admin') scope.push({ method: ['company', companyId] });

    // 分页查询
    return ctx.helper.queryList(params, attributes, where, 'Goods', scope);
  }
  async getGoodsDetail(params) {
    const { ctx } = this;
    const attributes = [
      'id',
      'goodsId',
      'goodsNo',
      'goodsType',
      'goodsName',
      'goodsSku',
      'remark',
      [ctx.helper.addImgPrefix('img_list'), 'imgList'],
      'state',
      'companyId',
      'createTime',
      'updateTime'
    ];
    return await ctx.model.Goods.findOne({ attributes, where: { goodsId: params.goodsId } });
  }
  async addGoods(params) {
    const { ctx } = this;
    // 解析token
    const _token = await ctx.service.token.decryptToken();

    // 需要入库的字段
    let field = {
      goodsType: params.goodsType,
      goodsSku: params.goodsSku,
      goodsName: params.goodsName,
      remark: params.remark,
      imgList: params.imgList
    };
    field.goodsId = ctx.helper._uuid();
    field.goodsNo = await ctx.helper.randomNo('G', 'goodsNo', 'Goods');
    field.companyId = _token.payload.companyId;

    return await ctx.model.Goods.create(field);
  }
  async editGoods(params) {
    const { ctx } = this;

    // 需要入库的字段
    let field = {
      goodsType: params.goodsType,
      goodsSku: params.goodsSku,
      goodsName: params.goodsName,
      remark: params.remark,
      imgList: params.imgList
    };

    return await ctx.model.Goods.update(field, {
      where: { goodsId: params.goodsId }
    });
  }
}

module.exports = GoodsService;

const Service = require('egg').Service;

class UserService extends Service {
  // 登录校验
  async loginFindAccount(params) {
    const { ctx } = this;
    return await ctx.model.User.findOne({
      where: {
        account: params.account,
        password: ctx.helper._md5(params.password)
      }
    });
  }
  // 修改密码时 校验旧登录密码是否正确
  async validPwdById(params) {
    const { ctx } = this;
    return await ctx.model.User.findOne({
      where: {
        userId: params.userId,
        password: ctx.helper._md5(params.oldpwd)
      }
    });
  }
  // 判断手机号是否存在
  async queryPhoneIsExist(account) {
    const { ctx } = this;
    return await ctx.model.User.findOne({ where: { account: account } });
  }
  // 根据userId获取用户基本信息
  async getUserById(userId) {
    const { ctx } = this;
    const attributes = [
      'id',
      'userId',
      'userName',
      'account',
      [ctx.helper.addImgPrefix('avatar'), 'avatar'],
      'remark',
      'state',
      'isAdmin',
      'companyId',
      'email',
      'createTime',
      'updateTime'
    ];
    return await ctx.model.User.findOne({ attributes, where: { userId: userId } });
  }
  // 查询 账户 + 邮箱 是否存在
  async getUserByEmail(params) {
    const { ctx } = this;
    const attributes = [
      'id',
      'userId',
      'userName',
      'account',
      [ctx.helper.addImgPrefix('avatar'), 'avatar'],
      'remark',
      'state',
      'isAdmin',
      'companyId',
      'email',
      'createTime',
      'updateTime'
    ];
    return await ctx.model.User.findOne({
      attributes,
      where: { account: params.account, email: params.email }
    });
  }
  // 查询所有用户列表
  async getUserList(params) {
    const { ctx } = this;
    // 解析token
    const _token = await ctx.service.token.decryptToken();
    const companyId = _token.payload.companyId || '';

    const attributes = [
      'id',
      'userId',
      'userName',
      'account',
      [ctx.helper.addImgPrefix('avatar'), 'avatar'],
      'remark',
      'state',
      'isAdmin',
      'companyId',
      'email',
      'createTime',
      'updateTime'
    ];
    const where = { order: [['createTime', 'desc']] };

    // 判断是否是管理员 添加对应scope
    let scope = ['defaultScope'];
    if (companyId !== 'admin') scope.push({ method: ['company', companyId] });

    // 分页查询
    return ctx.helper.queryList(params, attributes, where, 'User', scope);
  }
  // 添加用户
  async addAccount(params) {
    const { ctx } = this;
    const decamelizeKeys = ctx.helper.humps.decamelizeKeys;

    // 需要入库的字段
    let field = {
      userName: params.userName,
      account: params.account,
      password: params.password,
      remark: params.remark,
      companyId: params.companyId,
      email: params.email
    };
    field.userId = ctx.helper._uuid();
    return await ctx.model.User.create(decamelizeKeys(field));
  }
  // 修改用户账户相关信息
  async editAccount(params) {
    const { ctx } = this;
    const decamelizeKeys = ctx.helper.humps.decamelizeKeys;

    // 需要入库的字段
    let field = {
      userName: params.userName,
      remark: params.remark,
      companyId: params.companyId,
      email: params.email
    };
    return await ctx.model.User.update(decamelizeKeys(field), {
      where: { userId: params.userId }
    });
  }
  // 启用禁用用户
  async disableAccount(params) {
    const { ctx } = this;
    const decamelizeKeys = ctx.helper.humps.decamelizeKeys;

    // 需要入库的字段
    let field = { state: params.state };
    return await ctx.model.User.update(decamelizeKeys(field), {
      where: { userId: params.userId }
    });
  }
  // 删除用户
  async delAccount(params) {
    const { ctx } = this;
    return await ctx.model.User.destroy({ where: { userId: params.userId } });
  }
  // 忘记密码-修改账户密码
  async editPwdByAccount(params) {
    const { ctx } = this;
    return await ctx.model.User.update(
      { password: ctx.helper._md5(params.newpwd) },
      { where: { account: params.account } }
    );
  }
  // 已登录-修改账户密码
  async editPwdById(params) {
    const { ctx } = this;
    return await ctx.model.User.update(
      { password: ctx.helper._md5(params.newpwd) },
      { where: { userId: params.userId } }
    );
  }
  // 修改用户基本信息
  async editUserInfo(params) {
    const { ctx } = this;
    const decamelizeKeys = ctx.helper.humps.decamelizeKeys;

    // 需要入库的字段
    let field = {
      userName: params.userName,
      email: params.email,
      remark: params.remark,
      avatar: params.avatar
    };

    return await ctx.model.User.update(decamelizeKeys(field), {
      where: { userId: params.userId }
    });
  }
}

module.exports = UserService;

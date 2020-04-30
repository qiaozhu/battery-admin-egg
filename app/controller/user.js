'use strict';

const Controller = require('./base');

class UserController extends Controller {
  // 用户登录
  async login() {
    const { ctx } = this;
    let params = { ...ctx.request.body };
    // rsa解密
    params.password = ctx.helper._decrypt(params.password);

    // 定义校验规则
    let schema = {
      account: { type: 'string', required: true, allowEmpty: false, format: /^1[0-9]{10}$/ },
      password: { type: 'string', min: 6, max: 20, required: true }
    };
    if (params.account === 'admin') {
      delete schema.account;
    }
    // 校验参数
    if (!this.validate(schema, params)) return;
    // 查询用户是否存在
    const resData = await ctx.service.user.loginFindAccount(params);
    if (resData) {
      // 创建token并返回
      const token = await ctx.service.token.createToken({
        userId: resData.userId,
        companyId: resData.companyId || ''
      });
      ctx.body = { status: 0, message: 'success', data: token };
    } else {
      ctx.body = { status: 1, message: '用户名或密码错误' };
    }
  }
  // 获取当前登录用户的基本信息
  async getUserInfo() {
    const { ctx } = this;
    const _token = await ctx.service.token.decryptToken();
    const userData = await ctx.service.user.getUserById(_token.payload.userId);
    if (userData) {
      ctx.body = { status: 0, message: 'success', data: userData };
    } else {
      ctx.body = { status: 1, message: '未查询到用户信息' };
    }
  }
  // 根据userId获取用户基本信息
  async getUserInfoById() {
    const { ctx } = this;

    const params = { ...ctx.request.query };

    // 定义校验规则
    const schema = { userId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const userData = await ctx.service.user.getUserById(params.userId);

    if (userData) {
      ctx.body = { status: 0, message: 'success', data: userData };
    } else {
      ctx.body = { status: 1, message: '不存在的用户' };
    }
  }

  // 查询所有用户列表
  async getUserList() {
    const { ctx } = this;
    let params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      pageNo: { type: 'number', min: 1, max: 999, required: true },
      pageSize: { type: 'number', min: 1, max: 999, required: true }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const userData = await ctx.service.user.getUserList(params);
    ctx.body = { status: 0, message: 'success', data: userData || {} };
  }
  // 添加用户
  async addAccount() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      userName: { type: 'string', max: 20, required: true },
      account: { type: 'string', min: 11, max: 11, required: true },
      email: { type: 'email', max: 64, required: true },
      remark: { type: 'string', max: 255, required: false },
      companyId: { type: 'string', min: 32, max: 32, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 判断手机号是否存在
    const isExist = await ctx.service.user.queryPhoneIsExist(params.account);
    if (isExist) {
      ctx.body = { status: 1, message: '该手机号已存在' };
      return;
    }

    params.password = ctx.helper.randomName(8); // 随机生成8位密码
    // 调用service
    const result = await ctx.service.user.addAccount(params);
    if (result) {
      // 发送初始密码邮件
      await ctx.helper.sendEmail('login', params.email, params.password);
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '添加失败' };
    }
  }
  // 修改用户账户信息
  async editAccount() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      userId: { type: 'string', min: 32, max: 32, required: true },
      userName: { type: 'string', max: 20, required: true },
      account: { type: 'string', min: 11, max: 11, required: true },
      email: { type: 'email', max: 64, required: true },
      remark: { type: 'string', max: 255, required: false },
      companyId: { type: 'string', min: 32, max: 32, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const userData = await ctx.service.user.getUserById(params.userId);
    if (!userData) {
      ctx.body = { status: 1, message: '不存在的用户' };
      return;
    }
    // 调用service
    const result = await ctx.service.user.editAccount(params);

    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '修改失败' };
    }
  }
  // 启用禁用用户
  async disableAccount() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      userId: { type: 'string', min: 32, max: 32, required: true },
      state: { type: 'enum', values: [0, 1], required: true } // 0启用 1禁用
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const userData = await ctx.service.user.getUserById(params.userId);

    if (!userData) {
      ctx.body = { status: 1, message: '不存在的用户' };
      return;
    }
    if (userData.get('isAdmin') === 1) {
      ctx.body = { status: 1, message: '管理员不允许禁用' };
      return;
    }

    // 调用service
    const result = await ctx.service.user.disableAccount(params);

    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '操作失败' };
    }
  }
  // 删除用户
  async delAccount() {
    const { ctx } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = { userId: { type: 'string', min: 32, max: 32, required: true } };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const userData = await ctx.service.user.getUserById(params.userId);
    if (!userData) {
      ctx.body = { status: 1, message: '不存在的用户' };
      return;
    }
    if (userData.get('isAdmin') === 1) {
      ctx.body = { status: 1, message: '管理员不允许禁用' };
      return;
    }

    // 调用service
    const result = await ctx.service.user.delAccount(params);

    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '删除失败' };
    }
  }
  // 忘记登录密码-发送验证码
  async forgetPwdSend() {
    const { ctx, app } = this;
    const params = { ...ctx.request.body };

    // 定义校验规则
    const schema = {
      account: { type: 'string', min: 11, max: 11, required: true },
      email: { type: 'email', max: 64, required: true }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 查询用户邮箱是否匹配
    const userData = await ctx.service.user.getUserByEmail(params);
    if (userData) {
      // 发送邮件验证码
      const code = ctx.helper.randomName(8);
      await ctx.helper.sendEmail('code', params.email, code);
      await app.sessionStore.set(params.account, { code: code }, 10 * 60 * 1000); // 十分钟有效

      const rtncode = app.sessionStore.get(params.account);
      ctx.body = { status: 0, message: '验证码已发送', data: rtncode };
    } else {
      ctx.body = { status: 1, message: '用户不存在或手机号和邮箱不匹配' };
    }
  }
  // 忘记登录密码-设置验证码
  async forgetPwdSet() {
    const { ctx, app } = this;
    const params = { ...ctx.request.body };

    // rsa解密
    params.newpwd = ctx.helper._decrypt(params.newpwd);
    params.newpwd2 = ctx.helper._decrypt(params.newpwd2);

    // 定义校验规则
    const schema = {
      account: { type: 'string', min: 11, max: 11, required: true },
      email: { type: 'email', max: 64, required: true },
      code: { type: 'string', min: 8, max: 8, required: true },
      newpwd: { type: 'string', min: 6, max: 20, required: true },
      newpwd2: { type: 'string', min: 6, max: 20, required: true }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const redisStore = await app.sessionStore.get(params.account);
    if (!redisStore) {
      ctx.body = { status: 1, message: '验证码已失效，请重新发送' };
      return;
    }

    if (params.code !== redisStore.code) {
      ctx.body = { status: 1, message: '验证码错误' };
      return;
    }

    // 调用service
    const result = await ctx.service.user.editPwdByAccount(params);
    await app.sessionStore.destroy(params.account); // 消费验证码
    if (result) {
      ctx.body = { status: 0, message: '修改成功' };
    } else {
      ctx.body = { status: 1, message: '修改失败' };
    }
  }
  // 修改登录密码-已登录状态下
  async editAccountPwd() {
    const { ctx, app } = this;
    const _token = await ctx.service.token.decryptToken();
    const params = { ...ctx.request.body };

    // rsa解密
    params.oldpwd = ctx.helper._decrypt(params.oldpwd);
    params.newpwd = ctx.helper._decrypt(params.newpwd);
    params.newpwd2 = ctx.helper._decrypt(params.newpwd2);

    // 定义校验规则
    const schema = {
      oldpwd: { type: 'string', min: 6, max: 20, required: true },
      newpwd: { type: 'string', min: 6, max: 20, required: true },
      newpwd2: { type: 'string', min: 6, max: 20, required: true }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    // 校验旧密码
    params.userId = _token.payload.userId;
    const validData = await ctx.service.user.validPwdById(params);
    if (!validData) {
      ctx.body = { status: 1, message: '原密码不正确' };
      return;
    }
    // 调用service
    const result = await ctx.service.user.editPwdById(params);
    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '添加失败' };
    }
  }
  // 修改用户基本信息
  async editUserInfo() {
    const { ctx } = this;
    const params = { ...ctx.request.body };
    // 移除图片前缀
    params.avatar = ctx.helper.removeImgPrefix(params.avatar);

    // 定义校验规则
    const schema = {
      userName: { type: 'string', max: 20, required: true },
      remark: { type: 'string', max: 255, required: false },
      email: { type: 'email', max: 64, required: true },
      avatar: { type: 'string', max: 64, required: false }
    };
    // 校验参数
    if (!this.validate(schema, params)) return;

    const userData = await ctx.service.user.getUserById(params.userId);
    if (!userData) {
      ctx.body = { status: 1, message: '不存在的用户' };
      return;
    }
    // 调用service
    const result = await ctx.service.user.editUserInfo(params);

    if (result) {
      ctx.body = { status: 0, message: 'success' };
    } else {
      ctx.body = { status: 1, message: '修改失败' };
    }
  }
}

module.exports = UserController;

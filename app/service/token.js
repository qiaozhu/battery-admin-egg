const Service = require('egg').Service;

class TokenService extends Service {
  // 创建token
  async createToken(params) {
    const { app } = this;
    const token = app.jwt.sign(params, app.config.jwt.secret, {
      expiresIn: 36000
    });
    return `Bearer ${token}`;
  }
  // 解析token 并返回用户基本信息
  async decryptToken() {
    const { ctx, app } = this;
    const token = ctx.header.authorization.replace('Bearer ', '');
    return await app.jwt.decode(token, { complete: true });
  }
}

module.exports = TokenService;

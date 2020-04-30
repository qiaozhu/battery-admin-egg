'use strict';

const Controller = require('./base');

class UtilsController extends Controller {
  async upload() {
    const { ctx } = this;
    const fileStream = await ctx.getFileStream();
    if (!fileStream) {
      ctx.body = { status: 1, message: '未找到文件内容' };
      return;
    }

    const result = await ctx.service.file.upload(fileStream);
    ctx.body = { status: 0, message: 'success', data: result };
  }
  async download() {
    const filePath = path.resolve(this.app.config.static.dir, 'hello.txt');
    this.ctx.attachment('hello.txt');
    this.ctx.set('Content-Type', 'application/octet-stream');
    this.ctx.body = fs.createReadStream(filePath);
  }

  async downloadImage() {
    const url = 'http://cdn2.ettoday.net/images/1200/1200526.jpg';
    const res = await this.ctx.curl(url, {
      streaming: true
    });

    this.ctx.type = 'jpg';
    this.ctx.body = res.res;
  }
}

module.exports = UtilsController;

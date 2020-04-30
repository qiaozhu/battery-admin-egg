const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

const Service = require('egg').Service;

class FileService extends Service {
  async upload(fileStream) {
    const { ctx } = this;
    // 时间戳命名文件
    const filename = Date.now() + path.extname(fileStream.filename).toLowerCase();

    // 目标路径
    const dateNow = ctx.helper.moment().format('YYYYMMDD');
    const targetDir = path.join(this.config.baseDir, 'app/public', dateNow);

    // 不存在则创建目录
    const exists = await fs.exists(targetDir);
    if (!exists) await fs.mkdir(targetDir);

    const target = fs.createWriteStream(path.join(targetDir, filename));

    await pump(fileStream, target);

    return { url: `/public/${dateNow}/${filename}` };
  }
}

module.exports = FileService;

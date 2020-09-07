'use strict';

const { v1: uuidv1 } = require('uuid');
const JSEncrypt = require('node-jsencrypt');
const md5 = require('md5');
const moment = require('moment');
const humps = require('humps');
const nodemailer = require('nodemailer');

module.exports = {
  _uuid: function () {
    return uuidv1().replace(/-/g, '');
  },
  // rsa加密
  _encrypt: function (value) {
    const { app } = this;
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(app.config.rsaKey.publicKey);
    return encrypt.encrypt(value);
  },
  // rsa解密
  _decrypt: function (value) {
    const { app } = this;
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(app.config.rsaKey.privateKey);
    return decrypt.decrypt(value);
  },
  // md5加密
  _md5: function (value) {
    return md5(value);
  },
  // 时间格式化
  dateFormat: function (value) {
    const _date = new Date(value);

    var date = {
      'M+': _date.getMonth() + 1,
      'd+': _date.getDate(),
      'h+': _date.getHours(),
      'm+': _date.getMinutes(),
      's+': _date.getSeconds(),
      'q+': Math.floor((_date.getMonth() + 3) / 3),
      'S+': _date.getMilliseconds(),
    };
    if (/(y+)/i.test(value)) {
      value = value.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp('(' + k + ')').test(value)) {
        value = value.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length)
        );
      }
    }
    return value;
  },
  // 平行结构转树结构
  arrayToTree(arr) {
    //  删除所有 children,以防止多次调用
    arr.forEach(function (item) {
      delete item.children;
    });
    let map = {}; // 构建map
    // 构建以menuId为键 当前数据为值
    arr.forEach(i => (map[i.menuId] = i));

    let treeData = [];
    arr.forEach(child => {
      // 判断当前数据的parentId是否存在map中
      const mapItem = map[child.parentId];

      if (mapItem) {
        // 存在则表示当前数据不是最顶层数据
        // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
        // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
        (mapItem.children || (mapItem.children = [])).push(child);
      } else {
        // 不存在则是组顶层数据
        treeData.push(child);
      }
    });
    return treeData;
  },

  // sequelize查询结果转json
  seqDataToJson(data) {
    return JSON.parse(JSON.stringify(data));
  },
  /**
   * 通用分页查询
   * @param {object} params 参数
   * @param {array} attributes 查询属性
   * @param {object} where 查询条件
   * @param {model} model 查询模型
   * @param {object} scope 查询作用域
   */
  async queryList(params, attributes, where, model, scope) {
    const { ctx } = this;
    // 查询list
    const listResult = await ctx.model[model].scope(scope).findAndCountAll({
      offset: parseInt(params.pageNo - 1) * parseInt(params.pageSize),
      limit: params.pageSize,
      attributes,
      ...where,
    });

    // 返回分页查询结果
    return { count: listResult.count, list: listResult.rows };
  },
  // 生成随机字符串
  randomName(len) {
    len = len || 16;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (var i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    // return new Date().getTime() + str;
    return str;
  },
  /**
   * 生成编号
   * @param {string} type 前缀
   * @param {string} col 字段名
   * @param {model} model 查询模型
   */
  async randomNo(type, col, model) {
    const { ctx } = this;
    function zero(num, n) {
      var len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    }
    const year = this.moment().format('YYYYMMDDhh');
    let max = await ctx.model[model].scope([]).max(col);
    if (max) {
      return `${type}${year}${zero(Number(max.substr(max.length - 5)) + 1, 5)}`;
    } else {
      return `${type}${year}${zero(1, 5)}`;
    }
  },
  /**
   *
   * @param {string} type login或者code
   * @param {string} to 目标邮箱地址
   * @param {string} code login时是密码  code时是验证码
   */
  async sendEmail(type, to, code) {
    const { app } = this;
    return new Promise(async (resolve, reject) => {
      try {
        const transporter = nodemailer.createTransport({
          host: app.config.mail.host,
          secure: true,
          port: app.config.mail.port,
          auth: app.config.mail.auth,
        });

        let content1 = `您被邀请登录<b>${app.config.projectName}</b>`;
        content1 = content1 + '<br/><br/>';
        content1 = content1 + '您的初始登录密码为：<br/>';
        content1 = content1 + '<p><b>' + code + '</b></p>';
        content1 = content1 + '<p>请妥善保管，并立即修改登录密码！</p><br/>';
        content1 = content1 + '<p>如有疑问，请拨打联系电话：' + app.config.linkPhone + '</p>';
        content1 = content1 + '<p style="color:red">请勿回复该邮件</p>';
        content1 = content1 + '<p>' + app.config.companyName + '</p>';
        const subject1 = '邀请通知';

        let content2 = `感谢您使用<b>${app.config.projectName}</b>`;
        content2 = content2 + '<br/><br/>';
        content2 = content2 + '您正在进行修改登录密码的操作<br/>';
        content2 = content2 + '您此次操作的验证码为：<br/>';
        content2 = content2 + '<p><b>' + code + '</b></p>';
        content2 = content2 + '<p>十分钟内有效！</p><br/>';
        content2 = content2 + '<p>如有疑问，请拨打联系电话：' + app.config.linkPhone + '</p>';
        content2 = content2 + '<p style="color:red">请勿回复该邮件</p>';
        content2 = content2 + '<p>' + app.config.companyName + '</p>';
        const subject2 = '验证码通知';

        await transporter.sendMail({
          from: `${app.config.companyName} <${app.config.mail.from}>`,
          to: to,
          subject: type === 'login' ? subject1 : subject2,
          html: type === 'login' ? content1 : content2,
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  // 处理图片前缀
  addImgPrefix(field) {
    const { app } = this;
    // 首部加前缀
    const CONCAT_FN = app.Sequelize.fn('CONCAT', app.config.imgPrefix, app.Sequelize.col(field));
    // 逗号隔开的字段 替换,添加前缀
    const REPLACE_FN = app.Sequelize.fn('REPLACE', CONCAT_FN, ',', `,${app.config.imgPrefix}`);
    // 为空不用替换
    const IF_FN = app.Sequelize.fn('IF', app.Sequelize.literal(`${field} != '' || ${field} != NULL`), REPLACE_FN, '');
    return IF_FN;
  },
  // 处理图片前缀
  removeImgPrefix(url) {
    const { app } = this;
    if (url) {
      if (url.indexOf(app.config.imgPrefix) > -1) {
        return url.replace(new RegExp(app.config.imgPrefix, 'g'), '');
      } else {
        return url;
      }
    } else {
      return '';
    }
  },
  moment,
  humps,
};

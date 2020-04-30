'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const httpLog = app.middleware.httpLog();
  router.get('/utils/guid', controller.utils.guid);
  router.get('/utils/humps', controller.utils.humps);

  router.post('/file/upload', httpLog, app.jwt, controller.file.upload);

  router.post('/user/login', httpLog, controller.user.login);
  router.get('/user/getUserInfo', httpLog, app.jwt, controller.user.getUserInfo);

  router.post('/user/getUserList', httpLog, app.jwt, controller.user.getUserList);
  router.post('/user/addAccount', httpLog, app.jwt, controller.user.addAccount);
  router.post('/user/editAccount', httpLog, app.jwt, controller.user.editAccount);
  router.post('/user/disableAccount', httpLog, app.jwt, controller.user.disableAccount);
  router.post('/user/delAccount', httpLog, app.jwt, controller.user.delAccount);
  router.post('/user/editUserInfo', httpLog, app.jwt, controller.user.editUserInfo);
  router.get('/user/getUserInfoById', httpLog, app.jwt, controller.user.getUserInfoById);
  router.post('/user/editAccountPwd', httpLog, app.jwt, controller.user.editAccountPwd);
  router.post('/user/forgetPwdSend', httpLog, controller.user.forgetPwdSend); // 忘记密码-发送验证码 无需jwt
  router.post('/user/forgetPwdSet', httpLog, controller.user.forgetPwdSet); // 忘记密码-设置新密码 无需jwt

  router.get('/system/getUserMenuTree', httpLog, app.jwt, controller.system.getUserMenuTree);
  router.get('/system/getMenuTreeAll', httpLog, app.jwt, controller.system.getMenuTreeAll);
  router.post('/system/saveMenu', httpLog, app.jwt, controller.system.saveMenu);
  router.get('/system/getMenuDetail', httpLog, app.jwt, controller.system.getMenuDetail);
  router.get('/system/delMenu', httpLog, app.jwt, controller.system.delMenu);
  router.get('/system/getAllDict', httpLog, app.jwt, controller.system.getAllDict);
  router.post('/system/getDictList', httpLog, app.jwt, controller.system.getDictList);
  router.post('/system/saveDict', httpLog, app.jwt, controller.system.saveDict);
  router.get('/system/delDict', httpLog, app.jwt, controller.system.delDict);

  router.post('/warehouse/getWarehouseList', httpLog, app.jwt, controller.warehouse.getWarehouseList);
  router.post('/warehouse/addWarehouse', httpLog, app.jwt, controller.warehouse.addWarehouse);
  router.get('/warehouse/getWarehouseInfo', httpLog, app.jwt, controller.warehouse.getWarehouseInfo);
  router.post('/warehouse/editWarehouse', httpLog, app.jwt, controller.warehouse.editWarehouse);
  router.post('/warehouse/getWarehouseDetailList', httpLog, app.jwt, controller.warehouse.getWarehouseDetailList);

  router.post('/goods/getGoodsList', httpLog, app.jwt, controller.goods.getGoodsList);
  router.get('/goods/getGoodsDetail', httpLog, app.jwt, controller.goods.getGoodsDetail);
  router.post('/goods/addGoods', httpLog, app.jwt, controller.goods.addGoods);
  router.post('/goods/editGoods', httpLog, app.jwt, controller.goods.editGoods);
};

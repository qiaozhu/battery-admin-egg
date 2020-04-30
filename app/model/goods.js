'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, Op } = app.Sequelize;
  const Goods = app.model.define(
    'Goods',
    {
      id: { type: INTEGER(10), autoIncrement: true, primaryKey: true, unique: true },
      goodsId: { type: STRING(32), allowNull: false, field: 'goods_id' },
      goodsNo: { type: STRING(16), allowNull: false, field: 'goods_no' },
      goodsType: { type: STRING(64), allowNull: false, field: 'goods_type' },
      goodsSku: { type: STRING(64), field: 'goods_sku' },
      goodsName: { type: STRING(32), allowNull: false, field: 'goods_name' },
      remark: STRING(255),
      imgList: { type: STRING(255), field: 'img_list' },
      state: { type: INTEGER(4), allowNull: false, defaultValue: 0 },
      delState: { type: INTEGER(4), allowNull: false, defaultValue: 0, field: 'del_state' },
      createTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'create_time' },
      updateTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'update_time' },
      companyId: { type: STRING(128), allowNull: false, field: 'company_id' }
    },
    {
      timestamps: false,
      freezeTableName: true, // Model 对应的表名将与model名相同 sequelize就不会再名字后附加“s”字符
      tableName: 'goods',
      underscored: true, // 将驼峰写法createdAt转为下划线写法created_at 仅影响Sequelize自动生成的字段
      defaultScope: {
        where: {
          delState: 0
        }
      },
      scopes: {
        company: function(id) {
          return {
            where: {
              companyId: { [Op.like]: `%${id}%` }
            }
          };
        }
      }
    }
  );

  return Goods;
};

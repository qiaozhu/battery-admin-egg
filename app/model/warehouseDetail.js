'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, Op } = app.Sequelize;
  const WarehouseDetail = app.model.define(
    'WarehouseDetail',
    {
      id: { type: INTEGER(10), autoIncrement: true, primaryKey: true, unique: true },
      warehouseId: { type: STRING(32), allowNull: false, field: 'warehouse_id' },
      goodsId: { type: STRING(32), allowNull: false, field: 'goods_id' },
      count: { type: INTEGER(10), allowNull: false, defaultValue: 0 },
      remark: STRING(255),
      delState: { type: INTEGER(4), allowNull: false, defaultValue: 0, field: 'del_state' },
      createTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'create_time' },
      updateTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'update_time' }
    },
    {
      timestamps: false,
      freezeTableName: true, // Model 对应的表名将与model名相同 sequelize就不会再名字后附加“s”字符
      tableName: 'warehouse_detail',
      underscored: true, // 将驼峰写法createdAt转为下划线写法created_at 仅影响Sequelize自动生成的字段
      defaultScope: {
        where: {
          delState: 0
        }
      }
    }
  );
  WarehouseDetail.associate = function() {
    app.model.WarehouseDetail.belongsTo(app.model.Warehouse, {
      foreignKey: 'warehouseId',
      targetKey: 'warehouseId',
      as: 'warehouse'
    });
    app.model.WarehouseDetail.belongsTo(app.model.Goods, {
      foreignKey: 'goodsId',
      targetKey: 'goodsId',
      as: 'goods'
    });
  };

  return WarehouseDetail;
};

'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, Op } = app.Sequelize;
  const Warehouse = app.model.define(
    'Warehouse',
    {
      id: { type: INTEGER(10), autoIncrement: true, primaryKey: true, unique: true },
      warehouseId: { type: STRING(32), allowNull: false, field: 'warehouse_id' },
      warehouseNo: { type: STRING(16), allowNull: false, field: 'warehouse_no' },
      warehouseType: { type: STRING(64), allowNull: false, field: 'warehouse_type' },
      name: { type: STRING(32), allowNull: false },
      remark: STRING(255),
      state: { type: INTEGER(4), allowNull: false, defaultValue: 0 },
      delState: { type: INTEGER(4), allowNull: false, defaultValue: 0, field: 'del_state' },
      createTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'create_time' },
      updateTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'update_time' },
      companyId: { type: STRING(128), allowNull: false, field: 'company_id' }
    },
    {
      timestamps: false,
      freezeTableName: true, // Model 对应的表名将与model名相同 sequelize就不会再名字后附加“s”字符
      tableName: 'warehouse',
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

  return Warehouse;
};

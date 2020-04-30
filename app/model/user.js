'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, Op } = app.Sequelize;
  const User = app.model.define(
    'User',
    {
      id: { type: INTEGER(10), autoIncrement: true, primaryKey: true, unique: true },
      userId: { type: STRING(32), allowNull: false, field: 'user_id' },
      userName: { type: STRING(20), allowNull: false, field: 'user_name' },
      account: { type: STRING(11), allowNull: false },
      password: { type: STRING(32), allowNull: false },
      avatar: STRING(64),
      remark: STRING(255),
      state: { type: INTEGER(4), allowNull: false, defaultValue: 0 },
      isAdmin: { type: INTEGER(4), allowNull: false, defaultValue: 0 },
      email: { type: STRING(64), allowNull: false },
      delState: { type: INTEGER(4), allowNull: false, defaultValue: 0, field: 'del_state' },
      createTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'create_time' },
      updateTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'update_time' },
      companyId: { type: STRING(128), allowNull: false, field: 'company_id' }
    },
    {
      timestamps: false,
      freezeTableName: true, // Model 对应的表名将与model名相同 sequelize就不会再名字后附加“s”字符
      tableName: 'user',
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

  return User;
};

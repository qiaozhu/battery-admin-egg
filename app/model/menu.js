'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;
  const Menu = app.model.define(
    'Menu',
    {
      id: { type: INTEGER(10), autoIncrement: true, primaryKey: true, unique: true },
      menuId: { type: STRING(32), allowNull: false, field: 'menu_id' },
      parentId: { type: STRING(32), field: 'parent_id' },
      name: { type: STRING(20), allowNull: false },
      href: STRING(50),
      icon: STRING(20),
      isDefault: { type: INTEGER(4), allowNull: false, defaultValue: 0, field: 'is_default' },
      isShow: { type: INTEGER(4), allowNull: false, defaultValue: 1, field: 'is_show' },
      permission: STRING(50),
      sort: { type: INTEGER(4), allowNull: false, defaultValue: 1 },
      createTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'create_time' },
      updateTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'update_time' }
    },
    {
      timestamps: false,
      freezeTableName: true, // Model 对应的表名将与model名相同 sequelize就不会再名字后附加“s”字符
      tableName: 'menu',
      underscored: true // 将驼峰写法createdAt转为下划线写法created_at 仅影响Sequelize自动生成的字段
    }
  );

  return Menu;
};

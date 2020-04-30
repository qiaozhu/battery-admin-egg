'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;
  const DictBase = app.model.define(
    'DictBase',
    {
      id: { type: INTEGER(10), autoIncrement: true, primaryKey: true, unique: true },
      dictId: { type: STRING(32), allowNull: false, field: 'dict_id' },
      label: { type: STRING(64), allowNull: false },
      value: { type: STRING(64), allowNull: false },
      type: { type: STRING(64), allowNull: false },
      typeLabel: { type: STRING(64), allowNull: false, field: 'type_label' },
      remark: STRING(255),
      sort: { type: INTEGER(4), allowNull: false, defaultValue: 1 },
      delState: { type: INTEGER(4), allowNull: false, defaultValue: 0, field: 'del_state' },
      createTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'create_time' },
      updateTime: { type: DATE, allowNull: false, defaultValue: NOW, field: 'update_time' }
    },
    {
      timestamps: false,
      freezeTableName: true, // Model 对应的表名将与model名相同 sequelize就不会再名字后附加“s”字符
      tableName: 'dict_base',
      underscored: true // 将驼峰写法createdAt转为下划线写法created_at 仅影响Sequelize自动生成的字段
    }
  );

  return DictBase;
};

import { Sequelize, DataTypes } from 'sequelize';
import { GROUP_MODEL_CONFIG } from './group-model.config';
import { GroupAttributes, GroupInstance, GroupModel } from './group-model.interface';

export async function defineGroupModel(sequelize: Sequelize): Promise<GroupModel> {
  const groupModel: GroupModel = sequelize.define<GroupInstance, GroupAttributes>(GROUP_MODEL_CONFIG.modelName, {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    }
  }, {
    tableName: GROUP_MODEL_CONFIG.tableName,
    timestamps: false
  });

  await groupModel.sync({ alter: true });

  return groupModel;
}

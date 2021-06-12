import { DataTypes, Sequelize } from 'sequelize';
import { GroupModel } from '../group';
import { UserModel } from '../user';
import { USER_GROUP_MODEL_CONFIG } from './user-group-model.config';
import { UserGroupAttributes, UserGroupInstance, UserGroupModel } from './user-group-model.interface';

export async function defineUserGroupModel(sequelize: Sequelize, userModel: UserModel, groupModel: GroupModel): Promise<UserGroupModel> {
  const userGroupModel: UserGroupModel = sequelize.define<UserGroupInstance, UserGroupAttributes>(USER_GROUP_MODEL_CONFIG.modelName, {
    userGroupPk: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: userModel,
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: groupModel,
        key: 'id'
      }
    }
  }, {
    tableName: USER_GROUP_MODEL_CONFIG.tableName,
    timestamps: false
  });

  userModel.belongsToMany(groupModel, { through: userGroupModel, foreignKey: 'userId', otherKey: 'groupId' });
  groupModel.belongsToMany(userModel, { through: userGroupModel, foreignKey: 'groupId', otherKey: 'userId' });

  await userGroupModel.sync({ alter: true });

  return userGroupModel;
}

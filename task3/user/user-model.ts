import { Sequelize, DataTypes } from 'sequelize';
import { UserModel, UserInstance } from './user-model.interface';
import { userModelConfig } from './user-model.config';

export async function defineUserModel(sequelize: Sequelize): Promise<UserModel> {
  const userModel: UserModel = sequelize.define<UserInstance>(userModelConfig.modelName, {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: userModelConfig.tableName,
    timestamps: false
  });

  await userModel.sync();

  return userModel;
}

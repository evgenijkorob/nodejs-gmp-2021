import { Model, ModelCtor } from 'sequelize';

export interface UserGroupCreationAttributes {
  groupId: number;
  userId: number;
}

export interface UserGroupAttributes extends UserGroupCreationAttributes {
  userGroupPk: number;
}

export interface UserGroupInstance extends Model<UserGroupAttributes, UserGroupCreationAttributes>, UserGroupAttributes { }

export type UserGroupModel = ModelCtor<UserGroupInstance>;

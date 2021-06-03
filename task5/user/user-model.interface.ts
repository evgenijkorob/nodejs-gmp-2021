import { Model, ModelCtor } from 'sequelize';

export interface UserCreationAttributes {
  login: string;
  password: string;
  age: number;
}

export interface UserAttributes extends UserCreationAttributes {
  id: number;
  isDeleted: boolean;
}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes { }

export type UserModel = ModelCtor<UserInstance>;

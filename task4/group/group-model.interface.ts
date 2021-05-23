import { Model, ModelCtor } from 'sequelize';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface GroupCreationAttributes {
  name: string;
  permissions: Permission[];
}

export interface GroupAttributes extends GroupCreationAttributes {
  id: number;
}

export interface GroupInstance extends Model<GroupAttributes, GroupCreationAttributes>, GroupAttributes {
  // eslint-disable-next-line no-unused-vars
  addUsers: (userIds: number[]) => Promise<void>;
}

export type GroupModel = ModelCtor<GroupInstance>;

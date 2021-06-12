import { UserAttributes, UserCreationAttributes } from './user-model.interface';

export type UserDTO = UserCreationAttributes;

export type PartialUserDTO = Partial<UserCreationAttributes>;

export type User = UserAttributes;

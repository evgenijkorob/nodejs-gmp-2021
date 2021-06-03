import { GroupAttributes, GroupCreationAttributes } from './group-model.interface';

export type GroupDTO = GroupCreationAttributes;

export type GroupPartialDTO = Partial<GroupCreationAttributes>;

export type Group = GroupAttributes;

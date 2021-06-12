import { Request } from 'express';

export interface RequestWithGroupId extends Request {
  groupId: number;
}

export interface AddUsersToGroupBody {
  userIds: number[];
}

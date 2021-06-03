import { Router } from 'express';
import { UserModel } from '../user';
import { GroupController } from './group-controller';
import { GroupDataMapper } from './group-data-mapper';
import { GroupModel } from './group-model.interface';
import { GroupRepository } from './group-repository';
import { GroupService } from './group-service';
import { GroupValidator } from './group-validator';

export { GroupController } from './group-controller';
export { GroupModel } from './group-model.interface';
export { defineGroupModel } from './group-model';

export function configureGroupController(groupModel: GroupModel, userModel: UserModel): GroupController {
  const groupDataMapper = new GroupDataMapper();
  const groupRepository = new GroupRepository(groupModel, groupDataMapper, userModel);
  const groupService = new GroupService(groupRepository);
  const groupValidator = new GroupValidator();

  return new GroupController(Router(), groupService, groupValidator);
}

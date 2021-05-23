import { GroupController, configureGroupController } from '../group';
import { UserController, configureUserController } from '../user';
import { AppModels } from './models';

export type AppControllers = [UserController, GroupController];

export function loadControllers(models: AppModels): AppControllers {
  const [userModel, groupModel] = models;

  return [
    configureUserController(userModel),
    configureGroupController(groupModel, userModel)
  ];
}

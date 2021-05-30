import { GroupController, configureGroupController } from '../group';
import { AppLogger } from '../loggers';
import { UserController, configureUserController } from '../user';
import { AppModels } from './models';

export type AppControllers = [UserController, GroupController];

export function loadControllers(models: AppModels, logger: AppLogger): AppControllers {
  const [userModel, groupModel] = models;

  return [
    configureUserController(userModel, logger),
    configureGroupController(groupModel, userModel, logger)
  ];
}

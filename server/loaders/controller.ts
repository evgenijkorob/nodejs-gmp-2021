import { Router } from 'express';
import { AuthController, AuthService, AuthValidator } from '../auth';
import { GroupController } from '../group';
import { GroupService } from '../group/group-service';
import { GroupValidator } from '../group/group-validator';
import { AppLogger } from '../loggers';
import { UserController } from '../user';
import { UserService } from '../user/user-service';
import { UserValidator } from '../user/user-validator';
import { AppModels } from './models';
import { configureServices } from './services';

export type AppControllers = [AuthController, UserController, GroupController];

function configureAuthController(authService: AuthService, logger: AppLogger): AuthController {
  const authValidator = new AuthValidator();

  return new AuthController(Router(), authService, authValidator, logger);
}

function configureUserController(userService: UserService, logger: AppLogger): UserController {
  const userValidator = new UserValidator();

  return new UserController(Router(), userService, userValidator, logger);
}

function configureGroupController(groupService: GroupService, logger: AppLogger): GroupController {
  const groupValidator = new GroupValidator();

  return new GroupController(Router(), groupService, groupValidator, logger);
}

export function loadControllers(models: AppModels, logger: AppLogger): AppControllers {
  const [authService, userService, groupService] = configureServices(models);

  return [
    configureAuthController(authService, logger),
    configureUserController(userService, logger),
    configureGroupController(groupService, logger)
  ];
}

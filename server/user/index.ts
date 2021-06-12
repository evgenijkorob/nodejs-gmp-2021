import { Router } from 'express';
import { AppLogger } from '../loggers';
import { UserController } from './user-controller';
import { UserDataMapper } from './user-data-mapper';
import { UserModel } from './user-model.interface';
import { UserRepository } from './user-repository';
import { UserService } from './user-service';
import { UserValidator } from './user-validator';

export { UserController } from './user-controller';
export { UserModel, UserInstance } from './user-model.interface';
export { defineUserModel } from './user-model';

export function configureUserController(userModel: UserModel, logger: AppLogger): UserController {
  const userDataMapper = new UserDataMapper();
  const userRepository = new UserRepository(userModel, userDataMapper);
  const userService = new UserService(userRepository);
  const userValidator = new UserValidator();

  return new UserController(Router(), userService, userValidator, logger);
}

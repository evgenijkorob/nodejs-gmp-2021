import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { UserController } from './user-controller';
import { UserDataMapper } from './user-data-mapper';
import { defineUserModel } from './user-model';
import { UserModel } from './user-model.interface';
import { UserRepository } from './user-repository';
import { UserService } from './user-service';
import { UserValidator } from './user-validator';

export { UserController } from './user-controller';

export async function configureController(sequelize: Sequelize): Promise<UserController> {
  const userModel: UserModel = await defineUserModel(sequelize);
  const userDataMapper = new UserDataMapper();
  const userRepository = new UserRepository(userModel, userDataMapper);
  const userService = new UserService(userRepository);
  const userValidator = new UserValidator();

  return new UserController(Router(), userService, userValidator);
}

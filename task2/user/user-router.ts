import { Router } from 'express';
import { UserController } from './user-controller';
import { UserValidator } from './user-validator';

const userApiRouter: Router = Router();
const userValidator = new UserValidator();
const userController = new UserController(userValidator);

userApiRouter
  .route('/users/search')
  .get(userController.getAutoSuggestUsers.bind(userController));

userApiRouter
  .route('/user')
  .post(userController.addUser.bind(userController));

userApiRouter
  .param('id', userController.getUserFromCollection.bind(userController))
  .route('/user/:id')
  .get(userController.getUser.bind(userController))
  .patch(userController.updateUser.bind(userController))
  .delete(userController.deleteUser.bind(userController));

export default userApiRouter;

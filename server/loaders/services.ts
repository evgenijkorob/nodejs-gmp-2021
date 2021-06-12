import { AuthService } from '../auth';
import { GroupModel } from '../group';
import { GroupDataMapper } from '../group/group-data-mapper';
import { GroupRepository } from '../group/group-repository';
import { GroupService } from '../group/group-service';
import { UserModel } from '../user';
import { UserDataMapper } from '../user/user-data-mapper';
import { UserRepository } from '../user/user-repository';
import { UserService } from '../user/user-service';
import { AppModels } from './models';

export type AppServices = [AuthService, UserService, GroupService];

function createUserService(userModel: UserModel): UserService {
  const userDataMapper = new UserDataMapper();
  const userRepository = new UserRepository(userModel, userDataMapper);

  return new UserService(userRepository);
}

function createGroupService(groupModel: GroupModel, userModel: UserModel): GroupService {
  const groupDataMapper = new GroupDataMapper();
  const groupRepository = new GroupRepository(groupModel, groupDataMapper, userModel);

  return new GroupService(groupRepository);
}

function createAuthService(userService: UserService): AuthService {
  return new AuthService(userService);
}

export function configureServices(models: AppModels): AppServices {
  const [userModel, groupModel] = models;
  const userService: UserService = createUserService(userModel);
  const groupService: GroupService = createGroupService(groupModel, userModel);
  const authService: AuthService = createAuthService(userService);

  return [authService, userService, groupService];
}

import { UserInstance } from './user-model.interface';
import { User } from './user.interface';

export class UserDataMapper {
  public toDomain(dalObj: UserInstance): User {
    return {
      id: dalObj.id,
      isDeleted: dalObj.isDeleted,
      age: dalObj.age,
      login: dalObj.login,
      password: dalObj.password
    };
  }
}

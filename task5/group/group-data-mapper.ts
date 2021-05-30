import { GroupInstance } from './group-model.interface';
import { Group } from './group.interface';

export class GroupDataMapper {
  toDomain(dalObj: GroupInstance): Group {
    return {
      id: dalObj.id,
      name: dalObj.name,
      permissions: dalObj.permissions
    };
  }
}

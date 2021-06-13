import { PERMISSIONS } from '../group';
import { Group, GroupDTO } from '../group/group.interface';
import { User, UserDTO } from '../user';

export const mockUsers: User[] = [
  {
    login: 'evgen@mail.ru',
    password: '12345678evgen',
    age: 22,
    id: 1,
    isDeleted: false
  },
  {
    login: 'mary@mail.ru',
    password: '12345678mary',
    age: 35,
    id: 2,
    isDeleted: false
  },
  {
    login: 'alya@mail.ru',
    password: '12345678alya',
    age: 23,
    id: 3,
    isDeleted: false
  }
];

export const mockUserDTO: UserDTO = {
  age: 21,
  login: 'john.doe@email.com',
  password: '12345678'
};

export const mockGroups: Group[] = [
  {
    id: 1,
    name: 'Group1',
    permissions: PERMISSIONS.slice(0, 1)
  },
  {
    id: 2,
    name: 'Group2',
    permissions: PERMISSIONS.slice(1, 2)
  },
  {
    id: 3,
    name: 'Group3',
    permissions: PERMISSIONS.slice(2, 3)
  }
];

export const mockGroupDTO: GroupDTO = {
  name: 'Group4',
  permissions: PERMISSIONS.slice(0, 3)
};

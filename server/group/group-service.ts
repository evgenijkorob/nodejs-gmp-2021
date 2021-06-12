import { GroupPartialDTO, Group, GroupDTO } from './group.interface';
import { GroupRepository } from './group-repository';

export class GroupService {
  private readonly repository: GroupRepository;

  constructor(repository: GroupRepository) {
    this.repository = repository;
  }

  public async getGroupById(id: number): Promise<Group> {
    return this.repository.findOneByPk(id);
  }

  public async getAllGroups(): Promise<Group[]> {
    return this.repository.findAll();
  }

  public async createGroup(dto: GroupDTO): Promise<Group> {
    return this.repository.create(dto);
  }

  public async patchGroup(dto: GroupPartialDTO, id: number): Promise<Group> {
    return this.repository.patch(dto, id);
  }

  public async deleteGroup(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  public async addUsersToGroup(groupId: number, userIds: number[]): Promise<void> {
    return this.repository.addUsersToGroup(groupId, userIds);
  }
}

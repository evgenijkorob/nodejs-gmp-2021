import { Op } from 'sequelize';
import { GroupInstance, GroupModel } from './group-model.interface';
import { GroupPartialDTO, Group, GroupDTO } from './group.interface';
import { NoGroupError, NotUniqueGroupError, NoUsersToAddError } from './group-errors';
import { GroupDataMapper } from './group-data-mapper';
import { UserInstance, UserModel } from '../user';

export class GroupRepository {
  private readonly model: GroupModel;
  private readonly userModel: UserModel;
  private readonly mapper: GroupDataMapper;

  constructor(model: GroupModel, mapper: GroupDataMapper, userModel: UserModel) {
    this.model = model;
    this.mapper = mapper;
    this.userModel = userModel;
  }

  public async create(dto: GroupDTO): Promise<Group> {
    const groupWithSameName: GroupInstance = await this.findOneByName(dto.name);

    if (groupWithSameName) {
      throw new NotUniqueGroupError();
    }

    const group: GroupInstance = await this.model.create({ ...dto });

    return this.mapper.toDomain(group);
  }

  public async findOneByPk(id: number): Promise<Group> {
    const group: GroupInstance = await this.model.findByPk(id);

    if (!group) {
      throw new NoGroupError();
    }

    return this.mapper.toDomain(group);
  }

  public async findAll(): Promise<Group[]> {
    const groups: GroupInstance[] = await this.model.findAll();

    return groups.map((group: GroupInstance): Group => this.mapper.toDomain(group));
  }

  public async patch(dto: GroupPartialDTO, id: number): Promise<Group> {
    let group: GroupInstance = await this.model.findByPk(id);

    if (!group) {
      throw new NoGroupError();
    }

    if (dto.name) {
      const groupWithSameName: GroupInstance = await this.findOneByName(dto.name);

      if (groupWithSameName) {
        throw new NotUniqueGroupError();
      }
    }

    group.name = dto.name || group.name;
    group.permissions = dto.permissions || group.permissions;
    group = await group.save();

    return this.mapper.toDomain(group);
  }

  public async delete(id: number): Promise<void> {
    const group: GroupInstance = await this.model.findByPk(id);

    if (!group) {
      throw new NoGroupError();
    }

    await group.destroy({ force: true });
  }

  public async addUsersToGroup(groupId: number, userIds: number[]): Promise<void> {
    const group: GroupInstance = await this.model.findByPk(groupId);

    if (!group) {
      throw new NoGroupError();
    }

    const users: UserInstance[] = await this.userModel.findAll({
      where: {
        id: userIds,
        isDeleted: false
      }
    });
    const notExistingUsersIds = new Set<number>(userIds);

    for (const user of users) {
      if (notExistingUsersIds.has(user.id)) {
        notExistingUsersIds.delete(user.id);
      }
    }

    if (notExistingUsersIds.size) {
      throw new NoUsersToAddError([...notExistingUsersIds]);
    }

    await group.addUsers(userIds);
  }

  private async findOneByName(name: string): Promise<GroupInstance> {
    return this.model.findOne({
      where: {
        name: {
          [Op.eq]: name
        }
      }
    });
  }
}

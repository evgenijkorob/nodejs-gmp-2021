import { Op } from 'sequelize';
import { UserInstance, UserModel } from './user-model.interface';
import { PartialUserDTO, User, UserDTO } from './user.interface';
import { UserDataMapper } from './user-data-mapper';
import { NoUserError, NotUniqueUserError } from './user-errors';

export class UserRepository {
  private readonly model: UserModel;
  private readonly mapper: UserDataMapper;

  constructor(model: UserModel, mapper: UserDataMapper) {
    this.model = model;
    this.mapper = mapper;
  }

  public async create(dto: UserDTO): Promise<User> {
    const userWithSameLogin: UserInstance = await this.findRecordedOneByLogin(dto.login);

    if (userWithSameLogin) {
      throw new NotUniqueUserError();
    }

    const user: UserInstance = await this.model.create({ ...dto });

    return this.mapper.toDomain(user);
  }

  public async findOneByPk(id: number): Promise<User> {
    const user: UserInstance = await this.findNotDeletedByPk(id);

    if (!user) {
      throw new NoUserError();
    }

    return this.mapper.toDomain(user);
  }

  public async patch(dto: PartialUserDTO, id: number): Promise<User> {
    let user: UserInstance = await this.findNotDeletedByPk(id);

    if (!user) {
      throw new NoUserError();
    }

    if (dto.login) {
      const userWithSameLogin: UserInstance = await this.findRecordedOneByLogin(dto.login);

      if (userWithSameLogin) {
        throw new NotUniqueUserError();
      }
    }

    user.login = dto.login || user.login;
    user.password = dto.password || user.password;
    user.age = dto.age || user.age;
    user = await user.save();

    return this.mapper.toDomain(user);
  }

  public async delete(id: number): Promise<void> {
    const user: UserInstance = await this.findNotDeletedByPk(id);

    if (!user) {
      throw new NoUserError();
    }

    user.isDeleted = true;
    await user.save();
  }

  public async findAllByLoginSubstring(loginSubstring: string, limit: number): Promise<User[]> {
    const users: UserInstance[] = await this.model.findAll({
      limit,
      where: {
        isDeleted: false,
        login: {
          [Op.substring]: loginSubstring
        }
      }
    });

    return users.map(user => this.mapper.toDomain(user));
  }

  public async findOneByLogin(login: string): Promise<User> {
    const user: UserInstance = await this.findRecordedOneByLogin(login);

    if (!user || user.isDeleted) {
      throw new NoUserError();
    }

    return this.mapper.toDomain(user);
  }

  private async findRecordedOneByLogin(login: string): Promise<UserInstance> {
    return await this.model.findOne({
      where: {
        login: {
          [Op.eq]: login
        }
      }
    });
  }

  private async findNotDeletedByPk(id: number): Promise<UserInstance> {
    const user: UserInstance = await this.model.findByPk(id);

    if (user && !user.isDeleted) {
      return user;
    }

    return null;
  }
}

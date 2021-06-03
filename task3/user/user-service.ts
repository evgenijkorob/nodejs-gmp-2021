import { PartialUserDTO, User, UserDTO } from './user.interface';
import { UserRepository } from './user-repository';

export class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public async getUserById(id: number): Promise<User> {
    return this.repository.findOneByPk(id);
  }

  public async createUser(dto: UserDTO): Promise<User> {
    return this.repository.create(dto);
  }

  public async patchUser(dto: PartialUserDTO, id: number): Promise<User> {
    return this.repository.patch(dto, id);
  }

  public async deleteUser(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public async filterUsers(loginSubstring: string, limit: number): Promise<User[]> {
    return this.repository.findAllByLoginSubstring(loginSubstring, limit);
  }
}

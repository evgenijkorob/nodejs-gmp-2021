import { NoUserError, User, UserService } from '../user';
import { EmptyTokenError, InvalidCredentialsError, InvalidTokenError } from './auth-errors';
import { LoginRequestPayload } from './auth.interface';
import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly userService: UserService;
  private readonly key: string = 'super-top-secret';

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async login(payload: LoginRequestPayload): Promise<string> {
    const { login, password } = payload;
    let user: User;

    try {
      user = await this.userService.getUserByLogin(login);
    } catch (err) {
      if (err instanceof NoUserError) {
        throw new InvalidCredentialsError();
      } else {
        throw err;
      }
    }

    if (user.password !== password) {
      throw new InvalidCredentialsError();
    }

    return jwt.sign({ userId: user.id }, this.key, { expiresIn: '1m' });
  }

  public async verifyToken(token: string): Promise<void> {
    if (!token) {
      throw new EmptyTokenError();
    }

    try {
      jwt.verify(token, this.key);
    } catch (err) {
      throw new InvalidTokenError();
    }
  }
}

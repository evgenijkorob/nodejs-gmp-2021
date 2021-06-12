// eslint-disable-next-line import/no-unresolved
import { JWTPayload } from 'jose/webcrypto/types';

export interface LoginRequestPayload {
  login: string;
  password: string;
}

export interface UserJWTPayload extends JWTPayload {
  userId: number;
}

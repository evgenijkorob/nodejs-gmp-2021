import { Request } from 'express';

export interface InitialUser {
  login: string;
  password: string;
  age: number;
}

export interface User extends InitialUser {
  id: string;
  isDeleted: boolean;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface JoiSimpleError {
  path: (string | number)[];
  message: string;
}

export interface JoiErrorsResponse {
  errors: JoiSimpleError[];
}

export interface ErrorResponse {
  error: string;
}

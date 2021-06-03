import { Request } from 'express';

export interface AutoSuggestUserQueryParams {
  loginSubstring: string;
  limit: string;
}

export interface RequestWithUserId extends Request {
  userId: number;
}

import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../helpers';

// eslint-disable-next-line no-unused-vars
export function handleAllErrors(err: any, _: Request, res: Response, __: NextFunction) {
  if (!res.headersSent) {
    res.status(500).send(createErrorResponse('Internal server error'));
  }

  console.error(err);
}

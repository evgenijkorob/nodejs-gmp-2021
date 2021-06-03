import { ErrorRequestHandler } from 'express';
import { createErrorResponse } from '../helpers';

// eslint-disable-next-line no-unused-vars
export const handleAllErrors: ErrorRequestHandler = (err, _, res, __) => {
  if (!res.headersSent) {
    res.status(500).send(createErrorResponse('internal server error'));
  }

  console.error(err);
};

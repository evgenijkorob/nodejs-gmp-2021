import { ErrorRequestHandler } from 'express';
import { createErrorResponse } from '../helpers';

export const handleAllErrors: ErrorRequestHandler = (err, _, res) => {
  if (!res.headersSent) {
    res.status(500).send(createErrorResponse('internal server error'));
  }

  console.error(err);
};

import Joi from 'joi';
import { ErrorResponse, JoiSimpleError } from '../user/user-interface';

export function createErrorResponse(error: string): ErrorResponse {
  return { error };
}

export function createValidationErrorResponse(schemaErrors: Joi.ValidationErrorItem[]) {
  const errors: JoiSimpleError[] = schemaErrors.map(({ path, message }) => ({ path, message }));

  return {
    errors
  };
}

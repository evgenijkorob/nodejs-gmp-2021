import Joi from 'joi';

export interface JoiSimpleError {
  path: (string | number)[];
  message: string;
}

export interface JoiErrorsResponse {
  errors: JoiSimpleError[];
}

export interface ErrorResponse {
  error: string;
  details?: object;
}

export function createErrorResponse(error: string, details?: object): ErrorResponse {
  return {
    error,
    details
  };
}

export function createValidationErrorResponse(schemaErrors: Joi.ValidationErrorItem[]) {
  const errors: JoiSimpleError[] = schemaErrors.map(({ path, message }) => ({ path, message }));

  return {
    errors
  };
}

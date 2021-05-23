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
}

export function createErrorResponse(error: string): ErrorResponse {
  return { error };
}

export function createValidationErrorResponse(schemaErrors: Joi.ValidationErrorItem[]) {
  const errors: JoiSimpleError[] = schemaErrors.map(({ path, message }) => ({ path, message }));

  return {
    errors
  };
}

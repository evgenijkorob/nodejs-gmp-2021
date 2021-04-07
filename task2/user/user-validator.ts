import Joi from 'joi';
import { InitialUser } from './user-interface';

export class UserValidator {
  private static initialUserSchemaMap: Joi.SchemaMap<InitialUser> = {
    login: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().alphanum().min(8).required(),
    age: Joi.number().integer().min(4).max(130).required()
  };
  private static initialUserSchema: Joi.ObjectSchema<InitialUser> = Joi.object(UserValidator.initialUserSchemaMap);
  private static autoSuggestQueryParamsSchema: Joi.ObjectSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    loginSubstring: Joi.string().trim().required()
  });
  private static defaultOpts: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false
  };

  public validateInitialUser(initialUser: InitialUser): Joi.ValidationResult {
    return UserValidator.initialUserSchema.validate(initialUser, UserValidator.defaultOpts);
  }

  public validateAutoSuggestQueryParams(params): Joi.ValidationResult {
    return UserValidator.autoSuggestQueryParamsSchema.validate(params, UserValidator.defaultOpts);
  }
}

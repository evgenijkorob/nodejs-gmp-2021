import Joi from 'joi';
import { AutoSuggestUserQueryParams } from './user-request.interface';
import { PartialUserDTO, UserDTO } from './user.interface';

export class UserValidator {
  private static userIdSchema = Joi.number().integer().required().description('userId');
  private static userDTOSchema = Joi.object<UserDTO>({
    login: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().alphanum().min(8).required(),
    age: Joi.number().integer().min(4).max(130).required()
  });
  private static partialUserDTOSchema = Joi.object<PartialUserDTO>({
    login: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().alphanum().min(8),
    age: Joi.number().integer().min(4).max(130)
  });
  private static autoSuggestQueryParamsSchema = Joi.object<AutoSuggestUserQueryParams>({
    limit: Joi.number().integer().min(1).required(),
    loginSubstring: Joi.string().trim().required()
  });
  private static defaultOpts: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false
  };

  public validateUserId(id: string): Joi.ValidationResult {
    return UserValidator.userIdSchema.validate(
      id,
      UserValidator.defaultOpts
    );
  }

  public validateUserDTO(dto: UserDTO): Joi.ValidationResult {
    return UserValidator.userDTOSchema.validate(
      dto,
      UserValidator.defaultOpts
    );
  }

  public validatePartialUserDTO(dto: PartialUserDTO): Joi.ValidationResult {
    return UserValidator.partialUserDTOSchema.validate(
      dto,
      UserValidator.defaultOpts
    );
  }

  public validateAutoSuggestQueryParams(queryParams: AutoSuggestUserQueryParams): Joi.ValidationResult {
    return UserValidator.autoSuggestQueryParamsSchema.validate(
      queryParams,
      UserValidator.defaultOpts
    );
  }
}

import Joi from 'joi';
import { LoginRequestPayload } from './auth.interface';

export class AuthValidator {
  private static loginRequestPayloadSchema = Joi.object<LoginRequestPayload>({
    login: Joi.string().required(),
    password: Joi.string().required()
  });
  private static defaultOpts: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false
  };

  public validateLoginRequestPayload(payload: LoginRequestPayload): Joi.ValidationResult {
    return AuthValidator.loginRequestPayloadSchema.validate(
      payload,
      AuthValidator.defaultOpts
    );
  }
}

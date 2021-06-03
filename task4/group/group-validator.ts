import Joi from 'joi';
import { AddUsersToGroupBody } from './group-request.interface';
import { GroupPartialDTO, GroupDTO } from './group.interface';
import { PERMISSIONS } from './permission.constants';

export class GroupValidator {
  private static groupIdSchema = Joi.number().integer().required().description('groupId');
  private static groupDTOSchema = Joi.object<GroupDTO>({
    name: Joi.string().min(1).required(),
    permissions: Joi.array().min(1).allow(...PERMISSIONS).unique().required()
  });
  private static partialGroupDTOSchema = Joi.object<GroupPartialDTO>({
    name: Joi.string().min(1),
    permissions: Joi.array().min(1).allow(...PERMISSIONS).unique()
  });
  private static addUsersToGroupBodySchema = Joi.object<AddUsersToGroupBody>({
    userIds: Joi.array().min(1).allow(Joi.number().integer()).required()
  });
  private static defaultOpts: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false
  };

  public validateGroupId(id: string): Joi.ValidationResult {
    return GroupValidator.groupIdSchema.validate(
      id,
      GroupValidator.defaultOpts
    );
  }

  public validateGroupDTO(dto: GroupDTO): Joi.ValidationResult {
    return GroupValidator.groupDTOSchema.validate(
      dto,
      GroupValidator.defaultOpts
    );
  }

  public validateGroupPartialDTO(dto: GroupPartialDTO): Joi.ValidationResult {
    return GroupValidator.partialGroupDTOSchema.validate(
      dto,
      GroupValidator.defaultOpts
    );
  }

  public validateAddUsersToGroupBody(body: AddUsersToGroupBody): Joi.ValidationResult {
    return GroupValidator.addUsersToGroupBodySchema.validate(
      body,
      GroupValidator.defaultOpts
    );
  }
}

import {
  RequestHandler,
  RequestParamHandler,
  Router,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express';
import Joi from 'joi';
import { createErrorResponse, createValidationErrorResponse } from '../helpers';
import { NoGroupError, NotUniqueGroupError, NoUsersToAddError } from './group-errors';
import { GroupPartialDTO, Group, GroupDTO } from './group.interface';
import { GroupService } from './group-service';
import { GroupValidator } from './group-validator';
import { AddUsersToGroupBody, RequestWithGroupId } from './group-request.interface';
import { ControllerRequestLogger, getControllerRequestLogger } from '../middleware';
import { AppLogger } from '../loggers';

export class GroupController {
  private readonly router: Router;
  private readonly validator: GroupValidator;
  private readonly service: GroupService;
  private readonly requestLogger: ControllerRequestLogger;

  constructor(
    router: Router,
    service: GroupService,
    validator: GroupValidator,
    logger: AppLogger
  ) {
    this.service = service;
    this.validator = validator;
    this.requestLogger = getControllerRequestLogger(logger, 'group-controller');
    this.router = this.setupRouter(router);
  }

  public getRouter(): Router {
    return this.router;
  }

  private setupRouter(router: Router): Router {
    router
      .route('/groups')
      .get(
        this.requestLogger('getAllGroups'),
        this.getAllGroups.bind(this)
      )
      .post(
        this.requestLogger('validateGroupDTO'),
        this.validateGroupDTO.bind(this),
        this.requestLogger('createGroup'),
        this.createGroup.bind(this)
      );

    router.param('groupId', this.requestLogger('validateGroupIdParam'));
    router.param('groupId', this.validateGroupIdParam.bind(this));
    router.param('groupId', this.requestLogger('handleGroupIdParam'));
    router.param('groupId', this.handleGroupIdParam.bind(this));

    router
      .route('/groups/:groupId')
      .get(
        this.requestLogger('getGroup'),
        this.getGroup.bind(this)
      )
      .patch(
        this.requestLogger('validateGroupPartialDTO'),
        this.validateGroupPartialDTO.bind(this),
        this.requestLogger('patchGroup'),
        this.patchGroup.bind(this)
      )
      .delete(
        this.requestLogger('deleteGroup'),
        this.deleteGroup.bind(this)
      )
      .put(
        this.requestLogger('validateAddUsersToGroupBody'),
        this.validateAddUsersToGroupBody.bind(this),
        this.requestLogger('addUsersToGroup'),
        this.addUsersToGroup.bind(this)
      );

    router.use(this.handleServiceErrors.bind(this));

    return router;
  }

  private validateGroupIdParam: RequestParamHandler = (_, res, next, paramValue: string) => {
    this.handleValidationError(
      this.validator.validateGroupId(paramValue),
      res,
      next
    );
  }

  private validateGroupDTO: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validateGroupDTO(req.body as GroupDTO),
      res,
      next
    );
  }

  private validateGroupPartialDTO: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validateGroupPartialDTO(req.body as GroupPartialDTO),
      res,
      next
    );
  }

  private validateAddUsersToGroupBody: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validateAddUsersToGroupBody(req.body as AddUsersToGroupBody),
      res,
      next
    );
  }

  private handleValidationError(result: Joi.ValidationResult, res: Response, next: NextFunction): void {
    const error: Joi.ValidationError = result.error;

    if (!error) {
      return next();
    }

    res.status(400).json(createValidationErrorResponse(error.details));
  }

  private handleGroupIdParam: RequestParamHandler = (req: RequestWithGroupId, _, next, paramValue) => {
    const groupId: number = Number.parseInt(paramValue, 10);

    req.groupId = groupId;

    return next();
  }

  private getGroup: RequestHandler = async (req: RequestWithGroupId, res, next) => {
    try {
      const group: Group = await this.service.getGroupById(req.groupId);

      res.json(group);
    } catch (err) {
      return next(err);
    }
  }

  private getAllGroups: RequestHandler = async (_, res, next) => {
    try {
      const groups: Group[] = await this.service.getAllGroups();

      res.json(groups);
    } catch (err) {
      return next(err);
    }
  }

  private createGroup: RequestHandler = async (req, res, next) => {
    try {
      const newGroup: Group = await this.service.createGroup(req.body);

      res.status(201).json(newGroup);
    } catch (err) {
      return next(err);
    }
  }

  private patchGroup: RequestHandler = async (req: RequestWithGroupId, res, next) => {
    try {
      const updatedGroup: Group = await this.service.patchGroup(req.body, req.groupId);

      res.json(updatedGroup);
    } catch (err) {
      return next(err);
    }
  }

  private deleteGroup: RequestHandler = async (req: RequestWithGroupId, res, next) => {
    try {
      await this.service.deleteGroup(req.groupId);

      res.status(200);
    } catch (err) {
      return next(err);
    }
  }

  private addUsersToGroup: RequestHandler = async (req: RequestWithGroupId, res, next) => {
    try {
      const { userIds } = req.body as AddUsersToGroupBody;

      await this.service.addUsersToGroup(req.groupId, userIds);

      res.sendStatus(201);
    } catch (err) {
      return next(err);
    }
  }

  private handleServiceErrors: ErrorRequestHandler = (err, _, res, next) => {
    if (err instanceof NoGroupError) {
      return res.status(400).json(createErrorResponse('group not found'));
    }

    if (err instanceof NotUniqueGroupError) {
      return res.status(400).json(createErrorResponse('such group name already exists'));
    }

    if (err instanceof NoUsersToAddError) {
      const { notExistingUsersIds } = err;

      return res.status(400).json(createErrorResponse('some users not found', { notExistingUsersIds }));
    }

    return next(err);
  }
}

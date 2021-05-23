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
import { NoUserError, NotUniqueUserError } from './user-errors';
import { PartialUserDTO, User, UserDTO } from './user.interface';
import { UserService } from './user-service';
import { UserValidator } from './user-validator';
import { AutoSuggestUserQueryParams, RequestWithUserId } from './user-request.interface';

export class UserController {
  private readonly router: Router;
  private readonly validator: UserValidator;
  private readonly service: UserService;

  constructor(
    router: Router,
    service: UserService,
    validator: UserValidator
  ) {
    this.service = service;
    this.validator = validator;
    this.router = this.setupRouter(router);
  }

  public getRouter(): Router {
    return this.router;
  }

  private setupRouter(router: Router): Router {
    router
      .route('/users')
      .get(
        this.validateAutoSuggestQueryParams.bind(this),
        this.filterUsers.bind(this)
      )
      .post(
        this.validateUserDTO.bind(this),
        this.createUser.bind(this)
      );

    router.param('userId', this.validateUserIdParam.bind(this));
    router.param('userId', this.handleUserIdParam.bind(this));

    router
      .route('/users/:userId')
      .get(this.getUser.bind(this))
      .patch(
        this.validatePartialUserDTO.bind(this),
        this.patchUser.bind(this)
      )
      .delete(this.deleteUser.bind(this));

    router.use(this.handleServiceErrors.bind(this));

    return router;
  }

  private validateUserIdParam: RequestParamHandler = (_, res, next, paramValue: string) => {
    this.handleValidationError(
      this.validator.validateUserId(paramValue),
      res,
      next
    );
  }

  private validateAutoSuggestQueryParams: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validateAutoSuggestQueryParams(req.query as any as AutoSuggestUserQueryParams),
      res,
      next
    );
  }

  private validateUserDTO: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validateUserDTO(req.body as UserDTO),
      res,
      next
    );
  }

  private validatePartialUserDTO: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validatePartialUserDTO(req.body as PartialUserDTO),
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

  private handleUserIdParam: RequestParamHandler = (req: RequestWithUserId, _, next, paramValue) => {
    const userId: number = Number.parseInt(paramValue, 10);

    req.userId = userId;

    return next();
  }

  private filterUsers: RequestHandler = async (req, res, next) => {
    try {
      const queryParams = req.query as any as AutoSuggestUserQueryParams;
      const limit: number = Number.parseInt(queryParams.limit, 10);
      const filteredUsers: User[] = await this.service.filterUsers(queryParams.loginSubstring, limit);

      res.json(filteredUsers);
    } catch (err) {
      return next(err);
    }
  }

  private getUser: RequestHandler = async (req: RequestWithUserId, res, next) => {
    try {
      const user: User = await this.service.getUserById(req.userId);

      res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  private createUser: RequestHandler = async (req, res, next) => {
    try {
      const newUser: User = await this.service.createUser(req.body);

      res.status(201).json(newUser);
    } catch (err) {
      return next(err);
    }
  }

  private patchUser: RequestHandler = async (req: RequestWithUserId, res, next) => {
    try {
      const updatedUser: User = await this.service.patchUser(req.body, req.userId);

      res.json(updatedUser);
    } catch (err) {
      return next(err);
    }
  }

  private deleteUser: RequestHandler = async (req: RequestWithUserId, res, next) => {
    try {
      await this.service.deleteUser(req.userId);

      res.status(200);
    } catch (err) {
      return next(err);
    }
  }

  private handleServiceErrors: ErrorRequestHandler = (err, _, res, next) => {
    if (err instanceof NoUserError) {
      return res.status(400).json(createErrorResponse('user not found'));
    }

    if (err instanceof NotUniqueUserError) {
      return res.status(400).json(createErrorResponse('such login already in use'));
    }

    return next(err);
  }
}

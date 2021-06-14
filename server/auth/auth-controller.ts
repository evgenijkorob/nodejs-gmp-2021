import { NextFunction, Router, Response, RequestHandler, ErrorRequestHandler } from 'express';
import Joi from 'joi';
import { createErrorResponse, createValidationErrorResponse } from '../helpers';
import { AppLogger } from '../loggers';
import { ControllerRequestLogger, getControllerRequestLogger } from '../middleware';
import { EmptyTokenError, InvalidCredentialsError, InvalidTokenError } from './auth-errors';
import { AuthService } from './auth-service';
import { AuthValidator } from './auth-validator';
import { LoginRequestPayload } from './auth.interface';

export class AuthController {
  private readonly router: Router;
  private readonly validator: AuthValidator;
  private readonly service: AuthService;
  private readonly requestLogger: ControllerRequestLogger;

  constructor(
    router: Router,
    service: AuthService,
    validator: AuthValidator,
    logger: AppLogger
  ) {
    this.service = service;
    this.validator = validator;
    this.requestLogger = getControllerRequestLogger(logger, 'auth-controller');
    this.router = this.setupRouter(router);
  }

  public getRouter(): Router {
    return this.router;
  }

  public authenticate: RequestHandler = async (req, res, next) => {
    try {
      await this.service.verifyToken(req.headers['x-api-access'] as string);

      return next();
    } catch (err) {
      if (err instanceof EmptyTokenError) {
        return res.sendStatus(401);
      }

      if (err instanceof InvalidTokenError) {
        return res.sendStatus(403);
      }

      return next(err);
    }
  }

  private setupRouter(router: Router): Router {
    router
      .route('/login')
      .get(
        this.requestLogger('validateLoginRequestPayload'),
        this.validateLoginRequestPayload.bind(this),
        this.requestLogger('login'),
        this.login.bind(this)
      );

    router.use(this.handleServiceErrors.bind(this));

    return router;
  }

  private validateLoginRequestPayload: RequestHandler = (req, res, next) => {
    this.handleValidationError(
      this.validator.validateLoginRequestPayload(req.body as LoginRequestPayload),
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

  private login: RequestHandler = async (req, res, next) => {
    try {
      const token: string = await this.service.login(req.body);

      res.json({ token });
    } catch (err) {
      return next(err);
    }
  }

  private handleServiceErrors: ErrorRequestHandler = (err, _, res, next) => {
    if (err instanceof InvalidCredentialsError) {
      return res.status(400).json(createErrorResponse('Invalid login or password'));
    }

    return next(err);
  }
}

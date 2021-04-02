import { RequestHandler, RequestParamHandler, Response } from 'express';
import Joi from 'joi';
import { v1 as uuidv1 } from 'uuid';
import { createErrorResponse, createValidationErrorResponse } from '../helpers';
import { User, RequestWithUser, InitialUser } from './user-interface';
import { UserValidator } from './user-validator';

export class UserController {
  private readonly usersCollection: Map<string, User> = new Map();
  private readonly userValidator: UserValidator;

  constructor(userValidator: UserValidator) {
    this.userValidator = userValidator;
  }

  public getUserFromCollection: RequestParamHandler = (req: RequestWithUser, res, next, id: string) => {
    const user: User = this.usersCollection.get(id);

    if (user && user.isDeleted === false) {
      req.user = user;
      return next();
    }

    res.status(404).json(createErrorResponse('User not found'));
  };

  public getUser: RequestHandler = (req: RequestWithUser, res) => {
    const user: User = req.user;

    res.json(user);
  };

  public addUser: RequestHandler = (req, res) => {
    const initialUser: InitialUser = req.body;
    const result: Joi.ValidationResult = this.userValidator.validateInitialUser(initialUser);

    if (result.error) {
      return this.handleValidationError(result, res);
    }

    const existingUser: User = [
      ...this.usersCollection.values()
    ].find(user => user.login === initialUser.login);

    if (existingUser) {
      return res.status(400).json(createErrorResponse('User already exists'));
    }

    const newUser: User = {
      ...initialUser,
      id: uuidv1(),
      isDeleted: false
    };

    this.usersCollection.set(newUser.id, newUser);

    res.status(201).json(newUser);
  };

  public updateUser: RequestHandler = (req: RequestWithUser, res) => {
    const userToUpdate: User = req.user;
    const updatedInitialUser: InitialUser = req.body;
    const result: Joi.ValidationResult = this.userValidator.validateInitialUser(updatedInitialUser);

    if (result.error) {
      return this.handleValidationError(result, res);
    }

    const updatedUser: User = {
      ...userToUpdate,
      ...updatedInitialUser
    };

    this.usersCollection.set(userToUpdate.id, updatedUser);

    res.json(updatedInitialUser);
  };

  public deleteUser: RequestHandler = (req: RequestWithUser, res) => {
    const user: User = req.user;

    user.isDeleted = true;
    this.usersCollection.set(user.id, user);

    res.json({ deleted: user.id });
  };

  public getAutoSuggestUsers: RequestHandler = (req, res) => {
    const result: Joi.ValidationResult = this.userValidator.validateAutoSuggestQueryParams(req.query);

    if (result.error) {
      return this.handleValidationError(result, res);
    }

    const loginSubstring: string = req.query.loginSubstring as string;
    const limit: number = Number.parseInt(req.query.limit as string, 10);

    const findedUsers: User[] = [...this.usersCollection.values()]
      .filter((user: User): boolean => !user.isDeleted && user.login.includes(loginSubstring))
      .slice(0, limit);

    res.json(findedUsers);
  };

  private handleValidationError(result: Joi.ValidationResult, res: Response) {
    const { error } = result;

    res.status(400).json(createValidationErrorResponse(error.details));
  }
}

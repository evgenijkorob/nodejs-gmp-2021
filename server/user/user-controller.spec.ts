import express, { ErrorRequestHandler, Express, json, Router } from 'express';
// eslint-disable-next-line node/no-unpublished-import
import supertest from 'supertest';
import * as MockData from '../tests/mock-data';
import { AppLogger } from '../loggers';
import { UserController } from './user-controller';
import { USERS_BASE_URL } from './user-controller.constants';
import { UserService } from './user-service';
import { UserValidator } from './user-validator';
import { User, UserDTO } from './user.interface';
import { cloneDeep } from 'lodash';

describe('UsersController', () => {
  let mockUsers: User[];
  let mockUserDTO: UserDTO;
  let controller: UserController;
  let mockValidator: UserValidator;
  let mockService: UserService;
  let mockLogger: AppLogger;
  let mockGlobalErrorHandler: jest.Mock;
  let app: Express;

  beforeEach(() => {
    mockUsers = cloneDeep(MockData.mockUsers);
    mockUserDTO = cloneDeep(MockData.mockUserDTO);
    mockValidator = {
      validateAutoSuggestQueryParams: jest.fn().mockReturnValue({}),
      validatePartialUserDTO: jest.fn().mockReturnValue({}),
      validateUserDTO: jest.fn().mockReturnValue({}),
      validateUserId: jest.fn().mockReturnValue({})
    };
    mockService = {
      createUser: jest.fn(),
      deleteUser: jest.fn(),
      filterUsers: jest.fn(),
      getUserById: jest.fn(),
      patchUser: jest.fn()
    } as any;
    mockLogger = { info: jest.fn() } as any;
    controller = new UserController(Router(), mockService, mockValidator, mockLogger);

    // eslint-disable-next-line handle-callback-err, no-unused-vars
    const errorHandler: ErrorRequestHandler = (_, __, res, ___) => {
      res.sendStatus(500);
    };

    mockGlobalErrorHandler = jest.fn().mockImplementation(errorHandler);
    app = express()
      .use(json())
      .use(controller.getRouter())
      .use(mockGlobalErrorHandler);
  });

  describe('users auto suggest', () => {
    let loginSubstring: string;
    let limit: number;
    let filterUsersMock: jest.Mock<User[]>;

    beforeEach(() => {
      loginSubstring = 'jo';
      limit = 10;
      filterUsersMock = mockService.filterUsers as any;
    });

    it('should return 200 code with suggested users', async () => {
      filterUsersMock.mockReturnValue(mockUsers);

      const response = await supertest(app).get(`${USERS_BASE_URL}?loginSubstring=${loginSubstring}&limit=${10}`);

      expect(filterUsersMock).toHaveBeenCalledWith(loginSubstring, limit);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('create user', () => {
    let createUserMock: jest.Mock<User>;

    beforeEach(() => {
      createUserMock = mockService.createUser as any;
    });

    it('should return 201 code with created user', async () => {
      const createdUser: User = mockUsers[0];

      createUserMock.mockReturnValue(createdUser);

      const response = await supertest(app).post(USERS_BASE_URL).send(mockUserDTO);

      expect(createUserMock).toHaveBeenCalledWith(mockUserDTO);
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual(createdUser);
    });
  });

  describe('get user', () => {
    let getUserByIdMock: jest.Mock<User>;

    beforeEach(() => {
      getUserByIdMock = mockService.getUserById as any;
    });

    it('should return 200 code and requested user', async () => {
      const findedUser: User = mockUsers[0];
      const userId: number = findedUser.id;

      getUserByIdMock.mockReturnValue(findedUser);

      const response = await supertest(app).get(`${USERS_BASE_URL}/${userId}`);

      expect(getUserByIdMock).toHaveBeenCalledWith(userId);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(findedUser);
    });
  });

  describe('patch user', () => {
    let patchUserMock: jest.Mock<User>;

    beforeEach(() => {
      patchUserMock = mockService.patchUser as any;
    });

    it('should return 200 code and patched user', async () => {
      const userDTO: UserDTO = mockUserDTO;
      const patchedUser: User = mockUsers[0];
      const userId: number = patchedUser.id;

      patchUserMock.mockReturnValue(patchedUser);

      const response = await supertest(app).patch(`${USERS_BASE_URL}/${userId}`).send(userDTO);

      expect(patchUserMock).toHaveBeenCalledWith(userDTO, userId);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(patchedUser);
    });
  });

  describe('delete user', () => {
    let deleteUserMock: jest.Mock<Promise<void>>;

    beforeEach(() => {
      deleteUserMock = mockService.deleteUser as any;
    });

    it('should return 200 code and delete user', async () => {
      const userId: number = mockUsers[0].id;

      const response = await supertest(app).delete(`${USERS_BASE_URL}/${userId}`);

      expect(deleteUserMock).toHaveBeenCalledWith(userId);
      expect(response.statusCode).toEqual(200);
    });
  });
});

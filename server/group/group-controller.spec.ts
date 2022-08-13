import express, { ErrorRequestHandler, Express, json, Router } from 'express';
// eslint-disable-next-line node/no-unpublished-import
import supertest from 'supertest';
import * as MockData from '../tests/mock-data';
import { AppLogger } from '../loggers';
import { GroupController } from './group-controller';
import { GROUPS_BASE_URL } from './group-controller.constants';
import { GroupService } from './group-service';
import { GroupValidator } from './group-validator';
import { Group, GroupDTO } from './group.interface';
import { cloneDeep } from 'lodash';
import { AddUsersToGroupBody } from './group-request.interface';

describe('GroupsController', () => {
  let mockGroups: Group[];
  let mockGroupDTO: GroupDTO;
  let controller: GroupController;
  let mockValidator: GroupValidator;
  let mockService: GroupService;
  let mockLogger: AppLogger;
  let mockGlobalErrorHandler: jest.Mock;
  let app: Express;

  beforeEach(() => {
    mockGroups = cloneDeep(MockData.mockGroups);
    mockGroupDTO = cloneDeep(MockData.mockGroupDTO);
    mockValidator = {
      validateGroupDTO: jest.fn().mockReturnValue({}),
      validateGroupId: jest.fn().mockReturnValue({}),
      validateAddUsersToGroupBody: jest.fn().mockReturnValue({}),
      validateGroupPartialDTO: jest.fn().mockReturnValue({})
    };
    mockService = {
      createGroup: jest.fn(),
      deleteGroup: jest.fn(),
      getGroupById: jest.fn(),
      patchGroup: jest.fn(),
      addUsersToGroup: jest.fn(),
      getAllGroups: jest.fn()
    } as any;
    mockLogger = { info: jest.fn() } as any;
    controller = new GroupController(Router(), mockService, mockValidator, mockLogger);

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

  describe('create group', () => {
    let createGroupMock: jest.Mock<Group>;

    beforeEach(() => {
      createGroupMock = mockService.createGroup as any;
    });

    it('should return 201 code with created group', async () => {
      const createdGroup: Group = mockGroups[0];

      createGroupMock.mockReturnValue(createdGroup);

      const response = await supertest(app).post(GROUPS_BASE_URL).send(mockGroupDTO);

      expect(createGroupMock).toHaveBeenCalledWith(mockGroupDTO);
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual(createdGroup);
    });
  });

  describe('get group', () => {
    let getGroupByIdMock: jest.Mock<Group>;

    beforeEach(() => {
      getGroupByIdMock = mockService.getGroupById as any;
    });

    it('should return 200 code and requested group', async () => {
      const findedGroup: Group = mockGroups[0];
      const groupId: number = findedGroup.id;

      getGroupByIdMock.mockReturnValue(findedGroup);

      const response = await supertest(app).get(`${GROUPS_BASE_URL}/${groupId}`);

      expect(getGroupByIdMock).toHaveBeenCalledWith(groupId);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(findedGroup);
    });
  });

  describe('get all groups', () => {
    let getAllGroupsMock: jest.Mock<Group[]>;

    beforeEach(() => {
      getAllGroupsMock = mockService.getAllGroups as any;
    });

    it('should return 200 code and all groups', async () => {
      getAllGroupsMock.mockReturnValue(mockGroups);

      const response = await supertest(app).get(GROUPS_BASE_URL);

      expect(getAllGroupsMock).toHaveBeenCalled();
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(mockGroups);
    });
  });

  describe('patch group', () => {
    let patchGroupMock: jest.Mock<Group>;

    beforeEach(() => {
      patchGroupMock = mockService.patchGroup as any;
    });

    it('should return 200 code and patched group', async () => {
      const groupDTO: GroupDTO = mockGroupDTO;
      const patchedGroup: Group = mockGroups[0];
      const groupId: number = patchedGroup.id;

      patchGroupMock.mockReturnValue(patchedGroup);

      const response = await supertest(app).patch(`${GROUPS_BASE_URL}/${groupId}`).send(groupDTO);

      expect(patchGroupMock).toHaveBeenCalledWith(groupDTO, groupId);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(patchedGroup);
    });
  });

  describe('delete group', () => {
    let deleteGroupMock: jest.Mock<Promise<void>>;

    beforeEach(() => {
      deleteGroupMock = mockService.deleteGroup as any;
    });

    it('should return 200 code and delete group', async () => {
      const groupId: number = mockGroups[0].id;

      const response = await supertest(app).delete(`${GROUPS_BASE_URL}/${groupId}`);

      expect(deleteGroupMock).toHaveBeenCalledWith(groupId);
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('add users to group', () => {
    let addUsersToGroupMock: jest.Mock<Promise<void>>;

    beforeEach(() => {
      addUsersToGroupMock = mockService.addUsersToGroup as any;
    });

    it('should return 201 code and add users to group', async () => {
      const groupId: number = mockGroups[0].id;
      const requestBody: AddUsersToGroupBody = {
        userIds: cloneDeep(MockData.mockUsers).map(user => user.id)
      };

      const response = await supertest(app).put(`${GROUPS_BASE_URL}/${groupId}`).send(requestBody);

      expect(addUsersToGroupMock).toHaveBeenCalledWith(groupId, requestBody.userIds);
      expect(response.statusCode).toEqual(201);
    });
  });
});

import { Sequelize } from 'sequelize';
import { dbConfig } from '../config';
import { GroupModel, defineGroupModel } from '../group';
import { AppLogger } from '../loggers';
import { UserModel, defineUserModel, UserCreationAttributes } from '../user';
import { defineUserGroupModel } from '../user-group';
import { readFile } from 'fs/promises';
import * as path from 'path';

export type AppModels = [UserModel, GroupModel];

const instanceName = 'models-loader';

async function checkConnection(connection: Sequelize, logger: AppLogger): Promise<void> {
  try {
    await connection.authenticate();

    logger.info('connection to the database has been established successfully', {
      instance: instanceName,
      method: 'checkConnection'
    });
  } catch (error) {
    logger.error('unable to connect to the database', {
      instance: instanceName,
      method: 'checkConnection'
    });

    throw error;
  }
}

export async function loadModels(logger: AppLogger): Promise<AppModels> {
  const sequelize = new Sequelize(dbConfig);

  await checkConnection(sequelize, logger);

  try {
    const userModel: UserModel = await defineUserModel(sequelize);
    const groupModel: GroupModel = await defineGroupModel(sequelize);

    await defineUserGroupModel(sequelize, userModel, groupModel);

    logger.info('models defined', {
      instance: instanceName,
      method: 'loadModels'
    });

    return [userModel, groupModel];
  } catch (err) {
    logger.error('cannot define models', {
      instance: instanceName,
      method: 'loadModels'
    });

    throw err;
  }
}

export async function insertInitialUsers(userModel: UserModel, logger: AppLogger): Promise<void> {
  try {
    const { count } = await userModel.findAndCountAll();

    if (count === 0) {
      const usersToInsertJSON: string = await readFile(path.join(__dirname, './initial-users.json'), { encoding: 'utf-8' });
      const usersToInsert: UserCreationAttributes[] = JSON.parse(usersToInsertJSON);

      for (const userToCreate of usersToInsert) {
        await userModel.create(userToCreate);
      }

      logger.info('initial users successfully inserted', {
        instance: instanceName,
        method: 'insertInitialUsers'
      });
    }
  } catch (err) {
    logger.error('error when trying to insert initial users', {
      instance: instanceName,
      method: 'insertInitialUsers'
    });
  }
}

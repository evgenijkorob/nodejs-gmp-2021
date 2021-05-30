import { Sequelize } from 'sequelize';
import { dbConfig } from '../config';
import { GroupModel, defineGroupModel } from '../group';
import { AppLogger } from '../loggers';
import { UserModel, defineUserModel } from '../user';
import { defineUserGroupModel } from '../user-group';

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

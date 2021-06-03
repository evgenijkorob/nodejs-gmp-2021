import { Sequelize } from 'sequelize';
import { dbConfig } from '../config';
import { GroupModel, defineGroupModel } from '../group';
import { UserModel, defineUserModel } from '../user';
import { defineUserGroupModel } from '../user-group';

export type AppModels = [UserModel, GroupModel];

const loaderLog = console.log.bind(console, '[MODELS LOADER LOG] ');
const loaderError = console.error.bind(console, '[MODELS LOADER ERROR] ');

async function checkConnection(connection: Sequelize): Promise<void> {
  try {
    await connection.authenticate();
    loaderLog('Connection to the database has been established successfully.');
  } catch (error) {
    loaderError('Unable to connect to the database');

    throw error;
  }
}

export async function loadModels(): Promise<AppModels> {
  const sequelize = new Sequelize(dbConfig);

  await checkConnection(sequelize);

  try {
    const userModel: UserModel = await defineUserModel(sequelize);
    const groupModel: GroupModel = await defineGroupModel(sequelize);

    await defineUserGroupModel(sequelize, userModel, groupModel);

    return [userModel, groupModel];
  } catch (err) {
    loaderError('Cannot define models');

    throw err;
  }
}

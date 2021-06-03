import express, { Express, json } from 'express';
import { Sequelize } from 'sequelize';
import { dbConfig, serverConfig } from './config';
import { handleAllErrors } from './middleware';
import { configureController, UserController } from './user';

async function checkConnection(connection: Sequelize): Promise<void> {
  try {
    await connection.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);

    throw error;
  }
}

async function startupApplication(): Promise<void> {
  const sequelize = new Sequelize(dbConfig);

  await checkConnection(sequelize);

  const userController: UserController = await configureController(sequelize);

  const app: Express = express();
  const port: number = serverConfig.port;

  app
    .use(json())
    .use('/api/v1', userController.getRouter())
    .use(handleAllErrors);

  app.listen(port, () => console.log(`Running on http://localhost:${port}/`));
}

startupApplication();

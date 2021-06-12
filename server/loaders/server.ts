import express, { Express, json } from 'express';
import { serverConfig } from '../config';
import { AppLogger } from '../loggers';
import { handleAllErrors } from '../middleware';
import { AppControllers } from './controller';
import cors from 'cors';

export async function configureServer(controllers: AppControllers, logger: AppLogger): Promise<void> {
  const [authController, userController, groupController] = controllers;
  const app: Express = express();
  const port: number = serverConfig.port;

  app
    .use(cors())
    .use(json())
    .use('/', authController.getRouter())
    .use(
      '/api/v1',
      authController.authenticate.bind(authController),
      userController.getRouter(),
      groupController.getRouter()
    )
    .use(handleAllErrors(logger));

  return new Promise((resolve) => {
    app.listen(port, () => {
      logger.info(`running on http://localhost:${port}/`, {
        instance: 'server-loader',
        method: 'configureServer'
      });

      resolve();
    });
  });
}

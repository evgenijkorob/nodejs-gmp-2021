import express, { Express, json } from 'express';
import { serverConfig } from '../config';
import { AppLogger } from '../loggers';
import { handleAllErrors } from '../middleware';
import { AppControllers } from './controller';

export async function configureServer(controllers: AppControllers, logger: AppLogger): Promise<void> {
  const [userController, groupController] = controllers;
  const app: Express = express();
  const port: number = serverConfig.port;

  app
    .use(json())
    .use('/api/v1', userController.getRouter())
    .use('/api/v1', groupController.getRouter())
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

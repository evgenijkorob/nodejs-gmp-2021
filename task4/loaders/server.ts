import express, { Express, json } from 'express';
import { serverConfig } from '../config';
import { handleAllErrors } from '../middleware';
import { AppControllers } from './controller';

export function configureServer(controllers: AppControllers): void {
  const [userController, groupController] = controllers;
  const app: Express = express();
  const port: number = serverConfig.port;

  app
    .use(json())
    .use('/api/v1', userController.getRouter())
    .use('/api/v1', groupController.getRouter())
    .use(handleAllErrors);

  app.listen(port, () => console.log(`Running on http://localhost:${port}/`));
}

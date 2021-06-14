import { AppControllers, loadControllers } from './controller';
import { appLogger, AppLogger } from '../loggers';
import { setProcessLogging } from './logging';
import { AppModels, insertInitialUsers, loadModels } from './models';
import { configureServer } from './server';

export async function startupApplication(): Promise<void> {
  const logger: AppLogger = appLogger;

  setProcessLogging(logger);

  try {
    const models: AppModels = await loadModels(logger);
    const [userModel] = models;

    await insertInitialUsers(userModel, logger);

    const controllers: AppControllers = loadControllers(models, logger);

    await configureServer(controllers, logger);

    logger.info('started successfully', {
      instance: 'app-loader',
      method: 'startupApplication'
    });
  } catch (err) {
    logger.info('failed to start', {
      instance: 'app-loader',
      method: 'startupApplication',
      error: err.original || err
    });

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
